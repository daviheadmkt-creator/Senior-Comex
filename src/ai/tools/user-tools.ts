
'use server';
import { ai } from '@/ai/genkit';
import { CreateUserInputSchema } from '../flows/create-user-flow';
import { z } from 'zod';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeAdminApp } from '@/firebase/firebase-admin';

export const createUserTool = ai.defineTool(
  {
    name: 'createUserTool',
    description: 'Creates a user in Firebase Authentication, sends a password reset link, and saves user profile to Firestore.',
    inputSchema: CreateUserInputSchema,
    outputSchema: z.object({
        user: z.object({
            uid: z.string(),
            email: z.string().optional().nullable(),
            displayName: z.string().optional().nullable(),
        }),
        error: z.object({
            message: z.string(),
        }).optional(),
    })
  },
  async (input) => {
    try {
        initializeAdminApp();
        const auth = getAuth();
        const firestore = getFirestore();

        // 1. Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email: input.email,
            displayName: input.nome,
            emailVerified: false, // User will verify by setting password
        });

        // 2. Save user profile to Firestore
        const userProfile = {
            uid: userRecord.uid,
            nome: input.nome,
            email: input.email,
            cargo: input.cargo,
            permissao: input.permissao,
        };
        await firestore.collection('users').doc(userRecord.uid).set(userProfile);

        // 3. Generate password reset link to act as a "welcome" email
        const link = await auth.generatePasswordResetLink(input.email);
        
        // In a real app, you'd use a service like SendGrid, Resend, or Firebase Extensions to send the email.
        // For this example, we'll log the link to the console.
        console.log('Password reset link sent (simulation):', link);
        // TODO: Add actual email sending logic here.

        return {
            user: {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
            },
        };
    } catch (e: any) {
      console.error('createUserTool error:', e);
      return { user: {} as any, error: { message: e.message || 'An unknown error occurred.' } };
    }
  }
);
