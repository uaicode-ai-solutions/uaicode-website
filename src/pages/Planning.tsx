import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WizardProgress from "@/components/planning/WizardProgress";
import Step1LeadCapture from "@/components/planning/steps/Step1LeadCapture";
import Step2ProductDefinition from "@/components/planning/steps/Step2ProductDefinition";
import Step3TargetAudience from "@/components/planning/steps/Step3TargetAudience";
import Step4Features from "@/components/planning/steps/Step4Features";
import Step5Goals from "@/components/planning/steps/Step5Goals";
import { supabase } from "@/integrations/supabase/client";

export interface CompetitorWithPricing {
  name: string;
  website?: string;
  description?: string;
  urlValid?: boolean;
  verified?: boolean;
  source?: string;
  pricing?: {
    startingPrice?: number;
    pricingModel?: string;
    targetSegment?: string;
    priceVerified?: boolean;
  };
}

export interface WizardData {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  // Step 2
  saasCategory: string;
  saasIdea: string;
  industry: string;
  // Step 3
  targetCustomers: string[];
  marketSize: string;
  competitors: string[];
  competitorsData: CompetitorWithPricing[];
  hasSearchedCompetitors: boolean;
  // Step 4
  starterFeatures: string[];
  growthFeatures: string[];
  enterpriseFeatures: string[];
  // Step 5
  primaryGoal: string;
  launchTimeline: string;
  budgetRange: string;
}

const initialWizardData: WizardData = {
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  saasCategory: "",
  saasIdea: "",
  industry: "",
  targetCustomers: [],
  marketSize: "",
  competitors: [],
  competitorsData: [],
  hasSearchedCompetitors: false,
  starterFeatures: [],
  growthFeatures: [],
  enterpriseFeatures: [],
  primaryGoal: "",
  launchTimeline: "",
  budgetRange: "",
};

