import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const qwen = createOpenAI({
  baseURL: process.env.QWEN_BASE_URL || 'https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { chemicals } = await req.json();

    const result = await generateObject({
      model: qwen('qwen-plus'),
      system: 'You are RoutineIQ Agent, an expert cosmetic chemist and formulation scientist. Analyze the provided list of skincare chemicals/ingredients and determine their compatibility, safety status, and potential interactions.',
      messages: [
        {
          role: 'user',
          content: `Analyze the following chemicals for compatibility: ${JSON.stringify(chemicals)}`,
        },
      ],
      schema: z.object({
        status: z.enum(['Safe', 'Caution', 'Danger']).describe('The overall safety status of combining these chemicals.'),
        compatibilityScore: z.number().min(0).max(100).describe('A score from 0-100 indicating how compatible these chemicals are together.'),
        interactions: z.array(z.object({
          pair: z.string().describe('The pair of chemicals interacting, e.g., "Retinol + Vitamin C"'),
          description: z.string().describe('A detailed description of the interaction, potential side effects, or benefits.'),
          type: z.enum(['negative', 'positive', 'neutral']).describe('The nature of the interaction.')
        })),
        recommendation: z.string().describe('A final recommendation for the user on how to use these chemicals safely.')
      }),
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('🔥 Analyze Chemicals API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred in Qwen API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
