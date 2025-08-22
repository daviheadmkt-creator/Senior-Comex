'use client';

import { useState } from 'react';
import { summarizeOperationalReport } from '@/ai/flows/summarize-operational-report';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const placeholderReport = `Operational Report: Q2 2024

Date: July 15, 2024
Prepared by: Operations Team

Executive Summary:
The second quarter of 2024 showed strong performance in our logistics division, with a 15% increase in on-time deliveries compared to Q1. However, the finance department faced challenges with currency fluctuations, impacting overall profitability by 5%. Import from Brazil increased by 20% for soybeans, while corn exports to Mexico remained stable.

Key Activities:
1.  Logistics: Implemented new tracking system, reducing package loss by 8%. Average transit time was reduced by 12 hours for major routes.
2.  Finance: Hedging strategies were partially successful against the dollar's strength. A new audit revealed compliance gaps in customs declarations for Canadian wheat shipments.
3.  Operations: New partnership with a Colombian coffee supplier secured. Negotiations are ongoing for expanding sugar cane exports to India. Two major shipments were put on hold due to documentation issues.

Challenges:
-   Port congestion in China continues to be a major bottleneck.
-   Rising fuel costs are increasing operational expenses.
-   Regulatory changes in the EU require updated compliance protocols.

Outlook for Q3 2024:
Focus will be on mitigating financial risks and resolving logistics bottlenecks. We project a steady growth of 5-7% in overall trade volume, driven by new partnerships.
`;

export default function AISummarizer() {
  const [report, setReport] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!report.trim()) {
      toast({
        title: "Error",
        description: "Report content cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeOperationalReport({ report });
      setSummary(result.summary);
    } catch (error) {
      console.error('Error summarizing report:', error);
      toast({
        title: "Summarization Failed",
        description: "An error occurred while summarizing the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Textarea
          placeholder="Paste your operational report here or load an example to test."
          value={report}
          onChange={(e) => setReport(e.target.value)}
          className="min-h-[300px] text-sm"
        />
        <div className="flex gap-2">
            <Button onClick={handleSummarize} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="mr-2 h-4 w-4" />
            )}
            Summarize
            </Button>
            <Button variant="outline" onClick={() => setReport(placeholderReport)} disabled={isLoading}>
                Load Example
            </Button>
        </div>
      </div>
      <div>
        <Card className="min-h-[300px] h-full bg-secondary/30 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">AI Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : summary ? (
              <div className="text-sm text-foreground/90 space-y-4">
                <p>{summary}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-center">
                Your AI-generated summary will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
