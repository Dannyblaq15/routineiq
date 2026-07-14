export const dynamic = 'force-dynamic';
import db from '../../../lib/db';
import { verifyAuth } from '../../../lib/auth';

export async function GET(req: Request) {
  try {
    const userId = await verifyAuth(req);
    const steps = await (db as any).routineStep.findMany({
      where: { userId },
      orderBy: [
        { period: 'asc' },
        { stepNumber: 'asc' }
      ]
    });
    return new Response(JSON.stringify({ steps }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('🔥 Fetch Routine API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req);
    const body = await req.json();
    const { action, id, isCompleted, period, productName, brand, keyIngredient, waitAfterMins, isOptional } = body;
    
    if (action === 'add') {
      if (!productName || !period) {
        return new Response(JSON.stringify({ error: 'Product name and period are required' }), { status: 400 });
      }
      
      // Find the current highest step number for this period
      const lastStep = await (db as any).routineStep.findFirst({
        where: { userId, period },
        orderBy: { stepNumber: 'desc' }
      });
      const nextStepNumber = lastStep ? lastStep.stepNumber + 1 : 1;
      
      const newStep = await (db as any).routineStep.create({
        data: {
          stepNumber: nextStepNumber,
          period,
          productName,
          brand: brand || '',
          keyIngredient: keyIngredient || 'General Use',
          instructions: 'Apply gently.',
          whyIncluded: 'Manually added step.',
          waitAfterMins: waitAfterMins || 0,
          isOptional: isOptional || false,
          isCompleted: false,
          userId
        }
      });
      return new Response(JSON.stringify({ success: true, step: newStep }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    if (action === 'delete') {
      if (!id) {
        return new Response(JSON.stringify({ error: 'Step ID is required for deletion' }), { status: 400 });
      }
      await (db as any).routineStep.deleteMany({
        where: { id, userId }
      });
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Default toggle action
    if (!id) {
      return new Response(JSON.stringify({ error: 'Step ID is required' }), { status: 400 });
    }
    const updatedStep = await (db as any).routineStep.updateMany({
      where: { id, userId },
      data: { isCompleted }
    });
    return new Response(JSON.stringify({ success: true, step: updatedStep }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('🔥 Update Routine API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
