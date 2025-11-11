'use server';
/**
 * @fileOverview A server-side flow to securely list all users from Firebase Authentication.
 */

import { z } from 'genkit/zod';
import { ai } from '@/ai/genkit';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';

// This interface must match the one in the calling component
export const UserRecordSchema = z.object({
  uid: z.string(),
  email: z.string().optional(),
  displayName: z.string().optional(),
  photoURL: z.string().optional(),
  disabled: z.boolean(),
});

export type UserRecord = z.infer<typeof UserRecordSchema>;

// Define the flow with an output schema
const listUsersFlow = ai.defineFlow(
  {
    name: 'listUsersFlow',
    outputSchema: z.array(UserRecordSchema),
  },
  async () => {
    // Ensure Firebase Admin is initialized only once on the server
    if (getApps().length === 0) {
      initializeApp();
    }

    try {
      const auth = getAuth();
      const userRecords = await auth.listUsers();
      const users = userRecords.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        disabled: user.disabled,
      }));
      return users;
    } catch (error: any) {
      console.error('Error listing users within listUsersFlow:', error);
      // Re-throw the error with a more specific message to aid debugging.
      throw new Error(`Failed to list users from Firebase Auth: ${error.message}`);
    }
  }
);

// Export a wrapper function to be called from client components.
export async function listUsers(): Promise<UserRecord[]> {
  return await listUsersFlow();
}
