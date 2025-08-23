
'use server';
/**
 * @fileOverview An AI agent for validating entities against sanction lists.
 *
 * - validateEntity - A function that checks a company/person and country against international sanction lists.
 * - ValidateEntityInput - The input type for the validateEntity function.
 * - ValidateEntityOutput - The return type for the validateEntity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateEntityInputSchema = z.object({
  entityName: z
    .string()
    .describe('The name of the entity (company or person) to validate.'),
  country: z.string().describe('The country of the entity to validate.'),
});
export type ValidateEntityInput = z.infer<typeof ValidateEntityInputSchema>;

const ValidateEntityOutputSchema = z.object({
  status: z
    .enum(['Liberado', 'Atenção', 'Sancionado'])
    .describe('The validation status of the entity. Use "Liberado" if no matches are found. Use "Atenção" if there are potential or partial matches that require human review. Use "Sancionado" for confirmed matches on a sanction list.'),
  justification: z
    .string()
    .describe('A detailed justification for the status, mentioning any lists checked and the findings. Explain why the entity is considered sanctioned, requires attention, or is clear.'),
  checkedLists: z.array(z.string()).describe('A list of international sanction lists that were consulted for the validation (e.g., OFAC, UN, EU).'),
});
export type ValidateEntityOutput = z.infer<typeof ValidateEntityOutputSchema>;


export async function validateEntity(input: ValidateEntityInput): Promise<ValidateEntityOutput> {
  return validateEntityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateEntityPrompt',
  input: {schema: ValidateEntityInputSchema},
  output: {schema: ValidateEntityOutputSchema},
  prompt: `You are a compliance expert specializing in international trade sanctions. Your task is to check if a given entity and its country appear on major international sanction lists.

Entity Name: "{{entityName}}"
Country: "{{country}}"

1.  Analyze the entity and country provided.
2.  Simulate a check against the most important international sanction lists (e.g., OFAC's SDN List, UN Security Council Consolidated List, EU Consolidated List).
3.  Determine a final status:
    *   **Sancionado**: If there is a clear, direct match on any major sanction list.
    *   **Atenção**: If the name is similar to a sanctioned entity, if the country has broad sanctions, or if the entity operates in a high-risk sector for that country, requiring manual review.
    *   **Liberado**: If there are no matches or potential issues.
4.  Provide a clear and concise justification for your chosen status, explaining your findings.
5.  List the specific sanction lists you have checked.`,
});

const validateEntityFlow = ai.defineFlow(
  {
    name: 'validateEntityFlow',
    inputSchema: ValidateEntityInputSchema,
    outputSchema: ValidateEntityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
