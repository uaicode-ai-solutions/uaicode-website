
# User Management com Dados Reais do Supabase

## O que muda
A view "User Management" (`admin-users`) vai deixar de usar dados mock hardcoded e passar a carregar usuarios reais das tabelas `tb_hero_users` e `tb_hero_roles` do Supabase.

## Implementacao

### 1. Criar hook `useHeroUsers`
Novo arquivo `src/hooks/useHeroUsers.ts` que:
- Busca todos os usuarios de `tb_hero_users` (permitido pela RLS para admins)
- Busca todos os roles de `tb_hero_roles` (permitido pela RLS para admins)
- Combina os dados em um array de usuarios com seus roles
- Usa `@tanstack/react-query` seguindo o padrao existente (ex: `useAdminUsers.ts`)

### 2. Criar componente `HeroUserManagement`
Novo arquivo `src/components/hero/admin/HeroUserManagement.tsx` que:
- Usa o hook `useHeroUsers` para carregar dados reais
- Exibe tabela com colunas: Name, Email, Role, Team
- Mostra skeleton/loading enquanto carrega
- Mostra estado vazio caso nao haja usuarios
- Mantem o visual glass-premium atual (bordas `white/[0.06]`, fundo `white/[0.02]`)

### 3. Atualizar `AdminOverview.tsx`
- No bloco `view === "admin-users"`, renderizar o novo `HeroUserManagement` em vez da tabela mock
- Remover os dados mock `recentUsers` que nao serao mais usados

## Arquivos

| Arquivo | Acao |
|---|---|
| `src/hooks/useHeroUsers.ts` | Criar - hook para buscar usuarios hero do Supabase |
| `src/components/hero/admin/HeroUserManagement.tsx` | Criar - componente com tabela de usuarios reais |
| `src/components/hero/mock/AdminOverview.tsx` | Atualizar - usar componente real no lugar do mock |

## Detalhes Tecnicos

- As tabelas `tb_hero_users` e `tb_hero_roles` ja possuem RLS configurada para que admins vejam todos os registros
- O hook usa `supabase.from("tb_hero_users" as any)` pois essas tabelas nao estao no tipo gerado (padrao ja usado em `useHeroAuth.ts`)
- Roles possiveis: `admin`, `contributor`, `viewer` (enum `hero_role`)
- Teams possiveis: `admin`, `marketing`, `sales`, `none`
