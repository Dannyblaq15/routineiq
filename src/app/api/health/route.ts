export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const results: any = {
      prisma: 'untested',
      firebase: 'untested',
      qwen: 'untested',
      env: {
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
        FIREBASE_PRIVATE_KEY_EXISTS: !!process.env.FIREBASE_PRIVATE_KEY,
        FIREBASE_CLIENT_EMAIL_EXISTS: !!process.env.FIREBASE_CLIENT_EMAIL,
        QWEN_API_KEY_EXISTS: !!process.env.QWEN_API_KEY,
      }
    };

    // Dynamically load modules to catch any initialization errors
    const dbModule = await import('../../../lib/db');
    const db = dbModule.default;
    
    try {
      await (db as any).routineStep.findFirst();
      results.prisma = 'success';
    } catch (e: any) {
      results.prisma = e.message || 'error';
    }

    const firebaseAdminModule = await import('../../../lib/firebaseAdmin');
    try {
      const auth = firebaseAdminModule.adminAuth;
      const apps = require('firebase-admin/app').getApps();
      results.firebase = apps.length > 0 ? 'initialized' : 'not initialized';
    } catch (e: any) {
      results.firebase = e.message || 'error';
    }

    const aiSdkModule = await import('@ai-sdk/openai');
    try {
      const qwen = aiSdkModule.createOpenAI({
        baseURL: process.env.QWEN_BASE_URL || 'https://ws-jacsvkmm61awec2s.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
        apiKey: process.env.QWEN_API_KEY || 'test',
      });
      results.qwen = 'success';
    } catch (e: any) {
      results.qwen = e.message || 'error';
    }

    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (globalError: any) {
    return new Response(JSON.stringify({ 
      error: 'CRITICAL_INITIALIZATION_ERROR', 
      message: globalError.message, 
      stack: globalError.stack 
    }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
