// use server'
'use server';

/**
 * @fileOverview Analyzes patient symptoms and medical history to suggest possible conditions and recommend relevant specialists or tests.
 *
 * - analyzeSymptoms - A function that handles the symptom analysis process.
 * - AnalyzeSymptomsInput - The input type for the analyzeSymptoms function.
 * - AnalyzeSymptomsOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSymptomsInputSchema = z.object({
  symptomsAndHistory: z
    .string()
    .describe(
      'A detailed description of the patient’s symptoms and medical history.'
    ),
});
export type AnalyzeSymptomsInput = z.infer<typeof AnalyzeSymptomsInputSchema>;

const AnalyzeSymptomsOutputSchema = z.object({
  possibleConditions: z
    .array(z.string())
    .describe('A list of possible medical conditions based on the input.'),
  recommendedSpecialists: z
    .array(z.string())
    .describe('A list of recommended medical specialists.'),
  recommendedTests: z
    .array(z.string())
    .describe('A list of recommended medical tests.'),
  summary: z.string().describe('A brief summary of the analysis.'),
});
export type AnalyzeSymptomsOutput = z.infer<typeof AnalyzeSymptomsOutputSchema>;

export async function analyzeSymptoms(
  input: AnalyzeSymptomsInput
): Promise<AnalyzeSymptomsOutput> {
  return analyzeSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSymptomsPrompt',
  input: {schema: AnalyzeSymptomsInputSchema},
  output: {schema: AnalyzeSymptomsOutputSchema},
  prompt: `You are an AI medical assistant specializing in analyzing symptoms and medical history to provide possible conditions, specialists, and tests.

  Analyze the following patient information and provide:
  - A list of possible medical conditions (possibleConditions)
  - A list of recommended medical specialists (recommendedSpecialists)
  - A list of recommended medical tests (recommendedTests)
  - A summary of your analysis (summary)

  Patient Information: {{{symptomsAndHistory}}}`,
});

const analyzeSymptomsFlow = ai.defineFlow(
  {
    name: 'analyzeSymptomsFlow',
    inputSchema: AnalyzeSymptomsInputSchema,
    outputSchema: AnalyzeSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
