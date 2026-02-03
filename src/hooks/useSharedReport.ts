import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

/**
 * Shape of data returned by useSharedReport
 */
export interface SharedReportData {
  id: string;
  wizard_id: string;
  status: string;
  business_plan_section: Json | null;
  opportunity_section: Json | null;
  competitive_analysis_section: Json | null;
  icp_intelligence_section: Json | null;
  price_intelligence_section: Json | null;
  growth_intelligence_section: Json | null;
  section_investment: Json | null;
  hero_score_section: Json | null;
  icp_avatar_url: string | null;
  wizard_snapshot: Json | null;
  marketing_snapshot: Json | null;
}

/**
 * Hook to fetch complete report data for a shared report.
 * Returns all JSONB sections needed to render BusinessPlanTab.
 */
export const useSharedReport = (shareToken: string | undefined) => {
  return useQuery({
    queryKey: ["shared-report", shareToken],
    queryFn: async (): Promise<SharedReportData | null> => {
      if (!shareToken) return null;

      // Fetch all JSONB sections needed for BusinessPlanTab
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
        .eq("share_token", shareToken)
        .eq("share_enabled", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching shared report:", error);
        throw error;
      }

      return data as SharedReportData | null;
    },
    enabled: !!shareToken,
    staleTime: 1000 * 60 * 10, // 10 minutes cache - static content
    retry: 1, // Only retry once for invalid tokens
  });
};
