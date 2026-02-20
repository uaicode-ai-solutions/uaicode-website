

# User Management Real + Convite de Usuarios - Hero Ecosystem

## Resumo

Substituir os dados mock da tela User Management por dados reais do Supabase e implementar o fluxo completo de convite de usuarios, onde o admin informa email, role e team.

## Fluxo do Convite

```text
Admin (User Management)
  |-- Clica "Invite User" -> Informa email, role e team
  |
  v
Edge Function "hero-invite-user":
  1. Valida que o caller e admin Hero (via JWT)
  2. Chama auth.admin.inviteUserByEmail(email) -> cria user em auth.users
  3. Cria registro em tb_hero_users (email, auth_user_id, team, full_name vazio)
  4. Cria registro em tb_hero_roles (role selecionada)
  5. Supabase envia email de convite automaticamente
  |
  v
Usuario recebe email -> Clica no link -> /hero/reset-password
  |
  v
Define senha -> Redireciona para /hero/dash?view=profile
  |
  v
Completa dados obrigatorios (full_name) -> Salva em tb_hero_users
  |
  v
Acessa o dashboard normalmente
```

## Alteracoes

### 1. Migracao SQL

Adicionar policy de INSERT em `tb_hero_users` para admins Hero (atualmente nao existe):

```sql
CREATE POLICY "hero_users_insert_admin"
  ON public.tb_hero_users FOR INSERT
  WITH CHECK (has_hero_role(get_hero_user_id(), 'admin'::hero_role));
```

### 2. Nova Edge Function: `supabase/functions/hero-invite-user/index.ts`

- Recebe `{ email, role, team }` no body
- Valida JWT do caller e confirma que e admin Hero
- Usa `supabase.auth.admin.inviteUserByEmail(email, { redirectTo: '.../hero/reset-password' })` com service role key
- Cria registro em `tb_hero_users` (email, auth_user_id, team informado, full_name vazio)
- Cria registro em `tb_hero_roles` (user_id, role informada)
- Retorna sucesso ou erro

### 3. Atualizar: `supabase/config.toml`

Adicionar:
```toml
[functions.hero-invite-user]
verify_jwt = false
```

### 4. Novo Hook: `src/hooks/useHeroUsers.ts`

- Query que busca todos os usuarios de `tb_hero_users` (admin RLS ja permite)
- Query paralela que busca todas as roles de `tb_hero_roles`
- Junta os dados no cliente (user + suas roles)
- Mutation `inviteUser(email, role, team)` que chama a edge function via `supabase.functions.invoke`
- Usa React Query com invalidacao apos convite

### 5. Novo Componente: `src/components/hero/admin/UserManagement.tsx`

Substitui a secao mock `admin-users`:
- Tabela real com colunas: Nome, Email, Role, Team, Status
- Status: "Active" (full_name preenchido) vs "Pending Invite" (full_name vazio)
- Badge colorido para cada role (admin=amarelo, contributor=azul, viewer=cinza)
- Botao "Invite User" no topo
- Dialog de convite com:
  - Campo Email (obrigatorio, validado)
  - Select Role (admin, contributor, viewer)
  - Select Team (admin, marketing, sales)
- Loading states, toast de sucesso/erro

### 6. Novo Componente: `src/components/hero/profile/HeroProfileForm.tsx`

Formulario para o usuario completar/editar seu perfil:
- Full Name (obrigatorio)
- Email (readonly, apenas exibicao)
- Team (readonly para nao-admins, editavel para admins)
- Avatar URL (opcional)
- Botao salvar que faz UPDATE em `tb_hero_users`
- Mensagem de boas-vindas se full_name estiver vazio (usuario recem-convidado)

### 7. Atualizar: `src/components/hero/mock/AdminOverview.tsx`

- Quando `view === "admin-users"`, renderizar o novo `UserManagement` em vez dos dados mock
- Manter as outras views (admin-overview, admin-settings, admin-logs) como estao

### 8. Atualizar: `src/pages/hero/HeroDash.tsx`

- Importar `HeroProfileForm`
- Adicionar caso `view === "profile"` no `renderContent` que renderiza o formulario de perfil

### 9. Atualizar: `src/components/hero/HeroSidebar.tsx`

- Adicionar item "My Profile" (icone User) no topo da sidebar, visivel para todos os usuarios (nao depende de subsystem)

### 10. Atualizar: `src/pages/hero/HeroResetPassword.tsx`

- No estado `success` (linha 201), alterar o botao "Go to Dashboard" para redirecionar para `/hero/dash?view=profile` em vez de `/hero/home`
- Isso garante que usuarios convidados completem seus dados obrigatorios

## Arquivos

| Arquivo | Acao |
|---|---|
| Migration SQL | INSERT policy para tb_hero_users |
| `supabase/functions/hero-invite-user/index.ts` | Criar |
| `supabase/config.toml` | Adicionar hero-invite-user |
| `src/hooks/useHeroUsers.ts` | Criar |
| `src/components/hero/admin/UserManagement.tsx` | Criar |
| `src/components/hero/profile/HeroProfileForm.tsx` | Criar |
| `src/components/hero/mock/AdminOverview.tsx` | Atualizar (delegar admin-users) |
| `src/pages/hero/HeroDash.tsx` | Atualizar (adicionar profile view) |
| `src/components/hero/HeroSidebar.tsx` | Atualizar (adicionar My Profile) |
| `src/pages/hero/HeroResetPassword.tsx` | Atualizar (redirect para profile) |

## Seguranca

- Edge function valida JWT e confirma role admin antes de convidar
- `inviteUserByEmail` usa SUPABASE_SERVICE_ROLE_KEY (ja existe nos secrets)
- RLS existente ja protege SELECT/UPDATE em tb_hero_users
- Nova INSERT policy restringe a admins Hero
- Roles armazenadas em tabela separada (`tb_hero_roles`), nunca no perfil

