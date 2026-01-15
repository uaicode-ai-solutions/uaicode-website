-- 1. Remover triggers existentes
DROP TRIGGER IF EXISTS on_pms_report_created ON public.tb_pms_reports;
DROP TRIGGER IF EXISTS trigger_update_tb_pms_reports_updated_at ON public.tb_pms_reports;

-- 2. Renomear tabela
ALTER TABLE public.tb_pms_reports RENAME TO tb_pms_wizard;

-- 3. Renomear função de updated_at
ALTER FUNCTION public.update_tb_pms_reports_updated_at() RENAME TO update_tb_pms_wizard_updated_at;

-- 4. Recriar trigger de updated_at
CREATE TRIGGER trigger_update_tb_pms_wizard_updated_at
  BEFORE UPDATE ON public.tb_pms_wizard
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tb_pms_wizard_updated_at();

-- 5. Atualizar função do webhook para usar nova tabela
CREATE OR REPLACE FUNCTION public.notify_pms_wizard_created_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-webhook-new-report',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg'
    ),
    body := jsonb_build_object('wizard_id', NEW.id::text)
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to call webhook: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- 6. Dropar função antiga do webhook
DROP FUNCTION IF EXISTS public.notify_pms_report_created_webhook();

-- 7. Criar novo trigger na tabela renomeada
CREATE TRIGGER on_pms_wizard_created
  AFTER INSERT ON public.tb_pms_wizard
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_pms_wizard_created_webhook();

-- 8. Remover colunas geradas pela AI
ALTER TABLE tb_pms_wizard 
  DROP COLUMN IF EXISTS viability_score,
  DROP COLUMN IF EXISTS complexity_score,
  DROP COLUMN IF EXISTS timing_score,
  DROP COLUMN IF EXISTS risk_score,
  DROP COLUMN IF EXISTS differentiation_score,
  DROP COLUMN IF EXISTS pivot_readiness_score,
  DROP COLUMN IF EXISTS opportunity_score,
  DROP COLUMN IF EXISTS first_mover_score,
  DROP COLUMN IF EXISTS verdict,
  DROP COLUMN IF EXISTS verdict_headline,
  DROP COLUMN IF EXISTS verdict_summary,
  DROP COLUMN IF EXISTS investment_total_cents,
  DROP COLUMN IF EXISTS break_even_months,
  DROP COLUMN IF EXISTS expected_roi_year1,
  DROP COLUMN IF EXISTS mrr_month12_cents,
  DROP COLUMN IF EXISTS arr_projected_cents,
  DROP COLUMN IF EXISTS ltv_cac_ratio,
  DROP COLUMN IF EXISTS generated_at,
  DROP COLUMN IF EXISTS report_content,
  DROP COLUMN IF EXISTS key_metrics,
  DROP COLUMN IF EXISTS highlights,
  DROP COLUMN IF EXISTS risks,
  DROP COLUMN IF EXISTS market_opportunity,
  DROP COLUMN IF EXISTS competitors,
  DROP COLUMN IF EXISTS competitive_advantages,
  DROP COLUMN IF EXISTS investment_breakdown,
  DROP COLUMN IF EXISTS investment_included,
  DROP COLUMN IF EXISTS investment_not_included,
  DROP COLUMN IF EXISTS investment_comparison,
  DROP COLUMN IF EXISTS unit_economics,
  DROP COLUMN IF EXISTS financial_scenarios,
  DROP COLUMN IF EXISTS projection_data,
  DROP COLUMN IF EXISTS execution_timeline,
  DROP COLUMN IF EXISTS tech_stack,
  DROP COLUMN IF EXISTS demand_validation,
  DROP COLUMN IF EXISTS business_model,
  DROP COLUMN IF EXISTS go_to_market_preview,
  DROP COLUMN IF EXISTS quantified_differentiation,
  DROP COLUMN IF EXISTS timing_analysis,
  DROP COLUMN IF EXISTS pivot_scenarios,
  DROP COLUMN IF EXISTS success_metrics,
  DROP COLUMN IF EXISTS resource_requirements,
  DROP COLUMN IF EXISTS risk_quantification,
  DROP COLUMN IF EXISTS market_benchmarks,
  DROP COLUMN IF EXISTS uaicode_info,
  DROP COLUMN IF EXISTS next_steps,
  DROP COLUMN IF EXISTS marketing_four_ps,
  DROP COLUMN IF EXISTS marketing_paid_media_diagnosis,
  DROP COLUMN IF EXISTS marketing_paid_media_action_plan,
  DROP COLUMN IF EXISTS marketing_pricing_diagnosis,
  DROP COLUMN IF EXISTS marketing_pricing_action_plan,
  DROP COLUMN IF EXISTS marketing_growth_strategy,
  DROP COLUMN IF EXISTS marketing_competitive_advantages,
  DROP COLUMN IF EXISTS marketing_verdict,
  DROP COLUMN IF EXISTS assets_screen_mockups,
  DROP COLUMN IF EXISTS assets_brand_copy,
  DROP COLUMN IF EXISTS assets_brand_identity,
  DROP COLUMN IF EXISTS assets_logos,
  DROP COLUMN IF EXISTS assets_landing_page,
  DROP COLUMN IF EXISTS assets_mockup_previews;

-- 9. Atualizar RLS policies com novo nome
DROP POLICY IF EXISTS "Users can delete own reports" ON tb_pms_wizard;
DROP POLICY IF EXISTS "Users can insert own reports" ON tb_pms_wizard;
DROP POLICY IF EXISTS "Users can update own reports" ON tb_pms_wizard;
DROP POLICY IF EXISTS "Users can view own reports" ON tb_pms_wizard;

CREATE POLICY "Users can delete own wizard" ON tb_pms_wizard
  FOR DELETE USING (user_id IN (
    SELECT id FROM tb_pms_users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own wizard" ON tb_pms_wizard
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM tb_pms_users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can update own wizard" ON tb_pms_wizard
  FOR UPDATE USING (user_id IN (
    SELECT id FROM tb_pms_users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can view own wizard" ON tb_pms_wizard
  FOR SELECT USING (user_id IN (
    SELECT id FROM tb_pms_users WHERE auth_user_id = auth.uid()
  ));