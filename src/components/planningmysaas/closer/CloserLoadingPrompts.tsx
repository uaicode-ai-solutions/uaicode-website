import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mic, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GeneratingReportSkeleton from "@/components/planningmysaas/skeletons/GeneratingReportSkeleton";
import { useReportData } from "@/hooks/useReportData";
import { useReport } from "@/hooks/useReport";
import { supabase } from "@/integrations/supabase/client";

interface CloserLoadingPromptsProps {
  wizardId: string;
  onReportReady: () => void;
}

const SPICED_PROMPTS = [
  {
    letter: "S",
    label: "Situation",
    question: "Tell me about your current business model. How do you make money today?",
    followUp: "What's working well? What would you change?",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10 border-blue-400/20",
  },
  {
    letter: "P",
    label: "Problem",
    question: "What's the biggest challenge or frustration you're facing right now?",
    followUp: "How long has this been a problem? What have you tried?",
    color: "text-red-400",
    bgColor: "bg-red-400/10 border-red-400/20",
  },
  {
    letter: "I",
    label: "Impact",
    question: "How is this problem affecting your revenue or growth?",
    followUp: "Can you quantify the cost of not solving this?",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/20",
  },
  {
    letter: "C",
    label: "Critical Event",
    question: "What made you decide to act on this now? Was there a specific trigger?",
    followUp: "What happens if you don't solve this in the next 3 months?",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    letter: "D",
    label: "Decision",
    question: "What does success look like for you in 6 months? How will you measure it?",
    followUp: "Who else is involved in this decision?",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10 border-purple-400/20",
  },
];

const CloserLoadingPrompts = ({ wizardId, onReportReady }: CloserLoadingPromptsProps) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);

  const { data: wizardData } = useReport(wizardId);
  const { data: reportData } = useReportData(wizardId);
  const projectName = wizardData?.saas_name || "Your SaaS";
  const status = reportData?.status;
  const isCompleted = status?.trim().toLowerCase() === "completed";

  // Trigger orchestrator on mount
  useEffect(() => {
    if (hasTriggered) return;
    setHasTriggered(true);

    (async () => {
      try {
        await supabase.functions.invoke("pms-orchestrate-report", {
          body: { wizard_id: wizardId },
        });
      } catch (err) {
        console.error("[CloserLoading] Orchestrator error:", err);
      }
    })();
  }, [wizardId, hasTriggered]);

  // Watch for completion
  useEffect(() => {
    if (isCompleted) {
      onReportReady();
    }
  }, [isCompleted, onReportReady]);

  // Auto-rotate prompts every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex(prev => (prev + 1) % SPICED_PROMPTS.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNextPrompt = useCallback(() => {
    setCurrentPromptIndex(prev => (prev + 1) % SPICED_PROMPTS.length);
  }, []);

  const prompt = SPICED_PROMPTS[currentPromptIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-background overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        {/* Report Generation Progress */}
        <div className="flex-1">
          <GeneratingReportSkeleton
            projectName={projectName}
            currentStatus={status}
          />
        </div>

        {/* SPICED Conversation Prompt - Fixed at bottom */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/50 p-4">
          <div className="max-w-lg mx-auto">
            <Card className={`border ${prompt.bgColor}`}>
              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-accent" />
                    <span className="text-xs font-semibold text-muted-foreground">
                      While we wait... ask this:
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-border/50">
                    {currentPromptIndex + 1} / {SPICED_PROMPTS.length}
                  </Badge>
                </div>

                {/* SPICED Letter + Question */}
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full bg-card border border-border/50 flex items-center justify-center text-sm font-bold ${prompt.color} flex-shrink-0`}>
                    {prompt.letter}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[10px] font-semibold ${prompt.color} mb-1`}>
                      {prompt.label}
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      "{prompt.question}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Follow-up: "{prompt.followUp}"
                    </p>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextPrompt}
                    className="text-xs gap-1 text-muted-foreground hover:text-foreground"
                  >
                    Next Question
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloserLoadingPrompts;
