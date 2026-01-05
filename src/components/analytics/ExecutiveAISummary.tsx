'use client';

import { useCompletion } from '@ai-sdk/react';
import { Sparkles, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from 'react';

export default function ExecutiveAISummary({ contextData }: { contextData: string }) {
    const { completion, complete, isLoading } = useCompletion({
        api: '/api/generate-summary',
    });

    // Auto-generate on mount or value change
    /* 
    useEffect(() => {
       if (contextData) complete(contextData);
    }, [contextData]); 
    */
    // Actually, let's make it manual or explicit to save tokens/costs on page loads, 
    // or user preference. The request said "Click refresh".

    const prompt = `
  You are a Senior HR Analyst for a major enterprise. 
  Based on the following data summary:
  ${contextData}

  Provide a 3-bullet point executive summary. 
  Focus on: 
  1. Financial Efficiency
  2. Operational Risks (turnover, gaps)
  3. One strategic recommendation.
  
  Use professional, decisive, executive-level language. Keep it under 100 words. Do not use markdown bolding too heavily.
  `;

    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkles className="w-24 h-24" />
            </div>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-indigo-600 h-5 w-5" />
                        <h3 className="font-bold text-lg text-gray-800">AI Strategic Insights</h3>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => complete(prompt)}
                        disabled={isLoading}
                        className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    >
                        {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        {isLoading ? "Analyzing..." : "Generate Insights"}
                    </Button>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-gray-700 min-h-[100px]">
                    {completion ? (
                        <div className="animate-in fade-in duration-700 whitespace-pre-wrap font-medium">{completion}</div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
                            <p>Click generic insights to analyze organizational health.</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-indigo-100 flex gap-6">
                    <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                        <TrendingUp className="h-3 w-3" /> Live Data Analysis
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-purple-600">
                        <BarChart3 className="h-3 w-3" /> Gemini 1.5 Pro
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
