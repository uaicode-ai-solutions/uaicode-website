import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPlanSection } from "@/types/report";

interface SharedReportData {
  saas_name: string;
  business_plan_section: BusinessPlanSection;
}

export const useSharedReport = (shareToken: string | undefined) => {
  return useQuery({
    queryKey: ["shared-report", shareToken],
    queryFn: async (): Promise<SharedReportData | null> => {
      if (!shareToken) return null;

      // Fetch report by share_token (RLS allows anon if share_enabled=true)
      const { data: report, error } = await supabase
        .from("tb_pms_reports")
        .select("business_plan_section, wizard_id")
        .eq("share_token", shareToken)
        .eq("share_enabled", true)
        .maybeSingle();

      if (error || !report) return null;

      // Cast business_plan_section to typed interface (unknown first for safety)
      const bp = report.business_plan_section as unknown as BusinessPlanSection | null;
      
      if (!bp || !bp.markdown_content) return null;

      return {
        saas_name: bp.title || "SaaS Project",
        business_plan_section: bp,
      };
    },
    enabled: !!shareToken,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 1, // Only retry once for invalid tokens
  });
};
