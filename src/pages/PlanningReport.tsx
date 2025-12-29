import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportHeader } from "@/components/planning/report/ReportHeader";
import { ExecutiveSummary } from "@/components/planning/report/ExecutiveSummary";
import { MarketAnalysisSection } from "@/components/planning/report/MarketAnalysisSection";
import { TechnicalFeasibilitySection } from "@/components/planning/report/TechnicalFeasibilitySection";
import { FinancialProjectionsSection } from "@/components/planning/report/FinancialProjectionsSection";
import { UserJourneySection } from "@/components/planning/report/UserJourneySection";
import { ScreenMockupsSection } from "@/components/planning/report/ScreenMockupsSection";
import { NextStepsSection } from "@/components/planning/report/NextStepsSection";

import { LoadingReport } from "@/components/planning/LoadingReport";
import { useConfetti } from "@/hooks/useConfetti";
import { BackToTopButton } from "@/components/blog/BackToTopButton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReportData {
  executiveSummary: {
    keyHighlights: string[];
    marketOpportunity: string;
    mainRisks: string[];
  };
  marketAnalysis: {
    overview: string;
    targetAudienceInsights: string;
    competitiveLandscape: string;
    marketTrends: string[];
    marketPricing?: {
      averageTicket: number;
      priceRange: { min: number; max: number };
      pricingModel: string;
    };
    investmentRecommendations?: {
      monthlyMarketingBudget: number;
      cacEstimate: number;
      adsPercentageOfCac: { min: number; max: number };
      marketingChannels: string[];
    };
  };
  technicalFeasibility: {
    overview: string;
    recommendedStack: {
      frontend: string[];
      backend: string[];
      infrastructure: string[];
      thirdParty: string[];
    };
    developmentPhases: {
      phase: string;
      duration: string;
      deliverables: string[];
    }[];
    technicalChallenges: {
      challenge: string;
      solution: string;
      difficulty: "low" | "medium" | "high";
    }[];
  };
  financialProjections: {
    developmentCost: {
      min: number;
      max: number;
      breakdown: { item: string; percentage: number }[];
    };
    marketingCosts?: {
      monthlyBudget: number;
      yearlyBudget: number;
      cacEstimate: number;
      adsBudgetMin: number;
      adsBudgetMax: number;
    };
    revenueProjections: {
      year1: { mrr: number; arr: number };
      year2: { mrr: number; arr: number };
      year3: { mrr: number; arr: number };
    };
    breakEvenAnalysis: {
      monthsToBreakEven: number;
      assumptions: string[];
    };
    roiEstimate: {
      percentage: number;
      timeframe: string;
    };
    recommendedPricing?: {
      idealTicket: number;
      minimumTicket: number;
      competitiveAdvantage: string;
    };
  };
  userJourney: {
    steps: {
      step: number;
      title: string;
      description: string;
      revenuePoint: boolean;
    }[];
    engagementLoops: string[];
  };
  
}

interface MockupData {
  step: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface SubmissionData {
  companyName: string;
  saasIdea: string;
  viabilityScore: number;
  complexityScore: number;
  recommendedPlan: string;
  launchTimeline: string;
  budgetRange: string;
  reportData: ReportData | null;
  screenMockups: MockupData[] | null;
}

const PlanningReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [showNewReportConfirm, setShowNewReportConfirm] = useState(false);
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [fullData, setFullData] = useState<any>(null);
  const { fireConfetti } = useConfetti();
  const hasShownConfetti = useRef(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) return;

      const { data, error } = await supabase
        .from("wizard_submissions")
        .select("*")
        .eq("report_url", reportId)
        .maybeSingle();

