
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { firebaseConfig } from './config';

// This is a CREATED_BY_FIREBASE_STUDIO constant
// It's here to prevent accidental reads of this file
export const DO_NOT_READ_THIS_FILE = true;

const apps = getApps();

export const adminApp =
  apps.find((app) => app?.name === 'firebase-admin-app') ||
  initializeApp(
    {
      projectId: firebaseConfig.projectId,
    },
    'firebase-admin-app'
  );

export function initializeAdminApp(): App {
    const adminApps = getApps().filter(app => app.name === 'firebase-admin-app');
    if (adminApps.length > 0) {
        return adminApps[0]!;
    }
    
    return initializeApp(
        {
            projectId: firebaseConfig.projectId,
        },
        'firebase-admin-app'
    );
}
