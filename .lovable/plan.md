

# Adicionar Item "Suppliers" na Secao Admin do Sidebar

## Alteracoes

**1. Sidebar (`src/components/hero/HeroSidebar.tsx`)**
- Importar o icone `Truck` do `lucide-react` (representa fornecedores/suppliers)
- Adicionar novo item no array `sidebarItems`:
  ```
  { id: "admin-suppliers", label: "Suppliers", icon: Truck, subsystem: "admin" }
  ```
  Posicionado apos "User Management" em ordem alfabetica (Suppliers, User Management)

**2. Componente mock (`src/components/hero/mock/SuppliersOverview.tsx`)**
- Criar componente placeholder seguindo o padrao do `ICPOverview.tsx`
- Cards de metricas: Total Suppliers, Active Contracts, Pending Approvals, Avg Rating
- Mensagem "coming soon" para conteudo futuro

**3. Dashboard (`src/pages/hero/HeroDash.tsx`)**
- Importar `SuppliersOverview`
- Adicionar case `"admin-suppliers"` no `renderContent()`

