import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportRow } from "@/types/report";

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async (): Promise<ReportRow[]> => {
      const { data, error } = await supabase
        .from("tb_pms_wizard")
        .select(`
          *,
          tb_pms_reports!wizard_id (
            id,
            status,
            hero_score_section,
            summary_section,
            opportunity_section
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error);
        throw error;
      }

      return (data as ReportRow[]) || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from("tb_pms_wizard")
        .delete()
        .eq("id", reportId);

      if (error) {
        console.error("Error deleting report:", error);
        throw error;
      }

      return reportId;
    },
    onSuccess: () => {
      // Invalidate and refetch reports list
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

export default useReports;
