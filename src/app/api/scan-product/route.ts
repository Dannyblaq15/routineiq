import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const qwen = createOpenAI({
  baseURL: process.env.QWEN_BASE_URL || 'https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(JSON.stringify({ error: 'No image provided' }), { status: 400 });
    }

    // `image` should be a base64 data URL from the client (e.g. data:image/jpeg;base64,...)
    // The Vercel AI SDK automatically handles data URLs in the image field.
    const result = await generateObject({
      model: qwen('qwen-vl-max'),
      system: 'You are an expert cosmetic chemist and skincare analyst. Analyze the provided image of a skincare product and extract its details. Be precise.',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract the product name, phase, category, active ingredients (tags), and compatibility score.' },
            { type: 'image', image }
          ],
        },
      ],
      schema: z.object({
        name: z.string().describe('The name of the product, including brand if visible.'),
        phase: z.enum(['Cleansing Phase', 'Hydration Phase', 'Treatment Phase', 'Prevention Phase', 'Suncare Phase']).describe('The application phase this product belongs to.'),
        category: z.enum(['Serum', 'Moisturizer', 'Cleanser', 'Toner', 'Sunscreen', 'Treatment']).describe('The category of the skincare product.'),
        tags: z.array(z.string()).describe('A list of up to 5 key active ingredients or notable properties (e.g. Niacinamide, BHA).'),
        compatibility: z.number().min(10).max(100).describe('An estimated biological compatibility score (0-100) for general skin types.'),
      }),
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('🔥 Scan Product API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred in Qwen-VL API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
