import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getMemory, updatePreferences } from '../../../lib/memoryStore';
import db from '../../../lib/db';

// Initialize Qwen using DashScope compatible endpoint for the specific workspace
const qwen = createOpenAI({
  baseURL: process.env.QWEN_BASE_URL || 'https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

import { verifyAuth } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req);
    const { messages } = await req.json();
    console.log('✅ API /api/chat hit with messages:', JSON.stringify(messages, null, 2));

    // Vercel AI SDK v4 frontend sends UIMessages with `parts`, but streamText expects `content`
    const coreMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.parts 
        ? m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') 
        : m.content || '',
    }));

    const memory = await getMemory(userId);
    const routineSteps = await (db as any).routineStep.findMany({ 
      where: { userId },
      orderBy: [{ period: 'asc' }, { stepNumber: 'asc' }] 
    });
    
    // Convert memory into a readable format for the system prompt
    const memoryContext = `
USER PREFERENCES:
${JSON.stringify(memory.preferences, null, 2)}

CURRENT INVENTORY:
${memory.inventory.map(i => `- ${i.name} (${i.phase})`).join('\n')}

PAST EPISODES (HISTORY):
${memory.episodes.slice(0, 10).map((e: any) => `[${e.occurredAt}] ${e.title}: ${e.summary}`).join('\n')}

ACTIVE ROUTINE:
${routineSteps.length > 0 ? routineSteps.map(s => `[${s.period.toUpperCase()} Step ${s.stepNumber}] ${s.brand} ${s.productName} (${s.keyIngredient}) - ${s.whyIncluded}`).join('\n') : 'No routine set yet.'}
    `;

    const result = streamText({
      model: qwen('qwen-plus'),
      messages: coreMessages,
      system: `# RoutineIQ System Prompt

You are RoutineIQ, a personal AI assistant that helps users build, track, and 
stick to routines (habits, schedules, goals, self-care). You remember past 
context and use it to personalize guidance over time.

## Response Rules

- Be concise. Default to 2-4 sentences unless the user's request genuinely 
  needs more (e.g., a multi-step plan).
- Answer directly first — no preamble, no restating the question.
- Use bullets only for actual multi-step or multi-item content, not for 
  padding a short answer.
- Bold only the 1-2 most important details (a number, a time, an action).
- Skip the "Bottom line" summary unless the response is long enough to need one.

## Memory Usage

- Reference relevant past routines, goals, or patterns naturally and briefly 
  (e.g., "4/5 days this week" not a paragraph recapping history).
- If context is missing, ask one short clarifying question instead of guessing.

## Tone

- Warm, encouraging, plain language. No jargon.
- Treat missed days/streaks as normal, not failures — brief reassurance, not a 
  speech.
- Never diagnose (no "this sounds like ADHD/depression" etc.). Flag genuinely 
  unhealthy patterns briefly, then move on.
- Suggestions, not commands — it's their routine.

${memoryContext}`,
      tools: {
        update_preference: tool({
          description: 'Update the user\'s long-term preferences in the memory store.',
          parameters: z.object({
            fragranceSensitive: z.boolean().optional(),
            budgetMonthlyAvg: z.number().optional(),
            brandAvoidance: z.array(z.string()).optional(),
            complexity: z.enum(['minimal', 'moderate', 'full']).optional()
          }),
          // @ts-ignore: TS inference error for tool execute
          execute: async (args: { fragranceSensitive?: boolean; budgetMonthlyAvg?: number; brandAvoidance?: string[]; complexity?: 'minimal' | 'moderate' | 'full' }) => {
            await updatePreferences(userId, args);
            return `Preferences updated successfully to: ${JSON.stringify(args)}`;
          }
        }),
        add_inventory_item: tool({
          description: 'Add a new product to the user\'s skincare inventory.',
          parameters: z.object({
            name: z.string().describe('The name of the product'),
            phase: z.string().describe('The routine phase (e.g., "Morning", "Evening", "Treatment")'),
            category: z.string().describe('The product category (e.g., "Cleanser", "Serum", "Moisturizer")'),
            statusText: z.string().describe('A short status phrase (e.g., "Good match", "Contains active")'),
            statusType: z.enum(['error', 'warning', 'normal', 'success']).describe('Status color type'),
            tags: z.array(z.string()).optional().describe('Optional tags for ingredients or features')
          }),
          // @ts-ignore
          execute: async (args: { name: string; phase: string; category: string; statusText: string; statusType: string; tags?: string[] }) => {
            const newItem = await (db as any).inventoryItem.create({
              data: {
                name: args.name,
                phase: args.phase,
                category: args.category,
                statusText: args.statusText,
                statusType: args.statusType,
                tags: args.tags || [],
                compatibility: 100,
                imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=200&auto=format&fit=crop',
                userId
              }
            });
            return `Successfully added ${args.name} to the inventory.`;
          }
        })
      },
      onError: ({ error }) => {
        console.error('🔥 Async Stream Error:', error);
        require('fs').writeFileSync('debug-error-async.log', JSON.stringify(error, Object.getOwnPropertyNames(error as any), 2));
      },
      onFinish: async ({ text }) => {
        // Log the interaction to the database memory timeline
        const lastUserMessage = coreMessages.filter((m: any) => m.role === 'user').pop();
        if (lastUserMessage) {
          const { addEpisode } = await import('../../../lib/memoryStore');
          await addEpisode(userId, {
            episodeType: 'agent_learning',
            title: 'Chat Interaction',
            summary: `User asked: "${lastUserMessage.content.slice(0, 100)}${lastUserMessage.content.length > 100 ? '...' : ''}"`,
            isVisibleToUser: true,
            agentId: 'chat-agent'
          });
        }
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('🔥 API Route Error:', error);
    require('fs').writeFileSync('debug-error.log', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred in Qwen API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
