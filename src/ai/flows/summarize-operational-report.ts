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
    .describe('The operational report to summarize.'),
});
export type SummarizeOperationalReportInput = z.infer<typeof SummarizeOperationalReportInputSchema>;

const SummarizeOperationalReportOutputSchema = z.object({
  summary: z.string().describe('The summary of the operational report.'),
});
export type SummarizeOperationalReportOutput = z.infer<typeof SummarizeOperationalReportOutputSchema>;

export async function summarizeOperationalReport(input: SummarizeOperationalReportInput): Promise<SummarizeOperationalReportOutput> {
  return summarizeOperationalReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeOperationalReportPrompt',
  input: {schema: SummarizeOperationalReportInputSchema},
  output: {schema: SummarizeOperationalReportOutputSchema},
  prompt: `You are an expert at summarizing operational reports. Please provide a concise summary of the following report, highlighting key insights and findings.\n\nReport:\n{{{report}}}`,
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
