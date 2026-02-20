CREATE POLICY "hero_users_insert_admin"
  ON public.tb_hero_users FOR INSERT
  WITH CHECK (has_hero_role(get_hero_user_id(), 'admin'::hero_role));