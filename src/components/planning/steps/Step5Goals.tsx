import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { ArrowLeft, Sparkles, RefreshCw, Zap, DollarSign, Users, Target, Lightbulb, HelpCircle, FileText } from "lucide-react";
import { WizardData } from "@/pages/Planning";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingReport } from "../LoadingReport";

interface Step5Props {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  onPrev: (stepData?: Partial<WizardData>) => void;
  submissionId: string | null;
  existingReportId?: string | null;
}

const goalOptions = [
  { value: "replace", label: "Replace manual processes", description: "Automate existing business workflows", icon: RefreshCw },
  { value: "revenue", label: "Create a new revenue stream", description: "Build a new product to sell", icon: DollarSign },
  { value: "serve", label: "Serve customers in a new way", description: "Improve customer experience", icon: Users },
  { value: "disrupt", label: "Disrupt an existing market", description: "Challenge established players", icon: Zap },
  { value: "solve", label: "Solve a problem I personally face", description: "Scratch your own itch", icon: Lightbulb },
  { value: "other", label: "Other", description: "Something different", icon: HelpCircle },
];

const timelineOptions = [
  { value: "asap", label: "ASAP (within 3 months)" },
  { value: "this_year", label: "This year (3-6 months)" },
  { value: "next_year", label: "Next year (6-12 months)" },
  { value: "flexible", label: "I'm flexible on timing" },
];

const budgetOptions = [
  { value: "10k-25k", label: "$10K - $25K", description: "Basic MVP" },
  { value: "25k-50k", label: "$25K - $50K", description: "Complete MVP" },
  { value: "50k-100k", label: "$50K - $100K", description: "Robust product" },
  { value: "100k+", label: "$100K+", description: "Enterprise solution" },
  { value: "guidance", label: "I need guidance", description: "Help with budgeting" },
];

const Step5Goals = ({ data, updateData, onPrev, submissionId, existingReportId }: Step5Props) => {
  const navigate = useNavigate();
  const [primaryGoal, setPrimaryGoal] = useState(data.primaryGoal);
  const [launchTimeline, setLaunchTimeline] = useState(data.launchTimeline);
  const [budgetRange, setBudgetRange] = useState(data.budgetRange);
  const [isGenerating, setIsGenerating] = useState(false);

  // Update local state when data prop changes (e.g., loaded from database)
  React.useEffect(() => {
    if (data.primaryGoal && data.primaryGoal !== primaryGoal) setPrimaryGoal(data.primaryGoal);
    if (data.launchTimeline && data.launchTimeline !== launchTimeline) setLaunchTimeline(data.launchTimeline);
    if (data.budgetRange && data.budgetRange !== budgetRange) setBudgetRange(data.budgetRange);
  }, [data.primaryGoal, data.launchTimeline, data.budgetRange]);

  // Sync changes to parent state
  const handleGoalChange = (goal: string) => {
    setPrimaryGoal(goal);
    updateData({ primaryGoal: goal });
  };

  const handleTimelineChange = (timeline: string) => {
    setLaunchTimeline(timeline);
    updateData({ launchTimeline: timeline });
  };

  const handleBudgetChange = (budget: string) => {
    setBudgetRange(budget);
    updateData({ budgetRange: budget });
  };

  const handleGenerate = async () => {
    if (!submissionId) {
      toast.error("Please complete step 1 first");
      return;
    }

    setIsGenerating(true);
    updateData({ primaryGoal, launchTimeline, budgetRange });

    try {
      // First update the submission with final step data
      const { error: updateError } = await supabase
        .from("wizard_submissions")
        .update({
          primary_goal: primaryGoal,
          launch_timeline: launchTimeline,
          budget_range: budgetRange,
        })
        .eq("id", submissionId);

      if (updateError) throw updateError;

      // Call the AI-powered report generation edge function
      const { data: result, error: functionError } = await supabase.functions.invoke('generate-saas-report', {
        body: { submissionId }
      });

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(functionError.message || 'Failed to generate report');
      }

      if (result?.error) {
        // Handle specific error cases
        if (result.error.includes('Rate limit')) {
          toast.error('Too many requests. Please wait a moment and try again.');
        } else if (result.error.includes('credits')) {
          toast.error('AI credits exhausted. Please try again later.');
        } else {
          toast.error(result.error);
        }
        return;
      }

      if (!result?.success || !result?.reportUrl) {
        throw new Error('Invalid response from report generation');
      }

      // Clear local storage
      localStorage.removeItem("wizard_progress");

      // Navigate to report page
      toast.success('Report generated successfully!');
      navigate(`/planning/report/${result.reportUrl}`);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isValid = primaryGoal && launchTimeline && budgetRange;

  if (isGenerating) {
    return <LoadingReport />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Set Your <span className="text-accent">Goals</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Final step! Tell us about your objectives and timeline so we can provide accurate recommendations.
        </p>
      </div>

      {/* Primary Goal */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">What's your main goal with this SaaS? *</h3>
          <p className="text-sm text-muted-foreground">Select the option that best describes your objective</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {goalOptions.map((goal) => {
            const Icon = goal.icon;
            const isSelected = primaryGoal === goal.value;
            return (
              <button
                key={goal.value}
                onClick={() => handleGoalChange(goal.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-300 group ${
                  isSelected
                    ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                    : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isSelected ? "bg-accent text-accent-foreground" : "bg-muted group-hover:bg-accent/20"
                  }`}>
                    <Icon className={`w-5 h-5 transition-all duration-300 ${
                      isSelected ? "" : "group-hover:text-accent"
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{goal.label}</h4>
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">What's your estimated development budget? *</h3>
          <p className="text-sm text-muted-foreground">Select your estimated investment range</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {budgetOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleBudgetChange(option.value)}
              className={`p-4 rounded-xl border-2 text-center transition-all duration-300 group ${
                budgetRange === option.value
                  ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                  : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
              }`}
            >
              <h4 className="font-medium text-sm text-foreground">{option.label}</h4>
              <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Launch Timeline */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">When do you plan to launch? *</h3>
          <p className="text-sm text-muted-foreground">When do you want to go live?</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timelineOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTimelineChange(option.value)}
              className={`p-4 rounded-xl border-2 text-center transition-all duration-300 group ${
                launchTimeline === option.value
                  ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                  : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
              }`}
            >
              <h4 className="font-medium text-sm text-foreground">{option.label}</h4>
            </button>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/30 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto text-center">
        <Target className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">
          Ready to see your personalized feasibility study?
        </h3>
        <p className="text-muted-foreground mb-6">
          Our AI will analyze your responses and generate a comprehensive report with market analysis, technical feasibility, and financial projections.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between max-w-2xl mx-auto pt-4">
        <Button variant="outline" onClick={() => onPrev({ primaryGoal, launchTimeline, budgetRange })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-3">
          {existingReportId && (
            <Button
              variant="outline"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate(`/planning/report/${existingReportId}`);
              }}
              className="border-accent text-accent hover:bg-accent/10"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Report
            </Button>
          )}
          <Button
            onClick={handleGenerate}
            disabled={!isValid || isGenerating}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {existingReportId ? "Regenerate Report" : "Generate My SaaS Report"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step5Goals;
