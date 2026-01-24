import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReportRow } from "@/types/report";

/**
 * NOMENCLATURA PADRÃO:
 * 
 * wizardId - UUID do registro em tb_pms_wizard (PK)
 *            É o ID usado na URL: /dashboard/:wizardId
 *            Representa a submissão do formulário do usuário
 * 
 * pmsReportId - UUID do registro em tb_pms_reports (PK)
 *               FK: tb_pms_reports.wizard_id -> tb_pms_wizard.id
 *               Representa o relatório gerado pelo n8n
 */
export const useReport = (wizardId: string | undefined) => {
  const query = useQuery({
    queryKey: ["wizard", wizardId],
    queryFn: async (): Promise<ReportRow | null> => {
      if (!wizardId) return null;

      const { data, error } = await supabase
        .from("tb_pms_wizard")
        .select("*")
        .eq("id", wizardId)
        .single();

      if (error) {
        console.error("Error fetching wizard:", error);
        throw error;
      }

      return data;
    },
    enabled: !!wizardId,
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