const Planning = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const stepParam = searchParams.get("step");
  const [currentStep, setCurrentStep] = useState(stepParam ? parseInt(stepParam) : 1);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [existingReportId, setExistingReportId] = useState<string | null>(null);

  // Update URL when step changes (preserve edit param if exists)
  useEffect(() => {
    const newParams: Record<string, string> = { step: currentStep.toString() };
    const editParam = searchParams.get("edit");
    if (editParam) {
      newParams.edit = editParam;
    }
    setSearchParams(newParams);
  }, [currentStep, setSearchParams, searchParams]);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (wizardData.email) {
        localStorage.setItem("wizard_progress", JSON.stringify({ wizardData, currentStep, submissionId }));
      }
    }, 30000);

    return () => clearInterval(saveInterval);
  }, [wizardData, currentStep, submissionId]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Check for existing report and redirect on mount
  useEffect(() => {
    const checkExistingReport = async () => {
      // If user is in edit mode (coming from report), don't redirect
      const isEditMode = searchParams.get("edit") === "true";
      if (isEditMode) {
        return;
      }
      
      // Priority 1: Check last_planning_report_url (quick and reliable)
      const lastReportUrl = localStorage.getItem("last_planning_report_url");
      if (lastReportUrl) {
        navigate(`/planning/report/${lastReportUrl}`, { replace: true });
        return;
      }

      // Priority 2: Check wizard_progress
      const savedProgress = localStorage.getItem("wizard_progress");
      if (!savedProgress) return;
      
      try {
        const parsed = JSON.parse(savedProgress);
        const { submissionId: savedId } = parsed;
        if (!savedId) return;
        
        // Check if this submission has a completed report
        const { data: submission, error } = await supabase
          .from("wizard_submissions")
          .select("id, report_data, report_url")
          .eq("id", savedId)
          .maybeSingle();
        
        if (error || !submission) return;
        
        // If report exists, redirect to it
        if (submission.report_data && submission.report_url) {
          navigate(`/planning/report/${submission.report_url}`, { replace: true });
        }
      } catch {
        // Invalid JSON, ignore
      }
    };
    
    checkExistingReport();
  }, [navigate, searchParams]);

  // Load saved progress on mount (only if not redirected)
  useEffect(() => {
    const savedProgress = localStorage.getItem("wizard_progress");
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      const { wizardData: savedData, currentStep: savedStep, submissionId: savedId } = parsed;
      // Validate that savedData is a valid object with expected properties
      if (savedData && typeof savedData === 'object' && 'saasIdea' in savedData) {
        setWizardData({ ...initialWizardData, ...savedData });
        if (savedStep) setCurrentStep(savedStep);
        if (savedId) setSubmissionId(savedId);
      }
    }
  }, []);

  // Load data from database when submissionId is available
  useEffect(() => {
    const loadFromDatabase = async () => {
      if (!submissionId) return;
      
      const { data: submission, error } = await supabase
        .from("wizard_submissions")
        .select("*")
        .eq("id", submissionId)
        .single();
      
      if (error || !submission) return;

      // Check if report already exists
      if (submission.report_data && submission.report_url) {
        setExistingReportId(submission.report_url);
      } else {
        setExistingReportId(null);
      }

      // Only update fields that have values in the database
      setWizardData(prev => ({
        ...prev,
        fullName: submission.full_name || prev.fullName,
        email: submission.email || prev.email,
        phone: submission.phone || prev.phone,
        companyName: submission.company_name || prev.companyName,
        saasCategory: submission.saas_category || prev.saasCategory,
        saasIdea: submission.saas_idea || prev.saasIdea,
        industry: submission.industry || prev.industry,
        targetCustomers: submission.target_customers || prev.targetCustomers,
        marketSize: submission.market_size || prev.marketSize,
        competitors: submission.competitors || prev.competitors,
        competitorsData: (submission.competitors_data as unknown as CompetitorWithPricing[]) || prev.competitorsData,
        starterFeatures: submission.starter_features || prev.starterFeatures,
        growthFeatures: submission.growth_features || prev.growthFeatures,
        enterpriseFeatures: submission.enterprise_features || prev.enterpriseFeatures,
        primaryGoal: submission.primary_goal || prev.primaryGoal,
        launchTimeline: submission.launch_timeline || prev.launchTimeline,
        budgetRange: submission.budget_range || prev.budgetRange,
      }));
    };

    loadFromDatabase();
  }, [submissionId]);

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...data }));
  };

  const handleNextStep = async (stepData?: Partial<WizardData>) => {
    // Atualizar estado local se dados foram passados
    if (stepData) {
      setWizardData((prev) => ({ ...prev, ...stepData }));
    }
    
    // Usar os dados passados OU os do estado
    const currentData = stepData ? { ...wizardData, ...stepData } : wizardData;

    // Save to database after step 1
    if (currentStep === 1) {
      // Verificar se já existe submission com o mesmo email
      const { data: existingSubmission } = await supabase
        .from("wizard_submissions")
        .select("id, report_data, report_url")
        .eq("email", currentData.email)
        .maybeSingle();

      if (existingSubmission) {
        // Verificar se estamos em modo de edição
        const isEditMode = searchParams.get("edit") === "true";
        
        // Só redireciona se tem relatório E NÃO está em modo de edição
        if (existingSubmission.report_data && existingSubmission.report_url && !isEditMode) {
          localStorage.setItem("last_planning_report_url", existingSubmission.report_url);
          navigate(`/planning/report/${existingSubmission.report_url}`, { replace: true });
          return;
        }

        // Usuário existente sem relatório - atualizar registro
        await supabase
          .from("wizard_submissions")
          .update({
            full_name: currentData.fullName,
            phone: currentData.phone,
            company_name: currentData.companyName,
            current_step: 2,
          })
          .eq("id", existingSubmission.id);

        setSubmissionId(existingSubmission.id);
      } else {
        // Novo usuário - criar registro
        const { data, error } = await supabase
          .from("wizard_submissions")
          .insert({
            email: currentData.email,
            full_name: currentData.fullName,
            phone: currentData.phone,
            company_name: currentData.companyName,
            current_step: 2,
          })
          .select("id")
          .single();

        if (!error && data) {
          setSubmissionId(data.id);
        }
      }
    } else if (currentStep === 2 && submissionId) {
      // Step 2: salvar dados do produto
      await supabase
        .from("wizard_submissions")
        .update({
          saas_category: currentData.saasCategory,
          saas_idea: currentData.saasIdea,
          industry: currentData.industry,
          current_step: 3,
        })
        .eq("id", submissionId);
    } else if (currentStep === 3 && submissionId) {
      // Step 3: salvar dados do público-alvo
      await supabase
        .from("wizard_submissions")
        .update({
          target_customers: currentData.targetCustomers,
          market_size: currentData.marketSize,
          competitors: currentData.competitors,
          competitors_data: JSON.parse(JSON.stringify(currentData.competitorsData || [])),
          current_step: 4,
        })
        .eq("id", submissionId);
    } else if (currentStep === 4 && submissionId) {
      // Step 4: salvar features
      await supabase
        .from("wizard_submissions")
        .update({
          starter_features: currentData.starterFeatures,
          growth_features: currentData.growthFeatures,
          enterprise_features: currentData.enterpriseFeatures,
          current_step: 5,
        })
        .eq("id", submissionId);
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handlePrevStep = async (stepData?: Partial<WizardData>) => {
    // Atualizar estado local se dados foram passados
    if (stepData) {
      setWizardData((prev) => ({ ...prev, ...stepData }));
    }

    // Usar os dados passados OU os do estado
    const currentData = stepData ? { ...wizardData, ...stepData } : wizardData;

    // Salvar dados do step atual antes de voltar
    if (submissionId) {
      if (currentStep === 2) {
        await supabase
          .from("wizard_submissions")
          .update({
            saas_category: currentData.saasCategory || null,
            saas_idea: currentData.saasIdea || null,
            industry: currentData.industry || null,
          })
          .eq("id", submissionId);
      } else if (currentStep === 3) {
        await supabase
          .from("wizard_submissions")
          .update({
            target_customers: currentData.targetCustomers?.length ? currentData.targetCustomers : null,
            market_size: currentData.marketSize || null,
            competitors: currentData.competitors?.length ? currentData.competitors : null,
            competitors_data: currentData.competitorsData?.length ? JSON.parse(JSON.stringify(currentData.competitorsData)) : null,
          })
          .eq("id", submissionId);
      } else if (currentStep === 4) {
        await supabase
          .from("wizard_submissions")
          .update({
            starter_features: currentData.starterFeatures?.length ? currentData.starterFeatures : null,
            growth_features: currentData.growthFeatures?.length ? currentData.growthFeatures : null,
            enterprise_features: currentData.enterpriseFeatures?.length ? currentData.enterpriseFeatures : null,
          })
          .eq("id", submissionId);
      } else if (currentStep === 5) {
        await supabase
          .from("wizard_submissions")
          .update({
            primary_goal: currentData.primaryGoal || null,
            launch_timeline: currentData.launchTimeline || null,
            budget_range: currentData.budgetRange || null,
          })
          .eq("id", submissionId);
      }
    }

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1LeadCapture
            data={wizardData}
            updateData={updateWizardData}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <Step2ProductDefinition
            data={wizardData}
            updateData={updateWizardData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 3:
        return (
          <Step3TargetAudience
            data={wizardData}
            updateData={updateWizardData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 4:
        return (
          <Step4Features
            data={wizardData}
            updateData={updateWizardData}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 5:
        return (
          <Step5Goals
            data={wizardData}
            updateData={updateWizardData}
            onPrev={handlePrevStep}
            submissionId={submissionId}
            existingReportId={existingReportId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <WizardProgress 
            currentStep={currentStep} 
            onStepClick={handleStepClick}
          />
          
          <div className="mt-8">
            {renderCurrentStep()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Planning;
