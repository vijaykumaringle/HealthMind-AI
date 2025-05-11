// src/components/health-mind/SymptomForm.tsx
"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // Added Input
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, Sparkles, MapPinIcon } from "lucide-react"; // Added MapPinIcon
import type { AnalyzeSymptomsInput } from "@/ai/flows/analyze-symptoms";

const formSchema = z.object({
  symptomsAndHistory: z.string().min(10, {
    message: "Please provide a detailed description of your symptoms and medical history (at least 10 characters).",
  }),
  location: z.string().optional().describe("Your current location (e.g., city, zip code) to help find nearby facilities."),
});

type SymptomFormValues = z.infer<typeof formSchema>;

interface SymptomFormProps {
  onSubmit: (data: SymptomFormValues) => Promise<void>;
  isLoading: boolean;
}

export function SymptomForm({ onSubmit, isLoading }: SymptomFormProps) {
  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptomsAndHistory: "",
      location: "",
    },
  });

  const handleFormSubmit: SubmitHandler<SymptomFormValues> = async (data) => {
    await onSubmit(data);
  };

  return (
    <Card className="w-full shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileText className="h-7 w-7 text-primary" />
          Symptom Analyzer
        </CardTitle>
        <CardDescription>
          Describe your symptoms and relevant medical history. Our AI will provide potential insights.
          This tool is not a substitute for professional medical advice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="symptomsAndHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Symptoms & Medical History</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Persistent cough for 2 weeks, mild fever, history of asthma..."
                      className="min-h-[150px] text-base resize-none"
                      {...field}
                      aria-label="Symptoms and Medical History"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-primary/80" />
                    Your Location (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Pune, New York, 90210"
                      className="text-base"
                      {...field}
                      aria-label="Your Location to find nearby medical facilities"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Symptoms
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
