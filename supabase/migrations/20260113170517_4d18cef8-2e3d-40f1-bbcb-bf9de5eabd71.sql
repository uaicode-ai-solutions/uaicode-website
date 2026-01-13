-- =====================================================
-- PART 1: Rename tables from tb_pln_* to tb_pms_*
-- =====================================================

-- Rename tables
ALTER TABLE public.tb_pln_users RENAME TO tb_pms_users;
ALTER TABLE public.tb_pln_reports RENAME TO tb_pms_reports;
ALTER TABLE public.tb_pln_payments RENAME TO tb_pms_payments;

-- =====================================================
-- PART 2: Rename existing functions and recreate triggers
-- =====================================================

-- Drop existing triggers first (they reference old table names)
DROP TRIGGER IF EXISTS trigger_update_tb_pln_users_updated_at ON public.tb_pms_users;
DROP TRIGGER IF EXISTS trigger_update_tb_pln_reports_updated_at ON public.tb_pms_reports;

-- Rename functions
ALTER FUNCTION public.update_tb_pln_users_updated_at() RENAME TO update_tb_pms_users_updated_at;
ALTER FUNCTION public.update_tb_pln_reports_updated_at() RENAME TO update_tb_pms_reports_updated_at;

-- Recreate triggers with new names on renamed tables
CREATE TRIGGER trigger_update_tb_pms_users_updated_at
  BEFORE UPDATE ON public.tb_pms_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tb_pms_users_updated_at();

CREATE TRIGGER trigger_update_tb_pms_reports_updated_at
  BEFORE UPDATE ON public.tb_pms_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tb_pms_reports_updated_at();

-- =====================================================
-- PART 3: Add UNIQUE constraint on auth_user_id (needed for ON CONFLICT)
-- =====================================================

ALTER TABLE public.tb_pms_users 
ADD CONSTRAINT tb_pms_users_auth_user_id_unique UNIQUE (auth_user_id);

-- =====================================================
-- PART 4: Create auto-profile trigger (fixes RLS error on signup)
-- =====================================================

-- Function that creates profile automatically when user is created in auth.users
-- Uses SECURITY DEFINER to bypass RLS policies
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.tb_pms_users (auth_user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name', 
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger on auth.users to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();