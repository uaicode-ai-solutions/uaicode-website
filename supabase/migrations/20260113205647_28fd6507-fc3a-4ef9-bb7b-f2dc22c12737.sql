-- Create trigger on auth.users to automatically create profile in tb_pms_users
-- This is essential for the app to work correctly

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();