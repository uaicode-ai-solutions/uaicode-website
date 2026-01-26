-- 1. Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'contributor');

-- 2. Criar tabela user_roles
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.tb_pms_users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Criar função get_pms_user_id (Security Definer)
CREATE OR REPLACE FUNCTION public.get_pms_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.tb_pms_users WHERE auth_user_id = auth.uid()
$$;

-- 5. Criar função has_role (Security Definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 6. Políticas RLS para user_roles
-- Admins podem ver todas as roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(public.get_pms_user_id(), 'admin'));

-- Admins podem inserir roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(public.get_pms_user_id(), 'admin'));

-- Admins podem deletar roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(public.get_pms_user_id(), 'admin'));

-- Admins podem atualizar roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(public.get_pms_user_id(), 'admin'));

-- 7. Nova policy para tb_pms_users (admins veem todos)
-- Primeiro, dropar a policy existente que só permite ver o próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON public.tb_pms_users;

-- Criar nova policy que permite ver próprio perfil OU se for admin
CREATE POLICY "Users can view own profile or admins can view all"
ON public.tb_pms_users
FOR SELECT
TO authenticated
USING (
  auth_user_id = auth.uid() 
  OR public.has_role(public.get_pms_user_id(), 'admin')
);

-- 8. Inserir role admin para rafaelluzoficial@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('23b2a785-13e0-492c-b3c2-950b042433c6', 'admin');