
'use server';
/**
 * @fileOverview AI agent that classifies products based on their description.
 *
 * - classifyProduct - A function that suggests NCM and HS codes for a product.
 * - ClassifyProductInput - The input type for the classifyProduct function.
 * - ClassifyProductOutput - The return type for the classifyProduct function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyProductInputSchema = z.object({
  productDescription: z
    .string()
    .describe('A detailed description of the product to be classified.'),
});
export type ClassifyProductInput = z.infer<typeof ClassifyProductInputSchema>;

const ClassifyProductOutputSchema = z.object({
  ncmCode: z.string().describe('The suggested NCM (Nomenclatura Comum do Mercosul) code for the product. Format: XXXX.XX.XX'),
  hsCode: z.string().describe('The suggested HS Code (Harmonized System) for the product. It should be the first 6 digits of the NCM code. Format: XXXX.XX'),
  justification: z.string().describe('A brief justification for the suggested classification, explaining the reasoning based on the product description and relevant customs regulations.'),
});
export type ClassifyProductOutput = z.infer<typeof ClassifyProductOutputSchema>;

export async function classifyProduct(input: ClassifyProductInput): Promise<ClassifyProductOutput> {
  return classifyProductFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyProductPrompt',
  input: {schema: ClassifyProductInputSchema},
  output: {schema: ClassifyProductOutputSchema},
  prompt: `You are an expert in international trade and customs classification. Your task is to analyze the product description provided and suggest the most appropriate NCM (Nomenclatura Comum do Mercosul) and HS Code (Harmonized System).

Product Description:
"{{{productDescription}}}"

Based on this description, provide the following:
1.  **NCM Code:** The full 8-digit code.
2.  **HS Code:** The first 6 digits of the NCM code.
3.  **Justification:** A concise explanation for your classification choice, referencing the relevant sections or characteristics of the product that led to your decision.
`,
});

const classifyProductFlow = ai.defineFlow(
  {
    name: 'classifyProductFlow',
    inputSchema: ClassifyProductInputSchema,
    outputSchema: ClassifyProductOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
