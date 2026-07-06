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
${memory.episodes.map(e => `[${e.occurredAt}] ${e.title}: ${e.summary}`).join('\n')}
    `;

    const result = await generateObject({
      model: qwen('qwen-plus'),
      system: 'You are RoutineIQ Agent, an autonomous Category 1 Memory Agent. Analyze the patient\'s entire memory history to generate a 6-month progress report and an overall routine score. Base your evaluation heavily on their actual episode history.',
      messages: [
        {
          role: 'user',
          content: `Memory Context:\n${memoryContext}\n\nGenerate realistic progress trends and routine score based on this data.`,
        },
      ],
      schema: z.object({
        historicalSeries: z.array(z.object({
          month: z.string().describe('Month and Year, e.g. "May 2026"'),
          scans: z.number(),
          conflicts: z.number(),
          complianceRate: z.number().min(0).max(100),
        })).length(6).describe('Generate exactly 6 months of historical data.'),
        conditionDistribution: z.array(z.object({
          name: z.string().describe('Name of the condition, e.g. "Active Acne Inflammation"'),
          percentage: z.number(),
          color: z.string(),
          fill: z.string(),
        })).describe('Distribution of treated conditions.'),
        routineScore: z.object({
          compatibility: z.number().min(0).max(100),
          effectiveness: z.number().min(0).max(100),
          costEfficiency: z.number().min(0).max(100),
          compliance: z.number().min(0).max(100),
        }).describe('The current routine scores based on the current inventory and usage history.')
      }),
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('🔥 Patient Progress API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred in Qwen API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
