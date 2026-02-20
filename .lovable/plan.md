

# Uaicode Hero Ecosystem -- Plano de Implementacao (Atualizado)

Sistema interno corporativo para funcionarios e colaboradores da Uaicode, com autenticacao real via Supabase e conteudo mock para visualizacao.

---

## Arquitetura de Rotas

```text
/hero                -> Login Page (auth real via Supabase)
/hero/home           -> Home Portal (protegida)
/hero/dash           -> Dashboard com sidebar (protegida, filtrada por team)
  #admin             -> Subsistema Admin
  #marketing         -> Subsistema Marketing
  #sales             -> Subsistema Sales
```

---

## 1. Autenticacao e Controle de Acesso

O Hero Ecosystem usa tabelas **proprias e independentes** do PMS. O login reutiliza o Supabase Auth (mesma instancia), mas o perfil e as roles sao armazenados em tabelas dedicadas.

### 1.1 Novas Tabelas

**`tb_hero_users`** -- perfil do funcionario no Hero Ecosystem:

```sql
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
```

A coluna `team` indica o time principal do funcionario: `admin`, `marketing`, `sales`, ou `none`. Ela determina quais subsistemas o usuario pode acessar no dashboard.

**Enum `hero_role`:**

```sql
CREATE TYPE public.hero_role AS ENUM ('admin', 'contributor', 'viewer');
```

- `admin`: acesso total a todos os subsistemas
- `contributor`: acesso de leitura e escrita ao seu time
- `viewer`: acesso somente leitura

**`tb_hero_roles`** -- roles do funcionario (tabela separada, como exigido por seguranca):

```sql
CREATE TABLE public.tb_hero_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.tb_hero_users(id) ON DELETE CASCADE,
  role hero_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.tb_hero_roles ENABLE ROW LEVEL SECURITY;
```

### 1.2 Funcao Security Definer

```sql
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
```

### 1.3 RLS Policies

**tb_hero_users:**
- SELECT: usuario ve seu proprio perfil OU admins veem todos
- UPDATE: usuario atualiza apenas seu proprio perfil

```sql
CREATE POLICY "hero_users_select_own_or_admin"
  ON public.tb_hero_users FOR SELECT
  USING (
    auth_user_id = auth.uid()
    OR has_hero_role(get_hero_user_id(), 'admin')
  );

CREATE POLICY "hero_users_update_own"
  ON public.tb_hero_users FOR UPDATE
  USING (auth_user_id = auth.uid());
```

**tb_hero_roles:**
- SELECT: admins veem todas as roles
- INSERT/UPDATE/DELETE: apenas admins

```sql
CREATE POLICY "hero_roles_select_admin"
  ON public.tb_hero_roles FOR SELECT
  USING (has_hero_role(get_hero_user_id(), 'admin'));

CREATE POLICY "hero_roles_insert_admin"
  ON public.tb_hero_roles FOR INSERT
  WITH CHECK (has_hero_role(get_hero_user_id(), 'admin'));

CREATE POLICY "hero_roles_delete_admin"
  ON public.tb_hero_roles FOR DELETE
  USING (has_hero_role(get_hero_user_id(), 'admin'));
```

### 1.4 Trigger updated_at

```sql
CREATE OR REPLACE FUNCTION public.update_tb_hero_users_updated_at()
RETURNS trigger LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER set_hero_users_updated_at
  BEFORE UPDATE ON public.tb_hero_users
  FOR EACH ROW EXECUTE FUNCTION update_tb_hero_users_updated_at();
```

### 1.5 Seed dos Admins

Apos criar as tabelas, inserir os dois admins manualmente (via SQL Editor):

```sql
-- Inserir perfis hero para os dois admins existentes
INSERT INTO public.tb_hero_users (auth_user_id, email, full_name, team)
SELECT auth_user_id, email, full_name, 'admin'
FROM public.tb_pms_users
WHERE email IN ('rafael.luz@uaicode.ai', 'rafaelluzoficial@gmail.com')
ON CONFLICT (auth_user_id) DO NOTHING;

-- Atribuir role admin
INSERT INTO public.tb_hero_roles (user_id, role)
SELECT id, 'admin'::hero_role
FROM public.tb_hero_users
WHERE email IN ('rafael.luz@uaicode.ai', 'rafaelluzoficial@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
```

### 1.6 Hook `useHeroAuth`

Um hook dedicado (`src/hooks/useHeroAuth.ts`) que:
1. Usa `useAuthContext()` para obter o Supabase user autenticado
2. Busca o perfil em `tb_hero_users` (nao em `tb_pms_users`)
3. Busca as roles em `tb_hero_roles` (nao em `user_roles`)
4. Expoe: `heroUser`, `heroRoles`, `isHeroAdmin`, `heroTeam`, `canAccessSubsystem(team)`
5. Se o usuario autenticado nao existir em `tb_hero_users`, redireciona para uma tela de "acesso nao autorizado"

### 1.7 Fluxo de Login

1. Usuario acessa `/hero` e faz login com email/senha via Supabase Auth
2. Apos autenticacao, o hook busca `tb_hero_users` pelo `auth_user_id`
3. Se nao encontrado -> tela "Voce nao tem acesso ao Hero Ecosystem"
4. Se encontrado -> busca roles em `tb_hero_roles` e redireciona para `/hero/home`
5. No dashboard, a sidebar mostra apenas os subsistemas que o team/role permite

