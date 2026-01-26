
# Plano: Criar Tela de Admin com Gerenciamento de Usuários e Roles

## Resumo

Criar uma página de administração seguindo o estilo visual da UaiCode (glass-premium, aurora-bg, accent colors) que permita gerenciar usuários e suas roles. O backend será implementado seguindo as melhores práticas de segurança do Supabase com uma tabela separada para roles.

---

## 1. Estrutura do Banco de Dados

### 1.1 Criar Enum para Roles

```sql
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'contributor');
```

### 1.2 Criar Tabela `user_roles`

```sql
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.tb_pms_users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

### 1.3 Criar Função `has_role` (Security Definer)

```sql
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
```

### 1.4 Criar Função para Buscar user_id pelo auth_user_id

```sql
CREATE OR REPLACE FUNCTION public.get_pms_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.tb_pms_users WHERE auth_user_id = auth.uid()
$$;
```

### 1.5 Políticas RLS para `user_roles`

```sql
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
```

### 1.6 Permitir Admins Lerem Todos os Usuários

```sql
-- Nova policy para tb_pms_users (admins veem todos)
CREATE POLICY "Admins can view all users"
ON public.tb_pms_users
FOR SELECT
TO authenticated
USING (
  auth_user_id = auth.uid() 
  OR public.has_role(public.get_pms_user_id(), 'admin')
);
```

### 1.7 Atribuir Role Admin ao Usuário

```sql
-- Inserir role admin para rafaelluzoficial@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('23b2a785-13e0-492c-b3c2-950b042433c6', 'admin');
```

---

## 2. Arquivos Frontend

### 2.1 Novo Arquivo: `src/pages/PmsAdmin.tsx`

Página de administração com:

- Header premium igual às outras páginas (glass-premium, logo, botão voltar)
- Hero section com título "Admin Panel"
- Card "Manage Users & Roles" com tabela de usuários
- Dropdown para adicionar/remover roles de cada usuário
- Visual consistente com UaiCode (cores gold/accent, dark theme)

**Estrutura do componente:**

```tsx
const PmsAdmin = () => {
  // States para usuários e roles
  // Fetch de todos os usuários (via RLS - só admins conseguem)
  // Fetch de todas as roles
  // Funções para adicionar/remover roles
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Aurora Background */}
      {/* Header Premium (igual PmsProfile) */}
      {/* Content */}
      <main className="relative max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Hero */}
        {/* Users Table Card */}
      </main>
    </div>
  );
};
```

### 2.2 Atualizar: `src/App.tsx`

Adicionar rota protegida para `/planningmysaas/admin`:

```tsx
<Route path="/planningmysaas/admin" element={
  <ProtectedRoute><PmsAdmin /></ProtectedRoute>
} />
```

### 2.3 Novo Arquivo: `src/hooks/useUserRoles.ts`

Hook para gerenciar roles:

```typescript
export const useUserRoles = () => {
  // Query para buscar todas as roles do usuário atual
  // Mutation para adicionar role
  // Mutation para remover role
  // Função para verificar se é admin
};
```

### 2.4 Novo Arquivo: `src/hooks/useAdminUsers.ts`

Hook para buscar todos os usuários (só funciona para admins):

```typescript
export const useAdminUsers = () => {
  // Query para buscar todos os usuários + suas roles
  // Mutation para toggle role
};
```

### 2.5 Atualizar: `src/integrations/supabase/types.ts`

**Nota:** Este arquivo é gerado automaticamente pelo Supabase. Após criar as tabelas, os tipos serão atualizados automaticamente.

### 2.6 Atualizar: `src/contexts/AuthContext.tsx` e `src/hooks/useAuth.ts`

Adicionar verificação de roles:

```typescript
// Adicionar ao retorno do useAuth
const userRoles = await fetchUserRoles(user.id);
const isAdmin = userRoles.includes('admin');
```

### 2.7 Novo Componente: `src/components/admin/AdminRoute.tsx`

Componente de proteção extra que verifica se o usuário é admin:

```tsx
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuthContext();
  
  if (loading) return <LoadingSkeleton />;
  if (!isAdmin) return <Navigate to="/planningmysaas/reports" />;
  
  return <>{children}</>;
};
```

### 2.8 Atualizar: `src/pages/PmsReports.tsx`

Adicionar link para Admin no dropdown do usuário (apenas para admins):

```tsx
{isAdmin && (
  <>
    <DropdownMenuItem onClick={() => navigate("/planningmysaas/admin")}>
      <Shield className="h-4 w-4 mr-2" />
      Admin Panel
    </DropdownMenuItem>
    <DropdownMenuSeparator />
  </>
)}
```

---

## 3. Diagrama de Fluxo

```text
┌─────────────────┐      ┌─────────────────┐
│   auth.users    │      │  tb_pms_users   │
│   (Supabase)    │──────│   (profiles)    │
└─────────────────┘      └────────┬────────┘
                                  │
                                  │ user_id
                                  ▼
                         ┌─────────────────┐
                         │   user_roles    │
                         │ (user, admin,   │
                         │  contributor)   │
                         └─────────────────┘
                                  │
                                  │ RLS policies
                                  ▼
                         ┌─────────────────┐
                         │  has_role()     │
                         │ Security Definer│
                         └─────────────────┘
```

---

## 4. Resumo dos Arquivos

| Tipo | Arquivo | Ação |
|------|---------|------|
| DB | Migration | Criar enum, tabela, funções e policies |
| DB | Data | Inserir role admin para o usuário |
| Frontend | `src/pages/PmsAdmin.tsx` | Criar página de admin |
| Frontend | `src/hooks/useUserRoles.ts` | Criar hook de roles |
| Frontend | `src/hooks/useAdminUsers.ts` | Criar hook de usuários (admin) |
| Frontend | `src/components/admin/AdminRoute.tsx` | Criar proteção de rota admin |
| Frontend | `src/contexts/AuthContext.tsx` | Adicionar isAdmin e userRoles |
| Frontend | `src/hooks/useAuth.ts` | Adicionar fetch de roles |
| Frontend | `src/App.tsx` | Adicionar rota /admin |
| Frontend | `src/pages/PmsReports.tsx` | Adicionar link Admin Panel |

---

## 5. Resultado Esperado

1. Tabela `user_roles` criada com enum `app_role`
2. Funções `has_role` e `get_pms_user_id` para verificação segura
3. Políticas RLS que só permitem admins ver/editar roles
4. Usuário `rafaelluzoficial@gmail.com` com role `admin`
5. Página `/planningmysaas/admin` com:
   - Lista de todos os usuários
   - Checkbox/toggle para cada role (user, admin, contributor)
   - Visual consistente com UaiCode
6. Proteção de rota que redireciona não-admins
7. Link "Admin Panel" visível apenas para admins no dropdown
