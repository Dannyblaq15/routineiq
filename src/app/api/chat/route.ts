import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getMemory, updatePreferences } from '../../../lib/memoryStore';

// Initialize Qwen using DashScope compatible endpoint for the specific workspace
const qwen = createOpenAI({
  baseURL: process.env.QWEN_BASE_URL || 'https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('✅ API /api/chat hit with messages:', JSON.stringify(messages, null, 2));

    // Vercel AI SDK v4 frontend sends UIMessages with `parts`, but streamText expects `content`
    const coreMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.parts 
        ? m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') 
        : m.content || '',
    }));

    const memory = getMemory();
    
    // Convert memory into a readable format for the system prompt
    const memoryContext = `
USER PREFERENCES:
${JSON.stringify(memory.preferences, null, 2)}

CURRENT INVENTORY:
${memory.inventory.map(i => `- ${i.name} (${i.phase})`).join('\n')}

PAST EPISODES (HISTORY):
${memory.episodes.slice(0, 10).map(e => `[${e.occurredAt}] ${e.title}: ${e.summary}`).join('\n')}
    `;

    const result = streamText({
      model: qwen('qwen-plus'),
      messages: coreMessages,
      system: `You are RoutineIQ, an autonomous Category 1 Memory Agent helping a user manage their skincare routine. 
You possess long-term memory. You must proactively recall past episodes and respect user preferences.
If a user mentions a new preference (e.g. "I hate fragrance" or "My budget is $50"), use the update_preference tool to log it permanently.

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
            updatePreferences(args);
            return `Preferences updated successfully to: ${JSON.stringify(args)}`;
          }
        })
      },
      onError: ({ error }) => {
        console.error('🔥 Async Stream Error:', error);
        require('fs').writeFileSync('debug-error-async.log', JSON.stringify(error, Object.getOwnPropertyNames(error as any), 2));
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
