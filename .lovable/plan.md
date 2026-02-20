

# Adicionar Status ao User Management

## Objetivo
Mostrar o status de cada usuario na tabela de User Management: **Invited** (convidado, ainda nao completou o perfil) ou **Approved** (ja ativou a conta e preencheu o nome).

## Abordagem

Como nao e' possivel consultar `auth.users` pelo client-side (restricao do Supabase), o status sera derivado dos dados existentes na tabela `tb_hero_users`:

- **Approved**: usuario com `full_name` preenchido (diferente de string vazia)
- **Invited**: usuario com `full_name` vazio (valor default quando convidado)

Isso funciona porque, pelo fluxo de convite, o usuario e' criado com `full_name` vazio e so preenche ao completar o onboarding no `/hero/dash?view=profile`.

## Alteracoes

### 1. Atualizar `HeroUserManagement.tsx`
- Adicionar coluna "Status" na tabela
- Renderizar badge colorido:
  - **Approved** (verde) se `full_name` nao vazio
  - **Invited** (amarelo) se `full_name` vazio

### 2. Atualizar `useHeroUsers.ts`
- Adicionar campo `status` derivado ao tipo `HeroUserWithRoles`

## Arquivos

| Arquivo | Acao |
|---|---|
| `src/hooks/useHeroUsers.ts` | Adicionar campo `status` derivado do `full_name` |
| `src/components/hero/admin/HeroUserManagement.tsx` | Adicionar coluna Status com badges coloridos |

## Detalhes Tecnicos

- Nenhuma migracao de banco necessaria - status derivado em runtime
- Logica: `status = user.full_name.trim() ? 'approved' : 'invited'`
- Badge approved: `bg-emerald-500/10 text-emerald-400`
- Badge invited: `bg-amber-500/10 text-amber-400`
