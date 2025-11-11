
'use server';
/**
 * @fileOverview A Genkit flow to securely list Firebase Authentication users.
 *
 * - listUsers - A function that retrieves a list of all users from Firebase Auth.
 * - UserRecord - The type for a single user record.
 */
import { ai } from '@/ai/genkit';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/firebase/firebase-admin';

// This interface must match the one in the calling component
export interface UserRecord {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  photoURL: string | undefined;
  disabled: boolean;
}

// The main flow definition
export const listUsersFlow = ai.defineFlow(
  {
    name: 'listUsersFlow',
  },
  async (): Promise<UserRecord[]> => {
    try {
      // Retrieve all users from Firebase Auth using the initialized admin app
      const userRecords = await getAuth(adminApp).listUsers();

      // Map the full user records to the simplified UserRecord interface
      return userRecords.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        disabled: user.disabled,
      }));
    } catch (error: any) {
      console.error('Error listing users within listUsersFlow:', error);
      // Re-throw the error with a more specific message to aid debugging.
      throw new Error(`Failed to list users from Firebase Auth: ${error.message}`);
    }
  }
);

// This is the exported wrapper function that the client-side code will call.
export async function listUsers(): Promise<UserRecord[]> {
    // This invokes the Genkit flow.
    return await listUsersFlow();
}
