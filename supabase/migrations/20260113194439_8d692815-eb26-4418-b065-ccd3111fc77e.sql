-- Update handle_new_user function to better handle OAuth metadata (Google uses 'name' instead of 'full_name')
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
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
  
  RETURN NEW;
END;
$$;

-- Update existing user's full_name if it's empty
UPDATE public.tb_pms_users
SET full_name = 'Rafael Luz'
WHERE auth_user_id = '2248c531-5d71-442f-afe2-723e1dacdcbc'
  AND (full_name = '' OR full_name IS NULL);