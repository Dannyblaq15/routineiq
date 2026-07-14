export const dynamic = 'force-dynamic';
import db from '../../../lib/db';
import { verifyAuth } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req);
    const body = await req.json();
    const { action, item } = body;

    if (action === 'add') {
      const newItem = await (db as any).inventoryItem.create({
        data: {
          name: item.name,
          phase: item.phase,
          category: item.category,
          compatibility: Number(item.compatibility) || 100,
          tags: item.tags || [],
          statusText: item.statusText || 'Good match',
          statusType: item.statusType || 'success',
          imageUrl: item.imageUrl || '',
          userId
        }
      });
      return new Response(JSON.stringify(newItem), { status: 200 });
    }

    if (action === 'delete') {
      await (db as any).inventoryItem.deleteMany({
        where: {
          id: item.id,
          userId
        }
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (error: any) {
    console.error('🔥 Inventory API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
