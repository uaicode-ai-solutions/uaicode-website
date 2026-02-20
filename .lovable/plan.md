

# Reorganizar Menus do Hero Dashboard

## O que muda

| Grupo | Atual | Novo |
|---|---|---|
| Admin | User Management | User Management (sem mudanca) |
| Marketing | Lead Management | **Social Media** (novo placeholder) |
| Sales | Planning My SaaS | **Lead Management** (movido do Marketing) + Planning My SaaS |

## Detalhes Tecnicos

### 1. `src/components/hero/HeroSidebar.tsx`
- Atualizar `sidebarItems` para 4 itens:
  - `{ id: "admin-users", label: "User Management", icon: Users, subsystem: "admin" }`
  - `{ id: "mkt-social", label: "Social Media", icon: Share2, subsystem: "marketing" }` (novo)
  - `{ id: "sales-leads", label: "Lead Management", icon: UserCheck, subsystem: "sales" }` (movido, id atualizado)
  - `{ id: "sales-pms", label: "Planning My SaaS", icon: BarChart3, subsystem: "sales" }`

### 2. `src/pages/hero/HeroDash.tsx`
- Atualizar `defaultView` para incluir `sales-leads` como fallback para sales
- Atualizar `renderContent()`:
  - `mkt-social` -> novo componente `<SocialMediaOverview />`
  - `sales-leads` -> componente existente `<LeadManagement />`
  - Manter `admin-users` e `sales-pms` como estao

### 3. Novo: `src/components/hero/mock/SocialMediaOverview.tsx`
- Tela placeholder para Social Media
- Visual consistente com dark theme existente
- Mensagem tipo "Coming soon" ou cards placeholder para redes sociais

