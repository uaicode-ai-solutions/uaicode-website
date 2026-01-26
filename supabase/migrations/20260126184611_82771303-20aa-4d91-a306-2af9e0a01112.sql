-- Atualizar a função handle_new_user para também criar a role "user"
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- ====== CÓDIGO EXISTENTE (INALTERADO) ======
  INSERT INTO public.tb_pms_users (auth_user_id, email, username, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    split_part(NEW.email, '@', 1),
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
      NULLIF(TRIM(CONCAT(
        NEW.raw_user_meta_data->>'given_name',
        ' ',
        COALESCE(NEW.raw_user_meta_data->>'family_name', '')
      )), ''),
      ''
    )
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    full_name = CASE 
      WHEN tb_pms_users.full_name = '' OR tb_pms_users.full_name IS NULL 
      THEN EXCLUDED.full_name 
      ELSE tb_pms_users.full_name 
    END;
  
  -- ====== ÚNICA ADIÇÃO: Atribuir role "user" ======
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'user'::app_role
  FROM public.tb_pms_users
  WHERE auth_user_id = NEW.id
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;