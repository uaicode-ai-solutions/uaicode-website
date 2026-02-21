

# Adicionar Item "ICPs" na Secao Marketing do Sidebar

## Alteracao

**Arquivo:** `src/components/hero/HeroSidebar.tsx`

1. Importar o icone `Target` do `lucide-react` (representa bem o conceito de ICP - Ideal Customer Profile)
2. Adicionar novo item no array `sidebarItems`:
   ```
   { id: "mkt-icps", label: "ICPs", icon: Target, subsystem: "marketing" }
   ```
   Posicionado antes de "Leads" para manter ordem alfabetica (ICPs, Leads, Social Media)

**Arquivo:** `src/pages/hero/HeroDash.tsx`

3. Adicionar um case no `renderContent()` para `"mkt-icps"` que renderiza um componente placeholder (ou mock) para ICPs
4. Criar um componente simples `src/components/hero/mock/ICPOverview.tsx` com layout basico "coming soon" seguindo o padrao dos outros mocks

