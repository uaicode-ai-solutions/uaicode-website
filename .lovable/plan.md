

# Simplificar Menus Laterais do Hero Dashboard

## O que muda

O sidebar atual tem 12 itens em 3 grupos. Vamos reduzir para apenas 3 itens:

| Grupo | Menu atual | Menu final |
|---|---|---|
| Admin | Overview, User Management, System Settings, Activity Logs | **User Management** (apenas) |
| Marketing | Content Calendar, Social Media, Campaigns, Brand Assets | **Lead Management** (novo) |
| Sales | Pipeline, Lead Management, Reports & Analytics, CRM Overview | **Planning My SaaS** (novo) |

## Detalhes Tecnicos

### 1. `src/components/hero/HeroSidebar.tsx`
- Reduzir `sidebarItems` para 3 itens:
  - `{ id: "admin-users", label: "User Management", icon: Users, subsystem: "admin" }`
  - `{ id: "mkt-leads", label: "Lead Management", icon: UserCheck, subsystem: "marketing" }`
  - `{ id: "sales-pms", label: "Planning My SaaS", icon: BarChart3, subsystem: "sales" }`

### 2. `src/pages/hero/HeroDash.tsx`
- Atualizar `defaultView` para refletir os novos IDs
- Atualizar `renderContent()` para rotear:
  - `admin-users` -> `<HeroUserManagement />`  (importar diretamente)
  - `mkt-leads` -> novo componente `<LeadManagement />`
  - `sales-pms` -> novo componente `<PlanningMySaasOverview />`

### 3. `src/components/hero/mock/AdminOverview.tsx` -- REMOVER
- Nao sera mais necessario (User Management ja e importado diretamente)

### 4. `src/components/hero/mock/MarketingOverview.tsx` -- REMOVER
- Todo o conteudo mock sera substituido

### 5. `src/components/hero/mock/SalesOverview.tsx` -- REMOVER
- Todo o conteudo mock sera substituido

### 6. Novo: `src/components/hero/mock/LeadManagement.tsx`
- Tela inicial com placeholder para gerenciamento de leads
- Tabela vazia com estrutura para: Nome, Email, Origem, Status, Data
- Mensagem "No leads yet" com visual consistente com o design atual (dark theme, bordas `white/[0.06]`)

### 7. Novo: `src/components/hero/mock/PlanningMySaasOverview.tsx`
- Tela que mostra dados/links relacionados ao PlanningMySaaS
- Cards com metricas placeholder: Total Reports, Active Users, Revenue
- Visual consistente com o design atual

### 8. `src/hooks/useHeroAuth.ts`
- Atualizar `defaultView` references se houver fallback para views removidas

