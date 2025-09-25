
import { z } from 'genkit';

export const CreateUserInputSchema = z.object({
  nome: z.string().describe("The user's full name."),
  email: z.string().email().describe("The user's email address."),
  cargo: z.string().describe("The user's job title."),
  permissao: z.enum(['Administrador', 'Operador', 'Apenas Leitura']).describe("The user's permission level."),
});
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
