
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { firebaseConfig } from './config';

// This is a CREATED_BY_FIREBASE_STUDIO constant
// It's here to prevent accidental reads of this file
export const DO_NOT_READ_THIS_FILE = true;

const apps = getApps();

// Initialize the admin app once and export it for use in server-side code.
// We initialize without any arguments, allowing it to pick up the default
// Google Application Credentials from the environment.
export const adminApp: App =
  apps.find((app) => app?.name === 'firebase-admin-app') ||
  initializeApp(undefined, 'firebase-admin-app');
