// use server'
'use server';

/**
 * @fileOverview Analyzes patient symptoms and medical history to suggest possible conditions, recommend relevant specialists or tests. This agent also fetches recommended medical facilities based on the user's current location by integrating with a maps service.
 *
 * - analyzeSymptoms - A function that handles the symptom analysis process.
 * - AnalyzeSymptomsInput - The input type for the analyzeSymptoms function.
 * - AnalyzeSymptomsOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { fetchNearbyMedicalFacilities } from '@/services/maps-service';

const AnalyzeSymptomsInputSchema = z.object({
  symptomsAndHistory: z
    .string()
    .describe(
      'A detailed description of the patient’s symptoms and medical history.'
    ),
  location: z
    .string()
    .optional()
    .describe(
      "The user's current location (e.g., city, zip code) to find nearby facilities. If not provided, facility search might be limited."
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
  suggestedFacilities: z.array(z.object({
    name: z.string().describe("Name of the medical facility."),
    address: z.string().describe("Full address of the medical facility."),
    type: z.string().describe("Type of facility, e.g., Hospital, Clinic, Specialist Office.")
  })).describe('A list of suggested nearby medical facilities, including name, address, and type. This list is populated using the getNearbyMedicalFacilities tool if a user location is provided.'),
  summary: z.string().describe('A brief summary of the analysis.'),
});
export type AnalyzeSymptomsOutput = z.infer<typeof AnalyzeSymptomsOutputSchema>;


const getNearbyMedicalFacilitiesTool = ai.defineTool(
  {
    name: 'getNearbyMedicalFacilities',
    description: 'Fetches a list of nearby medical facilities based on location and type of facility needed. Use this to recommend specific places to the user.',
    inputSchema: z.object({
      facilityTypeQuery: z.string().describe("A query string that MUST include the location and the type of facility. E.g., 'hospitals in New York', 'pediatric clinics near 90210', 'cardiologists in London'. If user location is not available from the main input, do not use this tool or state that location is needed.")
    }),
    outputSchema: z.array(z.object({
      name: z.string().describe("Name of the medical facility."),
      address: z.string().describe("Full address of the medical facility."),
      type: z.string().describe("Type of facility, e.g., Hospital, Clinic, Specialist Office.")
    })),
  },
  async ({ facilityTypeQuery }) => {
    console.log(`Tool getNearbyMedicalFacilities called with query: ${facilityTypeQuery}`);
    const facilities = await fetchNearbyMedicalFacilities(facilityTypeQuery);
    return facilities.map(f => ({ name: f.name, address: f.address, type: f.type }));
  }
);

export async function analyzeSymptoms(
  input: AnalyzeSymptomsInput
): Promise<AnalyzeSymptomsOutput> {
  return analyzeSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSymptomsPrompt',
  input: {schema: AnalyzeSymptomsInputSchema},
  output: {schema: AnalyzeSymptomsOutputSchema},
  tools: [getNearbyMedicalFacilitiesTool],
  prompt: `You are an AI medical assistant specializing in analyzing symptoms and medical history.

  Based on the patient information provided (symptoms, history, and location), you need to:
  1. List possible medical conditions (possibleConditions).
  2. Recommend relevant medical specialists (recommendedSpecialists).
  3. Suggest appropriate medical tests (recommendedTests).
  4. To suggest medical facilities, check if the user has provided their 'location' in the input ({{{location}}}).
     If a 'location' is provided and is not an empty string:
     - Use the 'getNearbyMedicalFacilities' tool.
     - Construct a 'facilityTypeQuery' for the tool. This query MUST combine the type of facility you deem appropriate (e.g., 'hospitals', 'urgent care clinics', 'pediatricians') with the user's provided 'location'. For example, if the user is in 'Pune' and needs a hospital, the query could be 'hospitals in Pune' or 'Hospital near Pune'.
     - The tool will return a list of facilities. Include up to 3 of these in the 'suggestedFacilities' output, providing their name, address, and type.
     If 'location' is NOT provided or is an empty string:
     - Do not use the 'getNearbyMedicalFacilities' tool.
     - The 'suggestedFacilities' array in your output should be empty. You may note in the summary that location is needed for facility suggestions.
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
