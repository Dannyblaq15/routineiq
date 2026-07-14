export const dynamic = 'force-dynamic';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { verifyAuth } from '../../../lib/auth';
import db from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req);
    const qwen = createOpenAI({
      baseURL: process.env.QWEN_BASE_URL || 'https://ws-8nvmb1m9ou8t76hn.cn-beijing.maas.aliyuncs.com/compatible-mode/v1',
      apiKey: process.env.QWEN_API_KEY,
    });

    const body = await req.json();
    const { reportText, image } = body;

    let result;

    if (image) {
      // Image upload - parse with qwen3.5-ocr vision model
      console.log('Analyzing clinical report image using qwen3.5-ocr...');
      const base64Data = image.includes(';base64,') ? image.split(';base64,')[1] : image;
      const mediaType = image.match(/data:([^;]+)/)?.[1] || 'image/jpeg';

      result = await generateText({
        model: qwen('qwen3.5-ocr'),
        system: `You are RoutineIQ Agent, an expert clinical dermatologist AI. Analyze the provided clinical report image and extract the diagnosis, recommended substances, active conflicts, and severity level. 
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
            content: [
              { type: 'text', text: 'Extract the structured clinical analysis from this report image.' },
              { type: 'file', data: base64Data, mediaType },
            ]
          }
        ]
      });
    } else {
      // Text input - parse with qwen-plus text model
      console.log('Analyzing clinical report text using qwen-plus...');
      result = await generateText({
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
    }

    // Clean markdown code blocks if the AI still includes them
    const cleanedText = result.text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedText);

    // Save PatientAnalysis report to database
    try {
      await (db as any).patientAnalysis.create({
        data: {
          type: parsedData.diagnosis || 'Diagnosis',
          clinician: "Dr. Aris (AI Analyst)",
          status: "COMPLETE",
          severity: parsedData.severity || 'Medium',
          userId
        }
      });
    } catch (dbErr) {
      console.error('Failed to save PatientAnalysis to database:', dbErr);
    }

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
