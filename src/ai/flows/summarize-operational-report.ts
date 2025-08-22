'use server';
/**
 * @fileOverview AI agent that summarizes operational reports.
 *
 * - summarizeOperationalReport - A function that summarizes an operational report.
 * - SummarizeOperationalReportInput - The input type for the summarizeOperationalReport function.
 * - SummarizeOperationalReportOutput - The return type for the summarizeOperationalReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeOperationalReportInputSchema = z.object({
  report: z
    .string()
    .describe('O relatório operacional a ser resumido.'),
});
export type SummarizeOperationalReportInput = z.infer<typeof SummarizeOperationalReportInputSchema>;

const SummarizeOperationalReportOutputSchema = z.object({
  summary: z.string().describe('O resumo do relatório operacional.'),
});
export type SummarizeOperationalReportOutput = z.infer<typeof SummarizeOperationalReportOutputSchema>;

export async function summarizeOperationalReport(input: SummarizeOperationalReportInput): Promise<SummarizeOperationalReportOutput> {
  return summarizeOperationalReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeOperationalReportPrompt',
  input: {schema: SummarizeOperationalReportInputSchema},
  output: {schema: SummarizeOperationalReportOutputSchema},
  prompt: `Você é um especialista em resumir relatórios operacionais. Forneça um resumo conciso do seguinte relatório, destacando os principais insights e descobertas.\n\nRelatório:\n{{{report}}}`,
});

const summarizeOperationalReportFlow = ai.defineFlow(
  {
    name: 'summarizeOperationalReportFlow',
    inputSchema: SummarizeOperationalReportInputSchema,
    outputSchema: SummarizeOperationalReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
