import db from '../../../lib/db';

export async function GET() {
  try {
    const steps = await db.routineStep.findMany({
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
    const { id, isCompleted } = await req.json();
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Step ID is required' }), { status: 400 });
    }

    const updatedStep = await db.routineStep.update({
      where: { id },
      data: { isCompleted }
    });

    return new Response(JSON.stringify({ success: true, step: updatedStep }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('🔥 Update Routine API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
