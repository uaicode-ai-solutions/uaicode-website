-- Garantir que o trigger está corretamente configurado na tabela auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Criar perfil para usuário existente (rafaelluzoficial@gmail.com) que não foi criado pelo trigger
INSERT INTO public.tb_pms_users (auth_user_id, email, full_name)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1))
FROM auth.users
WHERE email = 'rafaelluzoficial@gmail.com'
ON CONFLICT (auth_user_id) DO NOTHING;