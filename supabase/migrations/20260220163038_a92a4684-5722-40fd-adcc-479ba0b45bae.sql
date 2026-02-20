
-- 1. Create hero_role enum
CREATE TYPE public.hero_role AS ENUM ('admin', 'contributor', 'viewer');

-- 2. Create tb_hero_users
CREATE TABLE public.tb_hero_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  avatar_url text,
  team text NOT NULL DEFAULT 'none',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tb_hero_users ENABLE ROW LEVEL SECURITY;

-- 3. Create tb_hero_roles
CREATE TABLE public.tb_hero_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.tb_hero_users(id) ON DELETE CASCADE,
  role hero_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.tb_hero_roles ENABLE ROW LEVEL SECURITY;

-- 4. Security definer functions
CREATE OR REPLACE FUNCTION public.get_hero_user_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.tb_hero_users
  WHERE auth_user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.has_hero_role(
  _user_id uuid, _role hero_role
)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tb_hero_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. RLS Policies for tb_hero_users
CREATE POLICY "hero_users_select_own_or_admin"
  ON public.tb_hero_users FOR SELECT
  USING (
    auth_user_id = auth.uid()
    OR has_hero_role(get_hero_user_id(), 'admin')
  );

CREATE POLICY "hero_users_update_own"
  ON public.tb_hero_users FOR UPDATE
  USING (auth_user_id = auth.uid());

-- 6. RLS Policies for tb_hero_roles
CREATE POLICY "hero_roles_select_own_or_admin"
  ON public.tb_hero_roles FOR SELECT
  USING (
    user_id = get_hero_user_id()
    OR has_hero_role(get_hero_user_id(), 'admin')
  );

CREATE POLICY "hero_roles_insert_admin"
  ON public.tb_hero_roles FOR INSERT
  WITH CHECK (has_hero_role(get_hero_user_id(), 'admin'));

CREATE POLICY "hero_roles_delete_admin"
  ON public.tb_hero_roles FOR DELETE
  USING (has_hero_role(get_hero_user_id(), 'admin'));

-- 7. Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_tb_hero_users_updated_at()
RETURNS trigger LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER set_hero_users_updated_at
  BEFORE UPDATE ON public.tb_hero_users
  FOR EACH ROW EXECUTE FUNCTION update_tb_hero_users_updated_at();
