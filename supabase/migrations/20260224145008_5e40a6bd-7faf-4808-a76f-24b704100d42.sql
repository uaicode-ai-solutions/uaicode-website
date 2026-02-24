-- Allow Hero users to read wizard data (for admin overview)
CREATE POLICY "hero_users_can_view_wizards"
  ON public.tb_pms_wizard
  FOR SELECT
  TO authenticated
  USING (get_hero_user_id() IS NOT NULL);

-- Allow Hero users to read reports (for admin overview)
CREATE POLICY "hero_users_can_view_reports"
  ON public.tb_pms_reports
  FOR SELECT
  TO authenticated
  USING (get_hero_user_id() IS NOT NULL);