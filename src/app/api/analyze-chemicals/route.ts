export const dynamic = 'force-dynamic';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { verifyAuth } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req);
    const qwen = createOpenAI({
      baseURL: process.env.QWEN_BASE_URL || 'https://ws-8nvmb1m9ou8t76hn.cn-beijing.maas.aliyuncs.com/compatible-mode/v1',
      apiKey: process.env.QWEN_API_KEY,
    });

    const { chemicals } = await req.json();

    const result = await generateText({
      model: qwen('qwen-plus'),
      system: `You are RoutineIQ Agent, an expert cosmetic chemist and formulation scientist. Analyze the provided list of skincare chemicals/ingredients and determine their compatibility, safety status, and potential interactions. 
IMPORTANT: You MUST return ONLY valid JSON matching this exact structure:
{
  "status": "Safe, Caution, or Danger",
  "compatibilityScore": 85,
  "interactions": [
    {
      "pair": "Chemical A + Chemical B",
      "description": "Detailed description of interaction",
      "type": "Negative, positive, or neutral"
    }
  ],
  "recommendation": "Final recommendation string"
}
Do not include any conversational text, markdown formatting, or backticks. Return ONLY the JSON object.`,
      messages: [
        {
          role: 'user',
          content: `Analyze the following chemicals for compatibility: ${JSON.stringify(chemicals)}`,
        },
      ]
    });

    const cleanedText = result.text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedText);

    return new Response(JSON.stringify(parsedData), {
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
