"use client";

import * as React from "react";
import { SymptomForm } from "@/components/health-mind/SymptomForm";
import { AnalysisResults } from "@/components/health-mind/AnalysisResults";
import { Header } from "@/components/layout/Header";
import { submitSymptomsAction, type AnalysisServerResult, type AnalysisResultSuccess } from "@/lib/actions";
import type { AnalyzeSymptomsInput } from "@/ai/flows/analyze-symptoms";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function HealthMindPage() {
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResultSuccess | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: AnalyzeSymptomsInput) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const result: AnalysisServerResult = await submitSymptomsAction(data);

    setIsLoading(false);
    if (result.error) {
      setError(result.error);
      toast({
        title: "Analysis Failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setAnalysisResult(result);
       toast({
        title: "Analysis Complete",
        description: "View your AI-powered health insights below.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center mb-8">
             <Image 
              src="https://picsum.photos/seed/healthmind/150/150" 
              alt="HealthMind AI Illustration" 
              width={120} 
              height={120} 
              className="mx-auto rounded-full shadow-lg mb-4"
              data-ai-hint="abstract health"
            />
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Welcome to <span className="text-primary">HealthMind AI</span>
            </h1>
            <p className="mt-4 text-lg text-foreground/80">
              Your AI-powered assistant for understanding health symptoms.
            </p>
          </div>
          <SymptomForm onSubmit={handleSubmit} isLoading={isLoading} />
          {(isLoading || analysisResult || error) && (
            <AnalysisResults analysis={analysisResult} isLoading={isLoading} error={error} />
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-foreground/60 border-t border-border/30">
        <p>&copy; {new Date().getFullYear()} HealthMind AI. All rights reserved.</p>
        <p className="text-sm mt-1">Developed by Vijaykumar Ingle</p>
        <p className="text-xs mt-1">This tool provides information for educational purposes only and is not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}

