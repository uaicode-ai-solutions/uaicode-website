-- 1. Adicionar coluna username na tabela tb_pms_users
ALTER TABLE public.tb_pms_users 
ADD COLUMN username text;

-- 2. Preencher username para usuários existentes (baseado no email)
UPDATE public.tb_pms_users 
SET username = split_part(email, '@', 1)
WHERE username IS NULL;

-- 3. Atualizar a trigger handle_new_user para separar username de full_name
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
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name',
      ''
    )
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;