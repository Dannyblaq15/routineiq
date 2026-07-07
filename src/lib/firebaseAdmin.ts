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
  console.log('Firebase Admin init skipped during build (expected on Vercel frontend)');
}

export const adminAuth = getAuth();
