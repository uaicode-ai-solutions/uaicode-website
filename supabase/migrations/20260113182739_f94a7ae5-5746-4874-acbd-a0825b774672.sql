-- Insert existing user that was created but trigger might have failed silently
INSERT INTO public.tb_pms_users (auth_user_id, email, username, full_name)
SELECT 
  id,
  email,
  split_part(email, '@', 1),
  COALESCE(
    raw_user_meta_data->>'full_name', 
    raw_user_meta_data->>'name',
    ''
  )
FROM auth.users
WHERE id = '2248c531-5d71-442f-afe2-723e1dacdcbc'
ON CONFLICT (auth_user_id) DO NOTHING;