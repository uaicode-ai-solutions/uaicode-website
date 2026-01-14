import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportRow } from "@/types/report";

export const useReport = (reportId: string | undefined) => {
  return useQuery({
    queryKey: ["report", reportId],
    queryFn: async (): Promise<ReportRow | null> => {
      if (!reportId) return null;

      const { data, error } = await supabase
        .from("tb_pms_reports")
        .select("*")
        .eq("id", reportId)
        .single();

      if (error) {
        console.error("Error fetching report:", error);
        throw error;
      }

      return data;
    },
    enabled: !!reportId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
  });
};

export default useReport;
