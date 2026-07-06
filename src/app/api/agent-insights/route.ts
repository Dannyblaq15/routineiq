import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getMemory } from '../../../lib/memoryStore';

const qwen = createOpenAI({
  baseURL: process.env.QWEN_BASE_URL || 'https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

export async function POST(req: Request) {
  try {
    const memory = getMemory();

    const memoryContext = `
USER PREFERENCES:
${JSON.stringify(memory.preferences, null, 2)}

CURRENT INVENTORY:
${memory.inventory.map(i => `- ${i.name} (${i.phase})`).join('\n')}

PAST EPISODES (HISTORY):
${memory.episodes.slice(0, 10).map(e => `[${e.occurredAt}] ${e.title}: ${e.summary}`).join('\n')}
    `;

    const result = await generateObject({
      model: qwen('qwen-plus'),
      system: 'You are RoutineIQ Agent, an autonomous Category 1 Memory Agent. Based on the user\'s memory context (preferences, inventory, and history), generate 1-3 actionable insights or decisions. Be direct, authoritative, and helpful.',
      messages: [
        {
          role: 'user',
          content: `Memory Context:\n${memoryContext}\n\nAnalyze this data and generate personalized insights.`,
        },
      ],
      schema: z.object({
        insights: z.array(z.object({
          decisionType: z.enum(['simplify_routine', 'agent_alert', 'product_conflict', 'routine_optimization']),
          title: z.string().describe('A short, actionable title for the insight.'),
          reasoning: z.string().describe('A detailed explanation of why this insight is being recommended based on their specific inventory or reports.'),
          confidence: z.number().min(0).max(1).describe('A confidence score between 0 and 1 representing how certain you are about this insight.')
        }))
      }),
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('🔥 Agent Insights API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred in Qwen API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
