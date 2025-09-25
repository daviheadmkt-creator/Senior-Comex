
import { z } from 'genkit';

export const CreateUserInputSchema = z.object({
  nome: z.string().describe("The user's full name."),
  email: z.string().email().describe("The user's email address."),
  cargo: z.string().describe("The user's job title."),
  permissao: z.enum(['Administrador', 'Operador', 'Apenas Leitura']).describe("The user's permission level."),
});
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;


export const CreateUserOutputSchema = z.object({
  uid: z.string().describe("The new user's unique ID."),
  message: z.string().describe('A summary of the action taken.'),
});
export type CreateUserOutput = z.infer<typeof CreateUserOutputSchema>;
