import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const qwen = createOpenAI({
  baseURL: process.env.QWEN_BASE_URL || 'https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { reportText } = await req.json();

    const result = await generateObject({
      model: qwen('qwen-plus'),
      system: 'You are RoutineIQ Agent, an expert clinical dermatologist AI. Analyze the provided clinical report text and extract the diagnosis, recommended substances, active conflicts, and severity level.',
      messages: [
        {
          role: 'user',
          content: `Clinical Report:\n${reportText}\n\nExtract the structured data.`,
        },
      ],
      schema: z.object({
        diagnosis: z.string().describe('The primary patient diagnosis extracted from the report.'),
        substances: z.array(z.string()).describe('List of recommended substances or active ingredients.'),
        conflicts: z.array(z.string()).describe('List of any strict chemical conflicts or warnings mentioned.'),
        severity: z.enum(['High', 'Medium', 'Low']).describe('The severity of the condition.'),
      }),
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('🔥 Analyze Report API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred in Qwen API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