---

## 2. Design Visual

Inspirado em Apple Liquid Glass + Glassmorphism, usando **exclusivamente** a paleta UaiCode:

- **Fundo:** Pure Black `#000000` com mesh gradient sutil em gold
- **Cards:** Glass effect -- `rgba(34, 39, 42, 0.4)` com `backdrop-filter: blur(20px)` e borda `rgba(255, 255, 255, 0.08)`
- **Accents:** Amber Gold `#EAAB08` para CTAs, highlights e icones ativos
- **Texto:** White `#FFFFFF` primario, `hsl(0, 0%, 70%)` para secundario
- **Sidebar:** Glass escuro com items hover em gold/amber
- **Efeitos:** Hover lift, glow-card, text-gradient-gold nos titulos
- **Fonte:** Inter (principal), JetBrains Mono (metricas/codigo)

---

## 3. Paginas e Componentes

### 3.1 Login Page (`/hero`)

- Layout split-screen (imagem/form) similar ao PmsLogin mas com branding Hero Ecosystem
- Logo UaiCode + titulo "Hero Ecosystem"
- Login por email/senha (reutiliza Supabase Auth, mas verifica `tb_hero_users`)
- Sem opcao de signup (apenas usuarios pre-cadastrados)
- Sem Google OAuth (acesso restrito)
- Apos login, redireciona para `/hero/home`

### 3.2 Home Portal (`/hero/home`)

Portal corporativo estilo news/dashboard com:

- **Header:** Logo UaiCode + "Hero Ecosystem" + avatar do usuario + dropdown (perfil, logout)
- **Hero Banner:** Mensagem de boas-vindas personalizada com nome do usuario + hora do dia
- **Cards de Subsistemas:** 3 cards grandes (Admin, Marketing, Sales) com icone, descricao e status de acesso (habilitado/bloqueado baseado nas roles). Click abre `/hero/dash#admin`, etc.
- **Secao de Noticias (mock):** Grid de cards com conteudo educativo sobre cultura UaiCode (valores, missao, updates)
- **Quick Stats (mock):** Metricas do ecossistema (total de usuarios, reports gerados, leads, etc.)
- **Links Uteis (mock):** Acesso rapido a recursos internos

### 3.3 Dashboard (`/hero/dash`)

Sistema com sidebar lateral e area de conteudo principal:

- **Sidebar:** Menu lateral colapsavel (usa componente Sidebar do shadcn)
  - Items filtrados pela role/team do usuario
  - Secoes agrupadas por subsistema (Admin, Marketing, Sales)
  - Icones e labels, com highlight do item ativo
  - Botao de collapse para mini-sidebar

- **Admin Section (mock):**
  - Overview Dashboard (stats gerais)
  - User Management (lista de usuarios mockada)
  - System Settings (configuracoes mockadas)
  - Activity Logs (logs mockados)

- **Marketing Section (mock):**
  - Content Calendar (calendario mockado)
  - Social Media Dashboard (metricas mockadas)
  - Campaign Manager (campanhas mockadas)
  - Brand Assets (link para branding book)

- **Sales Section (mock):**
  - Pipeline Dashboard (funil mockado)
  - Lead Management (leads mockados)
  - Reports & Analytics (graficos mockados)
  - CRM Overview (dados mockados)

---

## 4. Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/pages/hero/HeroLogin.tsx` | Pagina de login do Hero Ecosystem |
| `src/pages/hero/HeroHome.tsx` | Portal corporativo / home page |
| `src/pages/hero/HeroDash.tsx` | Dashboard com sidebar e subsistemas |
| `src/components/hero/HeroRoute.tsx` | Guard de rota (requer auth + tb_hero_users) |
| `src/components/hero/HeroSidebar.tsx` | Sidebar lateral do dashboard |
| `src/components/hero/HeroHeader.tsx` | Header compartilhado (home + dash) |
| `src/components/hero/mock/AdminOverview.tsx` | Conteudo mock do Admin |
| `src/components/hero/mock/MarketingOverview.tsx` | Conteudo mock do Marketing |
| `src/components/hero/mock/SalesOverview.tsx` | Conteudo mock do Sales |
| `src/hooks/useHeroAuth.ts` | Hook que busca tb_hero_users + tb_hero_roles |

## 5. Arquivo a Modificar

| Arquivo | Mudanca |
|---------|---------|
| `src/App.tsx` | Adicionar rotas `/hero`, `/hero/home`, `/hero/dash` |

---

## 6. Dados Mock

Todos os dashboards e conteudos de noticias usarao dados hardcoded diretamente nos componentes. Nenhuma tabela adicional sera criada alem de `tb_hero_users` e `tb_hero_roles`. A unica interacao com backend e o login via Supabase Auth + leitura de `tb_hero_users` e `tb_hero_roles`.

---

## 7. Alteracoes no Backend

| Tipo | Detalhe |
|------|---------|
| Migration SQL | Criar enum `hero_role`, tabelas `tb_hero_users` e `tb_hero_roles`, funcoes `get_hero_user_id()` e `has_hero_role()`, RLS policies, trigger updated_at |
| Seed SQL | Inserir os 2 admins (`rafaelluzoficial@gmail.com` + `rafael.luz@uaicode.ai` se existir) |
| Edge Functions | Nenhuma |

