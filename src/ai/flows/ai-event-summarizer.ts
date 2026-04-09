'use server';
/**
 * @fileOverview Provides an AI-powered event summarizer.
 *
 * - summarizeEvent - A function that generates a concise summary of detailed event information.
 * - AiEventSummarizerInput - The input type for the summarizeEvent function.
 * - AiEventSummarizerOutput - The return type for the summarizeEvent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiEventSummarizerInputSchema = z.object({
  eventDetails: z.string().describe('The detailed information of an event to be summarized.')
});
export type AiEventSummarizerInput = z.infer<typeof AiEventSummarizerInputSchema>;

const AiEventSummarizerOutputSchema = z.object({
  summary: z.string().describe('A concise, AI-generated summary of the event.')
});
export type AiEventSummarizerOutput = z.infer<typeof AiEventSummarizerOutputSchema>;

const summarizeEventPrompt = ai.definePrompt({
  name: 'summarizeEventPrompt',
  input: {schema: AiEventSummarizerInputSchema},
  output: {schema: AiEventSummarizerOutputSchema},
  prompt: `Summarize the following event details concisely, highlighting key information and impact. Ensure the summary is no more than 3-4 sentences long.

Event Details:
{{{eventDetails}}}`
});

const summarizeEventFlow = ai.defineFlow(
  {
    name: 'summarizeEventFlow',
    inputSchema: AiEventSummarizerInputSchema,
    outputSchema: AiEventSummarizerOutputSchema
  },
  async input => {
    const {output} = await summarizeEventPrompt(input);
    return output!;
  }
);

export async function summarizeEvent(input: AiEventSummarizerInput): Promise<AiEventSummarizerOutput> {
  return summarizeEventFlow(input);
}
