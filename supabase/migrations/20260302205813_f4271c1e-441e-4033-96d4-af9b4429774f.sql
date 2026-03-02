DROP TRIGGER IF EXISTS trg_pms_report_auto_finalize ON public.tb_pms_reports;
DROP FUNCTION IF EXISTS public.notify_pms_report_finalize();