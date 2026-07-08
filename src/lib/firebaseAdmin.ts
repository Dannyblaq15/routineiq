import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let isInitialized = false;

try {
  let pk = process.env.FIREBASE_PRIVATE_KEY || '';
  if (pk) {
    if (pk.startsWith('"') && pk.endsWith('"')) pk = pk.slice(1, -1);
    if (pk.startsWith("'") && pk.endsWith("'")) pk = pk.slice(1, -1);
    
    // Fix broken newlines from bad copy-pastes
    if (!pk.includes('\n')) {
      if (pk.includes('\\n')) {
        pk = pk.replace(/\\n/g, '\n');
      } else {
        const body = pk.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replace(/\s+/g, '');
        pk = `-----BEGIN PRIVATE KEY-----\n${body.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;
      }
    }

    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project-id',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'dummy@example.com',
          privateKey: pk,
        }),
      });
      isInitialized = true;
    } else {
      isInitialized = true;
    }
  }
} catch (error) {
  console.error('Firebase Admin init error:', error);
}

// Only export the Auth instance if it actually initialized, otherwise export a dummy object that rejects
export const adminAuth = isInitialized ? getAuth() : {
  verifyIdToken: async () => { throw new Error('Firebase Admin is not initialized due to invalid credentials.'); }
} as any;
