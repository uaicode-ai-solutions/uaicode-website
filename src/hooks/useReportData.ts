import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportData } from "@/types/report";

/**
 * Fetches report data from tb_pms_reports by wizard_id
 * 
 * @param wizardId - UUID from tb_pms_wizard (NOT tb_pms_reports.id)
 * @returns The most recent report data for this wizard
 */
export const useReportData = (wizardId: string | undefined) => {
  const query = useQuery({
    queryKey: ["pms-report-data", wizardId],
    queryFn: async (): Promise<ReportData | null> => {
      if (!wizardId) return null;

      const { data, error } = await supabase
        .from("tb_pms_reports")
        .select("*")
        .eq("wizard_id", wizardId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching report data:", error);
        throw error;
      }

      return data as ReportData | null;
    },
    enabled: !!wizardId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    // Poll every 5 seconds until status is terminal (success or failure)
    refetchInterval: (query) => {
      const data = query.state.data as ReportData | null;
      const status = data?.status;
      
      // Terminal statuses - stop polling
      const isTerminal = 
        status === "Created" || 
        status === "completed" || 
        status === "failed" || 
        status === "error" ||
        (status && status.toLowerCase().includes("fail"));
      
      if (isTerminal) {
        console.log("[useReportData] Terminal status reached:", status);
        return false;
      }
      
      // Continue polling: no data yet OR in-progress status
      console.log("[useReportData] Polling continues, current status:", status || "no record yet");
      return 5000;
    },
  });

  return query;
};

export default useReportData;
