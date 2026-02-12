-- Add client_role columns to tb_pms_wizard
ALTER TABLE public.tb_pms_wizard
  ADD COLUMN client_role text,
  ADD COLUMN client_role_other text;

-- Remove columns from tb_pms_users
ALTER TABLE public.tb_pms_users
  DROP COLUMN IF EXISTS phone,
  DROP COLUMN IF EXISTS linkedin_profile,
  DROP COLUMN IF EXISTS user_role,
  DROP COLUMN IF EXISTS user_role_other;

-- Update handle_new_user() trigger to remove username
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.tb_pms_users (auth_user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
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
  
  -- Assign default "user" role
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'user'::app_role
  FROM public.tb_pms_users
  WHERE auth_user_id = NEW.id
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$function$;