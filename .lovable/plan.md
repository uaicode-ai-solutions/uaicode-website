

## Limpeza da tb_pms_users e organizacao das roles

### Resumo
Remover 3 colunas desnecessarias da `tb_pms_users` (`phone`, `linkedin_profile`, `user_role_other`) e mover os dados de "role do wizard" (founder, cto, etc.) para `tb_pms_wizard`. O campo `user_role` sera removido tambem, pois o sistema de roles ja funciona corretamente pela tabela `user_roles`.

### Ponto importante sobre seguranca

O sistema atual ja possui um mecanismo robusto de RBAC:
- Tabela `user_roles` armazena as roles (user, admin, contributor)
- Funcao `has_role()` e usada nas RLS policies para controle de acesso no banco
- Hook `useUserRoles` no frontend fornece `isAdmin` e `isContributor`
- O trigger `handle_new_user()` ja atribui a role "user" automaticamente ao criar um novo usuario
- O Admin Panel ja gerencia roles via `user_roles` com toggles

Armazenar roles na tabela `tb_pms_users` seria uma duplicacao que pode causar inconsistencias e riscos de seguranca (um usuario poderia manipular o campo do perfil para escalar privilegios). Por isso, o campo `user_role` da `tb_pms_users` tambem sera removido - as roles do sistema continuam gerenciadas exclusivamente pela tabela `user_roles`.

### Plano

#### 1. Migration: Adicionar client_role e client_role_other na tb_pms_wizard

Os campos "What's your role?" do Step 1 do wizard (founder, cto, solo, etc.) precisam ser salvos na `tb_pms_wizard`, pois pertencem ao contexto do report.

```sql
ALTER TABLE public.tb_pms_wizard
  ADD COLUMN client_role text,
  ADD COLUMN client_role_other text;
```

#### 2. Migration: Remover colunas de tb_pms_users

```sql
ALTER TABLE public.tb_pms_users
  DROP COLUMN IF EXISTS phone,
  DROP COLUMN IF EXISTS linkedin_profile,
  DROP COLUMN IF EXISTS user_role,
  DROP COLUMN IF EXISTS user_role_other;
```

#### 3. Atualizar trigger handle_new_user()

Remover `username` do INSERT (era gerado via `split_part`) - manter apenas `auth_user_id`, `email`, `full_name`.

Atualizado: a funcao nao precisa mais referenciar colunas removidas.

#### 4. Salvar client_role no insert do wizard (PmsWizard.tsx)

Adicionar ao insert de `tb_pms_wizard`:
```
client_role: data.userRole,
client_role_other: data.userRole === 'other' ? data.userRoleOther : null,
```

Remover pre-fill de `phone`, `linkedinProfile`, `userRole`, `userRoleOther` a partir de `pmsUser`.

#### 5. Atualizar useAuth.ts

Remover `phone`, `linkedin_profile`, `user_role`, `user_role_other` da interface `PmsUser`.
Remover `updateProfile` dos campos `phone` e `linkedin_profile`.

#### 6. Atualizar useAdminUsers.ts

Remover `phone`, `linkedin_profile`, `username` da interface `PmsUser`.

#### 7. Atualizar edge functions

**pms-webhook-new-user**: Remover `phone`, `linkedin_profile`, `user_role`, `user_role_other` do payload.

**pms-webhook-new-report**: Remover `phone`, `linkedin_profile`, `user_role`, `user_role_other` do payload do usuario.

#### 8. types.ts

Sera atualizado automaticamente pelo sync com o banco apos as migrations.

### Como o sistema de roles funciona (sem mudancas)

- Novo usuario: trigger `handle_new_user()` cria registro em `tb_pms_users` e insere role "user" na tabela `user_roles`
- Admin Panel: toggle de roles insere/remove registros na `user_roles`
- Verificacao de acesso: `useUserRoles` hook retorna `isAdmin`/`isContributor` consultando `user_roles`
- RLS: policies usam `has_role(get_pms_user_id(), 'admin')` - consulta `user_roles` diretamente

### Arquivos alterados
- `supabase/migrations/` - 2 migrations
- `src/hooks/useAuth.ts` - simplificar interface
- `src/hooks/useAdminUsers.ts` - simplificar interface
- `src/pages/PmsWizard.tsx` - salvar client_role + remover pre-fill
- `supabase/functions/pms-webhook-new-user/index.ts` - remover campos
- `supabase/functions/pms-webhook-new-report/index.ts` - remover campos
- Trigger `handle_new_user()` - simplificar

### Aviso para producao
Antes de publicar, rodar no Live via Cloud View > Run SQL:
```sql
ALTER TABLE public.tb_pms_users
  DROP COLUMN IF EXISTS phone,
  DROP COLUMN IF EXISTS linkedin_profile,
  DROP COLUMN IF EXISTS user_role,
  DROP COLUMN IF EXISTS user_role_other;
```
