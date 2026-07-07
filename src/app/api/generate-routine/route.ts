import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import db from '../../../lib/db';
import { getMemory, addEpisode } from '../../../lib/memoryStore';

const qwen = createOpenAI({
  baseURL: process.env.QWEN_BASE_URL || 'https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

import { verifyAuth } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req);
    const memory = await getMemory(userId);
    
    // Safety check: if no inventory, return empty routine
    if (!memory.inventory || memory.inventory.length === 0) {
      return new Response(JSON.stringify({ error: 'No inventory items to build a routine from' }), { status: 400 });
    }

    const systemPrompt = `You are RoutineIQ, an expert dermatological AI agent.
Your task is to generate an optimal daily skincare routine (both morning and evening) based ONLY on the user's current inventory.

USER PREFERENCES:
- Complexity: ${memory.preferences.complexity || 'moderate'}
- AM Max Steps: ${memory.preferences.amMaxSteps || 3}
- PM Max Steps: ${memory.preferences.pmMaxSteps || 4}
- Fragrance Sensitive: ${memory.preferences.fragranceSensitive ? 'Yes' : 'No'}

CURRENT INVENTORY:
${memory.inventory.map(i => `- ${i.name} (${i.phase}) - Tags: ${JSON.stringify(i.tags)}`).join('\n')}

INSTRUCTIONS:
1. Generate an array of RoutineStep objects.
2. Group them by "morning" and "evening" period.
3. Be strictly clinical and adhere to their step limits.
4. If there's a conflict (e.g., Vitamin C and Retinol), separate them into AM and PM.
5. Provide a clear "whyIncluded" clinical reasoning for each product.
6. Provide "instructions" on how to apply.
7. Return ONLY valid JSON matching this exact structure:
[
  {
    "period": "morning" | "evening",
    "productName": "string",
    "brand": "string",
    "instructions": "string",
    "whyIncluded": "string",
    "keyIngredient": "string",
    "waitAfterMins": number,
    "isOptional": boolean
  }
]
No other text or markdown.`;

    const result = await generateText({
      model: qwen(process.env.QWEN_TEXT_MODEL || 'qwen-plus'),
      system: systemPrompt,
      messages: [
        { role: 'user', content: 'Generate the optimal routine from my inventory.' }
      ]
    });

    const cleanedText = result.text.replace(/```json/gi, '').replace(/```/g, '').trim();
    let generatedSteps;
    try {
      generatedSteps = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse JSON:", cleanedText);
      throw new Error("Failed to parse AI response into JSON");
    }

    // Replace the current routine in the database
    await (db as any).routineStep.deleteMany({ where: { userId } }); // clear existing
    
    // Sort into a list and inject step numbers
    let amCounter = 1;
    let pmCounter = 1;
    
    const stepsToCreate = generatedSteps.map((step: any) => {
      const stepNumber = step.period === 'morning' ? amCounter++ : pmCounter++;
      return {
        stepNumber,
        period: step.period,
        productName: step.productName,
        brand: step.brand || 'Unknown',
        instructions: step.instructions,
        whyIncluded: step.whyIncluded,
        keyIngredient: step.keyIngredient || '',
        waitAfterMins: step.waitAfterMins || 0,
        isOptional: step.isOptional || false,
        isCompleted: false,
        userId
      };
    });

    await (db as any).routineStep.createMany({ data: stepsToCreate });

    // Log this action
    await addEpisode(userId, {
      episodeType: 'routine_updated',
      title: 'Agent re-optimized your routine',
      summary: `Generated a new ${stepsToCreate.length}-step routine based on your updated inventory.`,
      isVisibleToUser: true,
      agentId: 'routine-generator',
    });

    return new Response(JSON.stringify({ success: true, count: stepsToCreate.length }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('🔥 Generate Routine API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
