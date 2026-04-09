'use server';
/**
 * @fileOverview A flow to generate realistic global events using GenAI.
 *
 * - generateGlobalEvents - Generates a list of events based on a query or region.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EventCategorySchema = z.enum(['news', 'weather', 'social', 'politics', 'trends']);

const GeneratedEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: EventCategorySchema,
  lat: z.number(),
  lon: z.number(),
  timestamp: z.string(),
  intensity: z.number().min(1).max(10),
});

const GenerateEventsInputSchema = z.object({
  query: z.string().optional().describe('A search term or region to focus on.'),
  count: z.number().optional().default(10).describe('Number of events to generate.'),
});

const GenerateEventsOutputSchema = z.object({
  events: z.array(GeneratedEventSchema),
});

export type GenerateEventsInput = z.infer<typeof GenerateEventsInputSchema>;
export type GenerateEventsOutput = z.infer<typeof GenerateEventsOutputSchema>;

const generateEventsPrompt = ai.definePrompt({
  name: 'generateEventsPrompt',
  input: {schema: GenerateEventsInputSchema},
  output: {schema: GenerateEventsOutputSchema},
  prompt: `You are a global intelligence simulator. Generate {{count}} realistic, diverse, and interesting events occurring around the world.
  
  {{#if query}}
  Focus specifically on: "{{query}}"
  {{else}}
  Generate a mix of global events across different continents and categories.
  {{/if}}

  Ensure the coordinates (lat/lon) are accurate for the cities or regions mentioned.
  Use ISO 8601 timestamps for the current month (March 2024).
  Categories must be one of: news, weather, social, politics, trends.
  
  Return a list of event objects.`,
});

export async function generateGlobalEvents(input: GenerateEventsInput): Promise<GenerateEventsOutput> {
  const {output} = await generateEventsPrompt(input);
  return output!;
}
