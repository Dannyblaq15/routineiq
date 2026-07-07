import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

try {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project-id',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'dummy@example.com',
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '-----BEGIN PRIVATE KEY-----\ndummy\n-----END PRIVATE KEY-----',
      }),
    });
  }
} catch (error) {
  // If the private key is invalid (which happens on Vercel), initialize a fallback app without credentials!
  if (!getApps().length) {
    initializeApp({ projectId: 'dummy-project-id' });
  }
}

export const adminAuth = getAuth();
