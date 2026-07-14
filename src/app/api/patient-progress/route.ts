export const dynamic = 'force-dynamic';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { getMemory } from '../../../lib/memoryStore';
import { verifyAuth } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req);
    const qwen = createOpenAI({
      baseURL: process.env.QWEN_BASE_URL || 'https://ws-8nvmb1m9ou8t76hn.cn-beijing.maas.aliyuncs.com/compatible-mode/v1',
      apiKey: process.env.QWEN_API_KEY,
    });

    const memory = await getMemory(userId);

    const memoryContext = `
USER PREFERENCES:
${JSON.stringify(memory.preferences, null, 2)}

CURRENT INVENTORY:
${memory.inventory.map(i => `- ${i.name} (${i.phase})`).join('\n')}

PAST EPISODES (HISTORY):
${memory.episodes.map(e => `[${e.occurredAt}] ${e.title}: ${e.summary}`).join('\n')}
    `;

    const result = await generateText({
      model: qwen(process.env.QWEN_MODEL || 'qwen-plus'),
      system: `You are RoutineIQ Agent, an autonomous Category 1 Memory Agent. Analyze the patient's entire memory history to generate a 6-month progress report and an overall routine score. Base your evaluation heavily on their actual episode history. 
IMPORTANT: You MUST return ONLY valid JSON matching this exact structure:
{
  "historicalSeries": [
    {
      "month": "Month and Year, e.g. May 2026",
      "scans": 5,
      "conflicts": 1,
      "complianceRate": 85
    }
  ],
  "conditionDistribution": [
    {
      "name": "Condition name",
      "percentage": 50,
      "color": "color string",
      "fill": "fill string"
    }
  ],
  "routineScore": {
    "compatibility": 90,
    "effectiveness": 85,
    "costEfficiency": 70,
    "compliance": 95
  }
}
Generate exactly 6 months of historical data. Do not include any conversational text, markdown formatting, or backticks. Return ONLY the JSON object.`,
      messages: [
        {
          role: 'user',
          content: `Memory Context:\n${memoryContext}\n\nGenerate realistic progress trends and routine score based on this data.`,
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
    console.error('🔥 Patient Progress API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred in Qwen API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
