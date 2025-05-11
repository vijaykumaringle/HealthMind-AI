// use server'
'use server';

/**
 * @fileOverview Analyzes patient symptoms and medical history to suggest possible conditions, recommend relevant specialists or tests. This agent also fetches recommended medical facilities based on the user's current location by integrating with a maps service.
 *
 * - analyzeSymptoms - A function that handles the symptom analysis process.
 * - AnalyzeSymptomsInput - The input type for the analyzeSymptoms function.
 * - AnalyzeSymptomsOutput - The return type for the analyzeSymptomsOutput function.
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
      facilityTypeQuery: z.string().min(1, { message: "Internal Error: Facility search query cannot be empty if location is provided and tool is used." }).describe("A query string that MUST include the location and the type of facility. E.g., 'hospitals in New York', 'pediatric clinics near 90210', 'cardiologists in London'. If user location is not available from the main input, do not use this tool or state that location is needed.")
    }),
    outputSchema: z.array(z.object({
      name: z.string().describe("Name of the medical facility."),
      address: z.string().describe("Full address of the medical facility."),
      type: z.string().describe("Type of facility, e.g., Hospital, Clinic, Specialist Office.")
    })),
  },
  async ({ facilityTypeQuery }) => {
    console.log(`[TOOL DEBUG] getNearbyMedicalFacilitiesTool called with query: "${facilityTypeQuery}"`);
    const facilities = await fetchNearbyMedicalFacilities(facilityTypeQuery);
    // Log the facilities returned by the service before mapping, to see exactly what the tool receives
    console.log(`[TOOL DEBUG] fetchNearbyMedicalFacilities (from maps-service) returned to tool: ${JSON.stringify(facilities, null, 2)}`);
    const mappedFacilities = facilities.map(f => ({ name: f.name, address: f.address, type: f.type }));
    // Log the facilities being returned by the tool to the LLM
    console.log(`[TOOL DEBUG] Mapped facilities returned by tool to LLM: ${JSON.stringify(mappedFacilities, null, 2)}`);
    return mappedFacilities;
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
  4. Suggested Medical Facilities (suggestedFacilities):
     - Check if a 'location' ({{{location}}}) is provided by the user and is not an empty string.
     - IF a location IS PROVIDED and is not an empty string:
       - You MUST attempt to use the 'getNearbyMedicalFacilities' tool.
       - For the 'facilityTypeQuery' parameter of the tool:
         - If you have recommended specific specialists (e.g., cardiologist, pediatrician), construct the query using that specialist type and the location (e.g., 'cardiologists in {{{location}}}', 'pediatricians near {{{location}}}').
         - If no specific specialist is identified or general care is more appropriate, search for 'hospitals in {{{location}}}' or 'clinics in {{{location}}}'.
         - Ensure the query always includes the user's location: '{{{location}}}' and is not an empty string.
       - Let 'tool_output_facilities' be the list of facilities returned by the 'getNearbyMedicalFacilities' tool.
       - IF 'tool_output_facilities' is not empty:
         - You MUST populate the 'suggestedFacilities' field in your output with up to 3 facilities from 'tool_output_facilities'. Include their name, address, and type.
       - ELSE (if 'tool_output_facilities' is empty or the tool was not used successfully, meaning it returned an empty list):
         - The 'suggestedFacilities' array in your output MUST be empty. You may note in the summary that facility search for {{{location}}} yielded no specific results if this happens.
     - IF a location IS NOT PROVIDED or is an empty string:
       - Do NOT use the 'getNearbyMedicalFacilities' tool.
       - The 'suggestedFacilities' array in your output MUST be empty. You may note in the summary that location is needed for facility suggestions.
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
    console.log(`[FLOW DEBUG] analyzeSymptomsFlow called with input: ${JSON.stringify(input, null, 2)}`);
    const {output} = await prompt(input);
    if (!output) {
      console.error("[FLOW DEBUG] LLM did not return an output for analyzeSymptomsFlow. Input was:", JSON.stringify(input, null, 2));
      // Return a default error structure that conforms to AnalyzeSymptomsOutputSchema
      return { 
        possibleConditions: [], 
        recommendedSpecialists: [], 
        recommendedTests: [], 
        suggestedFacilities: [], 
        summary: "Error: AI analysis could not be completed due to an unexpected issue with the language model's response." 
      };
    }
    // Log the full output from the LLM for debugging purposes
    console.log(`[FLOW DEBUG] Full output from LLM for analyzeSymptomsFlow: ${JSON.stringify(output, null, 2)}`);
    return output;
  }
);

