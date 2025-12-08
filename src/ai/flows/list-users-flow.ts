'use server';
/**
 * @fileOverview A server-side flow to securely list all users by calling a dedicated Cloud Function.
 */

import { z } from 'genkit/zod';
import { ai } from '@/ai/genkit';
import { getFunctions} from 'firebase-admin/functions';

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
    // In a production App Hosting environment, this will resolve to the correct URL.
    // In local development, you need to run the functions emulator and point to it.
    const listUsersUrl = process.env.FUNCTIONS_EMULATOR_URL || 'https://listusers-c67k2w3jea-uc.a.run.app';
    
    try {
      const functions = getFunctions();
      const idToken = await functions.app.INTERNAL.getToken();

      if (!idToken) {
          throw new Error('Não foi possível obter o token de autenticação para chamar a função.');
      }
      
      const response = await fetch(listUsersUrl, {
          headers: {
              'Authorization': `Bearer ${idToken.token}`,
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`A chamada à função falhou com o estado ${response.status}: ${errorBody}`);
      }

      const users = await response.json();
      return users;

    } catch (error: any) {
      console.error('Erro ao invocar a função listUsers:', error);
      throw new Error(`Falha ao listar os utilizadores a partir da Cloud Function: ${error.message}`);
    }
  }
);

// Export a wrapper function to be called from client components.
export async function listUsers(): Promise<UserRecord[]> {
  return await listUsersFlow();
}
