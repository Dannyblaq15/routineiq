export const dynamic = 'force-dynamic';
import { getMemory, addEpisode } from '../../../lib/memoryStore';
import { verifyAuth } from '../../../lib/auth';

export async function GET(req: Request) {
  try {
    const userId = await verifyAuth(req);
    const memory = await getMemory(userId);
    return new Response(JSON.stringify(memory), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req);
    const body = await req.json();
    const { action, payload } = body;

    if (action === 'add_episode') {
      const newEp = await addEpisode(userId, payload);
      return new Response(JSON.stringify(newEp), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
