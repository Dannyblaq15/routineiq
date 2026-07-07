import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { verifyAuth } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req);
    const qwen = createOpenAI({
      baseURL: process.env.QWEN_BASE_URL || 'https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
      apiKey: process.env.QWEN_API_KEY,
    });

    const { image } = await req.json();

    if (!image) {
      return new Response(JSON.stringify({ error: 'No image provided' }), { status: 400 });
    }

    // `image` should be a base64 data URL from the client (e.g. data:image/jpeg;base64,...)
    // The Vercel AI SDK automatically handles data URLs in the image field.
    const result = await generateText({
      model: qwen(process.env.QWEN_VL_MODEL || 'qwen-vl-plus'),
      system: `You are an expert cosmetic chemist and skincare analyst. Analyze the provided image of a skincare product and extract its details. Be precise. 
IMPORTANT: You MUST return ONLY valid JSON matching this exact structure:
{
  "name": "Product name and brand",
  "phase": "Application phase (e.g. Cleansing, Treatment, Moisturizing)",
  "category": "Category of the product",
  "tags": ["List", "of", "active", "ingredients"],
  "compatibility": 85
}
Do not include any conversational text, markdown formatting, or backticks. Return ONLY the JSON object.`,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract the product name, phase, category, active ingredients (tags), and compatibility score.' },
            { type: 'image', image }
          ],
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
    console.error('🔥 Scan Product API Error:', error);
    
    // Fallback for Workspace accounts without Vision model access
    if (error.message?.includes('Unsupported model') || error.message?.includes('qwen-vl')) {
      console.log('Falling back to mock scan result due to unsupported vision model.');
      return new Response(JSON.stringify({
        name: "Mocked Skincare Product",
        phase: "Treatment",
        category: "Serum",
        tags: ["Niacinamide", "Vitamin C"],
        compatibility: 90
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred in Qwen-VL API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
