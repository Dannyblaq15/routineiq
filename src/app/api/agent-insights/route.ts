export const dynamic = 'force-dynamic';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { getMemory } from '../../../lib/memoryStore';
import { verifyAuth } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req);
    const qwen = createOpenAI({
      baseURL: process.env.QWEN_BASE_URL || 'https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
      apiKey: process.env.QWEN_API_KEY,
    });

    const memory = await getMemory(userId);

    const memoryContext = `
USER PREFERENCES:
${JSON.stringify(memory.preferences, null, 2)}

CURRENT INVENTORY:
${memory.inventory.map((i: any) => `- ${i.name} (${i.phase})`).join('\n')}

PAST EPISODES (HISTORY):
${memory.episodes.slice(0, 10).map((e: any) => `[${e.occurredAt}] ${e.title}: ${e.summary}`).join('\n')}
    `;

    const result = await generateText({
      model: qwen('qwen-plus'),
      system: `You are RoutineIQ Agent, an autonomous Category 1 Memory Agent. Based on the user's memory context (preferences, inventory, and history), generate 1-3 actionable insights or decisions. Be direct, authoritative, and helpful. 
IMPORTANT: You MUST return ONLY valid JSON matching this exact structure:
{
  "insights": [
    {
      "decisionType": "simplify_routine, agent_alert, product_conflict, or routine_optimization",
      "title": "A short, actionable title",
      "reasoning": "A detailed explanation based on their specific inventory or reports",
      "confidence": 0.95
    }
  ]
}
Do not include any conversational text, markdown formatting, or backticks. Return ONLY the JSON object.`,
      messages: [
        {
          role: 'user',
          content: `Memory Context:\n${memoryContext}\n\nAnalyze this data and generate personalized insights.`,
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
    console.error('🔥 Agent Insights API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred in Qwen API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
