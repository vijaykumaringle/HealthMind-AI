'use server';

import { analyzeSymptoms, type AnalyzeSymptomsInput, type AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';

export interface AnalysisResultSuccess extends AnalyzeSymptomsOutput {
  error?: never;
}
export interface AnalysisResultError {
  error: string;
  possibleConditions?: never;
  recommendedSpecialists?: never;
  recommendedTests?: never;
  suggestedFacilities?: never; // Added to align with AnalysisResultSuccess
  summary?: never;
}

export type AnalysisServerResult = AnalysisResultSuccess | AnalysisResultError;


export async function submitSymptomsAction(input: AnalyzeSymptomsInput): Promise<AnalysisServerResult> {
  try {
    if (!input.symptomsAndHistory || input.symptomsAndHistory.trim().length < 10) {
      return { error: "Please provide a more detailed description of your symptoms and medical history (at least 10 characters)." };
    }
    const result = await analyzeSymptoms(input);
    return result;
  } catch (e) {
    console.error("Error in submitSymptomsAction:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during symptom analysis.";
    return { error: errorMessage };
  }
}

