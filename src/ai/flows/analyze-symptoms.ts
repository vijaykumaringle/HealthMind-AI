// use server'
'use server';

/**
 * @fileOverview Analyzes patient symptoms and medical history to suggest possible conditions, recommend relevant specialists or tests. This agent should also fetch the top 3 recommended medical facilities based on the user's current location by integrating with Google Maps. This functionality should be closely tied to this agent.
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
  location: z
    .string()
    .describe(
      "The user's current location (e.g., city, zip code) to find nearby facilities."
    )
 .default("User's location is Pune"),
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
  suggestedFacilities: z.array(z.object({ 
    name: z.string().describe("Name of the medical facility."), 
    type: z.string().describe("Type of facility, e.g., Hospital, Clinic, Specialist Office.") 
  })).describe('A list of suggested nearby medical facilities.'),

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
  prompt: `You are an AI medical assistant specializing in analyzing symptoms and medical history.

  Based on the patient information provided, you need to:
  1. List possible medical conditions (possibleConditions).

  2. Recommend relevant medical specialists (recommendedSpecialists).
  3. Suggest appropriate medical tests (recommendedTests).
  4. Provide the top 3 recommended medical facilities based on the user's current location and the scenario, retrieved via a Google Maps integration (suggestedFacilities). For each facility, include its name and type.
  5. Provide a concise summary of your analysis (summary).

  Patient Symptoms and History: {{{symptomsAndHistory}}}
  User Location: {{{location}}}`,
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

