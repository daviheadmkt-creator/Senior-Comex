'use server';
/**
 * @fileOverview A Genkit flow to securely list Firebase Authentication users.
 *
 * - listUsers - A function that retrieves a list of all users from Firebase Auth.
 * - UserRecord - The type for a single user record.
 */
import { ai } from '@/ai/genkit';
import { getAuth } from 'firebase-admin/auth';
import { initializeAdminApp } from '@/firebase/firebase-admin';
import { defineFlow, run, startFlow } from 'genkit';
import { onFlow } from '@genkit-ai/firebase/functions';

// Initialize the Firebase Admin SDK
initializeAdminApp();

export interface UserRecord {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  disabled: boolean;
}

export const listUsersFlow = ai.defineFlow(
  {
    name: 'listUsersFlow',
    // Add the required policy to allow listing users
    policy: {
      read: {
        rules: [{
          role: 'firebase.auth.user.list',
          principals: 'allUsers'
        }]
      }
    }
  },
  async (): Promise<UserRecord[]> => {
    try {
      const userRecords = await getAuth().listUsers();
      return userRecords.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        disabled: user.disabled,
      }));
    } catch (error) {
      console.error('Error listing users:', error);
      // In a real app, you might want to handle this more gracefully
      throw new Error('Failed to list users from Firebase Auth.');
    }
  }
);


export async function listUsers(): Promise<UserRecord[]> {
    return await listUsersFlow();
}
