import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const qwen = createOpenAI({
  baseURL: process.env.QWEN_BASE_URL || 'https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

async function main() {
  try {
    const result = await generateObject({
      model: qwen('qwen-plus'),
      system: 'You are an AI.',
      messages: [{ role: 'user', content: 'Test' }],
      schema: z.object({
        status: z.string(),
      }),
    });
    console.log("Success:", result.object);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
