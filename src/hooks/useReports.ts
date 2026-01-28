import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportRow, NestedReportData } from "@/types/report";

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async (): Promise<ReportRow[]> => {
      // Fetch wizard data
      const { data: wizardData, error: wizardError } = await supabase
        .from("tb_pms_wizard")
        .select("*")
        .order("created_at", { ascending: false });

      if (wizardError) {
        console.error("Error fetching wizard data:", wizardError);
        throw wizardError;
      }

      if (!wizardData || wizardData.length === 0) {
        return [];
      }

      // Get wizard IDs to fetch corresponding reports
      const wizardIds = wizardData.map(w => w.id);

      // Fetch reports for these wizards - include created_at to find most recent
      const { data: reportsData, error: reportsError } = await supabase
        .from("tb_pms_reports")
        .select("id, wizard_id, status, hero_score_section, summary_section, opportunity_section, created_at")
        .in("wizard_id", wizardIds)
        .order("created_at", { ascending: false });

      if (reportsError) {
        console.error("Error fetching reports data:", reportsError);
        // Continue without reports data - cards will show 0 score
      }

      // Create a map of wizard_id -> most recent report data
      const reportsMap = new Map<string, NestedReportData>();
      if (reportsData) {
        for (const report of reportsData) {
          // Only set if not already present (first one is most recent due to order by)
          if (!reportsMap.has(report.wizard_id)) {
            reportsMap.set(report.wizard_id, {
              id: report.id,
              status: report.status,
              hero_score_section: report.hero_score_section as NestedReportData["hero_score_section"],
              summary_section: report.summary_section as NestedReportData["summary_section"],
              opportunity_section: report.opportunity_section as NestedReportData["opportunity_section"],
            });
          }
        }
      }

      // Merge wizard data with reports - only include completed reports
      const mergedData: ReportRow[] = wizardData
        .filter(wizard => {
          const report = reportsMap.get(wizard.id);
          // Only include if report exists and has status "completed"
          return report && report.status?.trim().toLowerCase() === "completed";
        })
        .map(wizard => ({
          ...wizard,
          tb_pms_reports: [reportsMap.get(wizard.id)!],
        }));

      return mergedData;
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
