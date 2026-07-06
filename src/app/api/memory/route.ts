import { getMemory, addEpisode } from '../../../lib/memoryStore';

export async function GET(req: Request) {
  try {
    const memory = getMemory();
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
    const body = await req.json();
    const { action, payload } = body;

    if (action === 'add_episode') {
      const newEp = addEpisode(payload);
      return new Response(JSON.stringify(newEp), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
