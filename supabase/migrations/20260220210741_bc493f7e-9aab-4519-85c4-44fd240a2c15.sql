CREATE POLICY "hero_users_delete_admin"
ON public.tb_hero_users
FOR DELETE
USING (has_hero_role(get_hero_user_id(), 'admin'::hero_role));