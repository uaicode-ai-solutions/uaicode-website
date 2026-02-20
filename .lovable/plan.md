
# Invite User - Backend Completo + Frontend

## Objetivo
Adicionar botao "Invite User" na tela de User Management que abre um dialog para convidar novos usuarios ao Hero Ecosystem, com backend completo para criar o usuario no Supabase Auth, perfil na `tb_hero_users`, role na `tb_hero_roles`, e enviar email de convite.

## Fluxo do Convite

```text
Admin clica "Invite User"
       |
       v
Dialog com formulario (email, role, team)
       |
       v
Chama Edge Function "hero-invite-user"
       |
       v
Edge Function (com service_role_key):
  1. Cria usuario no Supabase Auth (createUser com generate_link)
  2. Cria perfil na tb_hero_users (full_name vazio = status "invited")
  3. Cria role na tb_hero_roles
  4. Envia email de convite via Resend (com link de recovery)
       |
       v
Usuario recebe email > clica no link > reseta senha > redirecionado a /hero/dash?view=profile > preenche nome > status vira "approved"
```

## Arquivos

| Arquivo | Acao |
|---|---|
| `supabase/functions/hero-invite-user/index.ts` | Criar - Edge function que cria auth user + hero profile + role + envia email |
| `supabase/config.toml` | Atualizar - Adicionar config da nova edge function |
| `src/components/hero/admin/InviteUserDialog.tsx` | Criar - Dialog com formulario de convite (email, role, team) |
| `src/components/hero/admin/HeroUserManagement.tsx` | Atualizar - Adicionar botao "Invite User" que abre o dialog |

## Detalhes Tecnicos

### Edge Function `hero-invite-user`

- Recebe: `{ email, role, team }` no body
- Valida que o caller e admin (via JWT + consulta tb_hero_roles)
- Usa `supabase.auth.admin.createUser()` com `email_confirm: false` para criar o usuario
- Gera link de recovery via `supabase.auth.admin.generateLink({ type: 'recovery', email })`
- Insere perfil em `tb_hero_users` com `full_name: ''` (status derivado como "invited")
- Insere role em `tb_hero_roles`
- Envia email de convite via Resend com o link de recovery
- Usa `SUPABASE_SERVICE_ROLE_KEY` (ja configurado nos secrets) para operacoes admin

### Dialog `InviteUserDialog`

- Campos: Email (input), Role (select: admin/contributor/viewer), Team (select: admin/marketing/sales/none)
- Validacao com zod: email obrigatorio e valido
- Chama a edge function via `supabase.functions.invoke('hero-invite-user', ...)`
- Loading state no botao durante envio
- Invalida query `hero-users` apos sucesso para atualizar a tabela
- Mensagem de sucesso via toast ou inline

### Email de Convite

- Template premium seguindo o padrao visual do recovery.html existente (dark theme, UaiCode brand)
- Conteudo: "You've been invited to UaiCode Hero Ecosystem" com botao "Set Up Your Account"
- Link aponta para o recovery URL que redireciona a `/hero/dash?view=profile`

### Seguranca

- Edge function valida JWT do caller
- Verifica que o caller tem role `admin` na `tb_hero_roles`
- Usa service role key apenas server-side
- Verifica duplicatas (email ja existente no auth ou tb_hero_users)
