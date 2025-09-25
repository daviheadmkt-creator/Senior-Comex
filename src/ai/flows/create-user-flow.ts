
'use server';
/**
 * @fileOverview A flow for creating a new user.
 *
 * - createUser - Creates a user in Firebase Auth, sends a password reset email, and stores their profile in Firestore.
 * - CreateUserInput - The input type for the createUser function.
 * - CreateUserOutputSchema - The return type for the createUser function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { createUserTool } from '../tools/user-tools';
import { CreateUserInputSchema, CreateUserInput } from '../schemas/user-schemas';


export const CreateUserOutputSchema = z.object({
  uid: z.string().describe("The new user's unique ID."),
  message: z.string().describe('A summary of the action taken.'),
});
export type CreateUserOutput = z.infer<typeof CreateUserOutputSchema>;


const createUserFlow = ai.defineFlow(
  {
    name: 'createUserFlow',
    inputSchema: CreateUserInputSchema,
    outputSchema: CreateUserOutputSchema,
    tools: [createUserTool]
  },
  async (input) => {

    const { user, error } = await ai.tool(createUserTool).run(input);

    if (error) {
        throw new Error(`Failed to create user: ${error.message}`);
    }

    if (!user) {
        throw new Error('Tool did not return a user.');
    }
    
    return {
        uid: user.uid,
        message: `User ${user.displayName} created successfully and password reset email sent.`,
    };
  }
);


export async function createUser(input: CreateUserInput): Promise<CreateUserOutput> {
    return createUserFlow(input);
}
