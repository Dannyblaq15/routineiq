import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST(req: Request) {
  try {
    const qwen = createOpenAI({
      baseURL: process.env.QWEN_BASE_URL || 'https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
      apiKey: process.env.QWEN_API_KEY,
    });

    const { reportText } = await req.json();

    const result = await generateText({
      model: qwen('qwen-plus'),
      system: `You are RoutineIQ Agent, an expert clinical dermatologist AI. Analyze the provided clinical report text and extract the diagnosis, recommended substances, active conflicts, and severity level. 
IMPORTANT: You MUST return ONLY valid JSON matching this exact structure:
{
  "diagnosis": "The primary patient diagnosis extracted from the report",
  "substances": ["List", "of", "recommended", "substances"],
  "conflicts": ["List", "of", "conflicts"],
  "severity": "High, Medium, or Low"
}
Do not include any conversational text, markdown formatting, or backticks. Return ONLY the JSON object.`,
      messages: [
        {
          role: 'user',
          content: `Clinical Report:\n${reportText}\n\nExtract the structured data.`,
        },
      ]
    });

    // Clean markdown code blocks if the AI still includes them
    const cleanedText = result.text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedText);

    return new Response(JSON.stringify(parsedData), {
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
