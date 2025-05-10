"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ListChecks, Users, FlaskConical, Info, AlertCircle, Loader2 } from "lucide-react";
import type { AnalysisResultSuccess } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalysisResultsProps {
  analysis: AnalysisResultSuccess | null;
  isLoading: boolean;
  error?: string | null;
}

const ResultSection: React.FC<{ title: string; icon: React.ElementType; items?: string[]; text?: string; isLoading: boolean; itemsCount?: number }> = ({ title, icon: Icon, items, text, isLoading, itemsCount = 3 }) => {
  if (isLoading) {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-primary">
          <Icon className="h-6 w-6" />
          {title}
        </h3>
        {Array.from({ length: itemsCount }).map((_, i) => (
           <Skeleton key={i} className={`h-6 mb-2 ${i === 0 ? 'w-3/4' : i === 1 ? 'w-1/2' : 'w-2/3'}`} />
        ))}
         {text && <Skeleton className="h-16 w-full" />}
      </div>
    );
  }
  
  if (!items && !text) return null;

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-primary">
        <Icon className="h-6 w-6" />
        {title}
      </h3>
      {items && items.length > 0 && (
        <ul className="space-y-2 list-inside">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <Badge variant="secondary" className="mr-2 text-sm py-1 px-3 rounded-full">{item}</Badge>
            </li>
          ))}
        </ul>
      )}
      {text && <p className="text-foreground/90 leading-relaxed">{text}</p>}
    </div>
  );
};


export function AnalysisResults({ analysis, isLoading, error }: AnalysisResultsProps) {
  if (error) {
    return (
      <Alert variant="destructive" className="mt-6 shadow-md rounded-lg">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Analysis Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!isLoading && !analysis && !error) {
    return null; // Don't show anything if not loading, no analysis, and no error
  }
  
  if (isLoading) {
     return (
      <Card className="mt-8 w-full shadow-lg rounded-xl animate-pulse">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            <Loader2 className="h-8 w-8 inline mr-2 animate-spin text-primary" />
            Generating Analysis...
            </CardTitle>
          <CardDescription className="text-center">
            Our AI is processing your information. This may take a moment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <ResultSection title="Possible Conditions" icon={ListChecks} isLoading={true} itemsCount={3}/>
          <Separator className="my-6"/>
          <ResultSection title="Recommended Specialists" icon={Users} isLoading={true} itemsCount={2}/>
          <Separator className="my-6"/>
          <ResultSection title="Recommended Tests" icon={FlaskConical} isLoading={true} itemsCount={2}/>
          <Separator className="my-6"/>
          <ResultSection title="Summary" icon={Info} text="" isLoading={true} />
        </CardContent>
      </Card>
    );
  }


  if (!analysis) return null;

  return (
    <Card className="mt-8 w-full shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">AI Analysis Results</CardTitle>
        <CardDescription className="text-center text-md">
          Based on the information you provided, here are some potential insights.
          <br />
          <strong>Disclaimer:</strong> This is not a medical diagnosis. Always consult with a healthcare professional.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <ResultSection title="Possible Conditions" icon={ListChecks} items={analysis.possibleConditions} isLoading={false}/>
        {(analysis.possibleConditions?.length ?? 0) > 0 && <Separator className="my-6"/>}
        
        <ResultSection title="Recommended Specialists" icon={Users} items={analysis.recommendedSpecialists} isLoading={false}/>
        {(analysis.recommendedSpecialists?.length ?? 0) > 0 && <Separator className="my-6"/>}

        <ResultSection title="Recommended Tests" icon={FlaskConical} items={analysis.recommendedTests} isLoading={false}/>
        {(analysis.recommendedTests?.length ?? 0) > 0 && <Separator className="my-6"/>}

        <ResultSection title="Summary" icon={Info} text={analysis.summary} isLoading={false}/>
      </CardContent>
    </Card>
  );
}