      if (!error && data) {
        setFullData(data);
        const plan = data.recommended_plan || "Starter";
        // Fallback for complexity score if 0
        let complexity = data.complexity_score || 0;
        if (complexity === 0) {
          complexity = plan === "Enterprise" ? 55 : plan === "Growth" ? 45 : 35;
        }
        
        setSubmission({
          companyName: data.company_name,
          saasIdea: data.saas_idea || "",
          viabilityScore: data.viability_score || 0,
          complexityScore: complexity,
          recommendedPlan: plan,
          launchTimeline: data.launch_timeline || "",
          budgetRange: data.budget_range || "",
          reportData: data.report_data as unknown as ReportData | null,
          screenMockups: (data.screen_mockups as unknown as MockupData[]) || null,
        });
      }
      setLoading(false);
    };

    fetchReport();
  }, [reportId]);

  // Persist submission in localStorage when viewing a report (so /planning can redirect back)
  useEffect(() => {
    if (loading || !fullData?.id) return;

    // Save quick reference for /planning redirect
    localStorage.setItem("last_planning_report_url", reportId || fullData.id);

    const competitorsData = Array.isArray(fullData.competitors_data)
      ? fullData.competitors_data
      : [];

    const wizardData = {
      fullName: fullData.full_name || "",
      email: fullData.email || "",
      phone: fullData.phone || "",
      companyName: fullData.company_name || "",
      saasCategory: fullData.saas_category || "",
      saasIdea: fullData.saas_idea || "",
      industry: fullData.industry || "",
      targetCustomers: fullData.target_customers || [],
      marketSize: fullData.market_size || "",
      competitors: fullData.competitors || [],
      competitorsData,
      hasSearchedCompetitors: (fullData.competitors?.length > 0) || competitorsData.length > 0,
      starterFeatures: fullData.starter_features || [],
      growthFeatures: fullData.growth_features || [],
      enterpriseFeatures: fullData.enterprise_features || [],
      primaryGoal: fullData.primary_goal || "",
      launchTimeline: fullData.launch_timeline || "",
      budgetRange: fullData.budget_range || "",
    };

    let preservedStep = 5;
    try {
      const existing = localStorage.getItem("wizard_progress");
      if (existing) {
        const parsed = JSON.parse(existing);
        if (typeof parsed?.currentStep === "number") preservedStep = parsed.currentStep;
      }
    } catch {
      // ignore
    }

    localStorage.setItem(
      "wizard_progress",
      JSON.stringify({ wizardData, currentStep: preservedStep, submissionId: fullData.id })
    );
  }, [fullData, loading, reportId]);

  // Fire confetti when report loads successfully
  useEffect(() => {
    if (!loading && submission?.reportData && !hasShownConfetti.current) {
      const timer = setTimeout(() => {
        fireConfetti();
        hasShownConfetti.current = true;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, submission, fireConfetti]);

  const handleEditReport = () => {
    if (!fullData) return;
    
    // Convert DB data to wizard format and save to localStorage
    const wizardData = {
      fullName: fullData.full_name || "",
      email: fullData.email || "",
      phone: fullData.phone || "",
      companyName: fullData.company_name || "",
      saasCategory: fullData.saas_category || "",
      saasIdea: fullData.saas_idea || "",
      industry: fullData.industry || "",
      targetCustomers: fullData.target_customers || [],
      marketSize: fullData.market_size || "",
      competitors: fullData.competitors || [],
      competitorsData: fullData.competitors_data || [],
      hasSearchedCompetitors: (fullData.competitors?.length > 0) || ((fullData.competitors_data as unknown[])?.length > 0),
      starterFeatures: fullData.starter_features || [],
      growthFeatures: fullData.growth_features || [],
      enterpriseFeatures: fullData.enterprise_features || [],
      primaryGoal: fullData.primary_goal || "",
      launchTimeline: fullData.launch_timeline || "",
      budgetRange: fullData.budget_range || "",
    };
    
    localStorage.setItem("wizard_progress", JSON.stringify({
      wizardData: wizardData,
      currentStep: 5,
      submissionId: fullData.id,
    }));
    
    // Remove report URL to prevent redirect loop when going back to wizard
    localStorage.removeItem("last_planning_report_url");
    
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate("/planning?step=5&edit=true");
  };

  const handleRegenerateReport = async () => {
    if (!fullData?.id) return;
    
    setRegenerating(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-saas-report', {
        body: { submissionId: fullData.id }
      });
      
      if (error || !result?.success) {
        throw new Error(result?.error || 'Failed to regenerate report');
      }
      
      // Fetch updated data from database
      const { data: updatedData, error: fetchError } = await supabase
        .from("wizard_submissions")
        .select("*")
        .eq("id", fullData.id)
        .single();
      
      if (fetchError || !updatedData) {
        throw new Error('Failed to fetch updated report');
      }
      
      // Update state with new data
      setFullData(updatedData);
      const plan = updatedData.recommended_plan || "Starter";
      let complexity = updatedData.complexity_score || 0;
      if (complexity === 0) {
        complexity = plan === "Enterprise" ? 55 : plan === "Growth" ? 45 : 35;
      }
      
      setSubmission({
        companyName: updatedData.company_name,
        saasIdea: updatedData.saas_idea || "",
        viabilityScore: updatedData.viability_score || 0,
        complexityScore: complexity,
        recommendedPlan: plan,
        launchTimeline: updatedData.launch_timeline || "",
        budgetRange: updatedData.budget_range || "",
        reportData: updatedData.report_data as unknown as ReportData | null,
        screenMockups: (updatedData.screen_mockups as unknown as MockupData[]) || null,
      });
      
      toast.success('Relatório regenerado com sucesso!');
      hasShownConfetti.current = false;
      setRegenerating(false);
      
    } catch (error) {
      console.error('Error regenerating report:', error);
      toast.error('Falha ao regenerar relatório. Tente novamente.');
      setRegenerating(false);
    }
  };

  const handleNewReport = () => {
    setShowNewReportConfirm(true);
  };

  const confirmNewReport = async () => {
    // Delete the current submission from database
    if (fullData?.id) {
      await supabase
        .from("wizard_submissions")
        .delete()
        .eq("id", fullData.id);
    }
    
    localStorage.removeItem("wizard_progress");
    localStorage.removeItem("last_planning_report_url");
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate("/planning?step=2");
  };

  if (regenerating) {
    return <LoadingReport />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (!submission || !submission.reportData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Report Not Found</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              The report you&apos;re looking for doesn&apos;t exist or is still being generated.
            </p>
            <Button asChild>
              <Link to="/planning">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Start New Planning
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { reportData } = submission;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 md:pt-36 pb-20">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          {/* Report Header with Scores */}
          <ReportHeader
            companyName={submission.companyName}
            saasIdea={submission.saasIdea}
            viabilityScore={submission.viabilityScore}
            complexityScore={submission.complexityScore}
            recommendedPlan={submission.recommendedPlan}
            launchTimeline={submission.launchTimeline}
            budgetRange={submission.budgetRange}
          />


          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />


          {/* Executive Summary */}
          <ExecutiveSummary data={reportData.executiveSummary} />

          {/* Market Analysis */}
          <MarketAnalysisSection 
            data={reportData.marketAnalysis} 
            recommendedPlan={submission.recommendedPlan}
            competitorsData={fullData?.competitors_data}
            starterFeatures={fullData?.starter_features || []}
            growthFeatures={fullData?.growth_features || []}
            enterpriseFeatures={fullData?.enterprise_features || []}
          />

          {/* Technical Feasibility */}
          <TechnicalFeasibilitySection data={reportData.technicalFeasibility} />

          {/* Financial Projections */}
          <FinancialProjectionsSection 
            data={reportData.financialProjections} 
            marketPricing={reportData.marketAnalysis.marketPricing}
            recommendedPlan={submission.recommendedPlan}
          />

          {/* User Journey */}
          <UserJourneySection data={reportData.userJourney} />

          {/* Screen Mockups */}
          <ScreenMockupsSection
            submissionId={reportId || ""}
            saasIdea={submission.saasIdea}
            companyName={submission.companyName}
            steps={reportData.userJourney.steps}
            existingMockups={submission.screenMockups}
            onMockupsGenerated={(mockups) => {
              setSubmission(prev => prev ? { ...prev, screenMockups: mockups } : prev);
            }}
          />

          {/* Next Steps & CTA */}
          <NextStepsSection
            companyName={submission.companyName}
            recommendedPlan={submission.recommendedPlan}
            onEditReport={handleEditReport}
            onRegenerateReport={handleRegenerateReport}
            onNewReport={handleNewReport}
            isRegenerating={regenerating}
          />
        </div>
      </main>

      {/* Confirmation Dialog for New Report */}
      <AlertDialog open={showNewReportConfirm} onOpenChange={setShowNewReportConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start New Report?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the current project data and start from scratch.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmNewReport}>
              Yes, Start New Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default PlanningReport;
