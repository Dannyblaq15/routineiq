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
    const { id, isCompleted } = await req.json();
    
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
