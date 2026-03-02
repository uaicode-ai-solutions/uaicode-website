import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SharedReportData } from "@/hooks/useSharedReport";

/**
 * Hook to fetch report data by report ID for hero users.
 * Hero users have RLS SELECT access to tb_pms_reports.
 */
export const useHeroReportPreview = (reportId: string | undefined) => {
  return useQuery({
    queryKey: ["hero-report-preview", reportId],
    queryFn: async (): Promise<SharedReportData | null> => {
      if (!reportId) return null;

      const { data, error } = await supabase
        .from("tb_pms_reports")
        .select(`
          id,
          wizard_id,
          status,
          business_plan_section,
          opportunity_section,
          competitive_analysis_section,
          icp_intelligence_section,
          price_intelligence_section,
          growth_intelligence_section,
          section_investment,
          hero_score_section,
          icp_avatar_url,
          wizard_snapshot,
          marketing_snapshot
        `)
        .eq("id", reportId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching hero report preview:", error);
        throw error;
      }

      // If wizard_snapshot is missing, fetch from tb_pms_lp_wizard
      if (data && !data.wizard_snapshot) {
        const { data: lpWizard } = await supabase
          .from("tb_pms_lp_wizard")
          .select("*")
          .eq("id", data.wizard_id)
          .maybeSingle();

        if (lpWizard) {
          return {
            ...data,
            wizard_snapshot: lpWizard as unknown as SharedReportData["wizard_snapshot"],
          } as SharedReportData;
        }
      }

      return data as SharedReportData | null;
    },
    enabled: !!reportId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
