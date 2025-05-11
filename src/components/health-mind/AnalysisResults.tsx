// src/components/health-mind/AnalysisResults.tsx
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ListChecks, Users, FlaskConical, Info, AlertCircle, Loader2, Hospital, MapPin } from "lucide-react";
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
  if (items && items.length === 0 && !text) return null;


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
    return null;
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
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary">
              <Hospital className="h-6 w-6 opacity-50" />
              <Skeleton className="h-6 w-56" /> {/* Title: Suggested Medical Facilities */}
            </h3>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => ( 
                <div key={i} className="flex items-center justify-between p-4 border bg-card rounded-lg shadow-sm">
                  <div className="space-y-1.5 flex-grow mr-4">
                    <Skeleton className="h-5 w-3/4" /> {/* Facility Name */}
                    <Skeleton className="h-3 w-full max-w-xs" /> {/* Facility Address */}
                    <Skeleton className="h-4 w-1/2" /> {/* Facility Type */}
                  </div>
                  <Skeleton className="h-9 w-24 rounded-md shrink-0" /> {/* View Map Button */}
                </div>
              ))}
            </div>
          </div>
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

        {analysis.suggestedFacilities && analysis.suggestedFacilities.length > 0 && (
          <>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary">
                <Hospital className="h-6 w-6" />
                Suggested Medical Facilities
              </h3>
              <ul className="space-y-3">
                {analysis.suggestedFacilities.map((facility, index) => (
                  <li key={index} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out">
                    <div className="flex-grow mr-4">
                      <p className="font-semibold text-card-foreground leading-tight">{facility.name}</p>
                      {facility.address && <p className="text-xs text-muted-foreground/80 mt-0.5">{facility.address}</p>}
                      <p className="text-sm text-muted-foreground mt-0.5">{facility.type}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const query = encodeURIComponent(facility.address || `${facility.name}, ${facility.type}`);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
                      }}
                      className="shrink-0 whitespace-nowrap"
                      aria-label={`View ${facility.name} on map`}
                    >
                      <MapPin className="mr-1.5 h-4 w-4" />
                      View Map
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <Separator className="my-6"/>
          </>
        )}

        <ResultSection title="Summary" icon={Info} text={analysis.summary} isLoading={false}/>
      </CardContent>
    </Card>
  );
}
