import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  BusinessPlanSection,
  OpportunitySection,
  GrowthIntelligenceSection,
  ICPIntelligenceSection,
  PriceIntelligenceSection,
} from "@/types/report";
import { CompetitiveAnalysisSectionData } from "@/lib/competitiveAnalysisUtils";

// All sections needed for the shared report (same as Dashboard)
export interface SharedReportData {
  saas_name: string;
  business_plan_section: BusinessPlanSection;
  opportunity_section: OpportunitySection | null;
  competitive_analysis_section: CompetitiveAnalysisSectionData | null;
  icp_intelligence_section: ICPIntelligenceSection | null;
  price_intelligence_section: PriceIntelligenceSection | null;
  growth_intelligence_section: GrowthIntelligenceSection | null;
  section_investment: Record<string, unknown> | null;
}

export const useSharedReport = (shareToken: string | undefined) => {
  return useQuery({
    queryKey: ["shared-report", shareToken],
    queryFn: async (): Promise<SharedReportData | null> => {
      if (!shareToken) return null;

      // Fetch ALL sections needed for the business plan (same as Dashboard)
      const { data: report, error } = await supabase
        .from("tb_pms_reports")
        .select(`
          business_plan_section,
          opportunity_section,
          competitive_analysis_section,
          icp_intelligence_section,
          price_intelligence_section,
          growth_intelligence_section,
          section_investment,
          wizard_id
        `)
        .eq("share_token", shareToken)
        .eq("share_enabled", true)
        .maybeSingle();

      if (error || !report) return null;

      // Cast business_plan_section to typed interface
      const bp = report.business_plan_section as unknown as BusinessPlanSection | null;
      
      // Validate: must have AI narratives (structured format)
      const hasContent = 
        bp?.ai_executive_narrative || 
        bp?.ai_strategic_verdict || 
        (bp?.ai_key_recommendations && bp.ai_key_recommendations.length > 0);

      if (!bp || !hasContent) return null;

      return {
        saas_name: bp.title || "SaaS Project",
        business_plan_section: bp,
        opportunity_section: report.opportunity_section as unknown as OpportunitySection | null,
        competitive_analysis_section: report.competitive_analysis_section as unknown as CompetitiveAnalysisSectionData | null,
        icp_intelligence_section: report.icp_intelligence_section as unknown as ICPIntelligenceSection | null,
        price_intelligence_section: report.price_intelligence_section as unknown as PriceIntelligenceSection | null,
        growth_intelligence_section: report.growth_intelligence_section as unknown as GrowthIntelligenceSection | null,
        section_investment: report.section_investment as Record<string, unknown> | null,
      };
    },
    enabled: !!shareToken,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 1, // Only retry once for invalid tokens
  });
};
