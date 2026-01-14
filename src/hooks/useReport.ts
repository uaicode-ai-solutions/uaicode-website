import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportRow } from "@/types/report";

export const useReport = (reportId: string | undefined) => {
  const query = useQuery({
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
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    // Poll every 5 seconds if status is pending
    refetchInterval: (query) => {
      const data = query.state.data as ReportRow | null;
      return data?.status === "pending" ? 5000 : false;
    },
  });

  return query;
};

export default useReport;
