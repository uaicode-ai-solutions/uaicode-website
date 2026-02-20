

# Filtro por data e CSV inteligente na tabela de Leads

## O que muda

1. Dois campos de calendario (data inicio e data fim) na barra de filtros, usando Popover + Calendar do Shadcn
2. Filtragem dos leads por `created_at` dentro do intervalo selecionado
3. Export CSV passa a exportar apenas os dados filtrados (ja faz isso) e o nome do arquivo reflete os filtros aplicados

## Detalhes Tecnicos

### `src/components/hero/mock/LeadManagement.tsx`

**Novos imports:**
- `format` de `date-fns`
- `CalendarIcon` de `lucide-react`
- `Calendar` de `@/components/ui/calendar`
- `Popover, PopoverTrigger, PopoverContent` de `@/components/ui/popover`
- `Button` de `@/components/ui/button`
- `cn` de `@/lib/utils`

**Novos estados:**
- `startDate: Date | undefined`
- `endDate: Date | undefined`

**Filtro por data no `useMemo` de `filtered`:**
- Se `startDate` definido, excluir leads com `created_at` antes de `startDate` (inicio do dia)
- Se `endDate` definido, excluir leads com `created_at` apos `endDate` (fim do dia)

**Reset de pagina:**
- Adicionar `startDate` e `endDate` nas dependencias do `useEffect` que reseta `currentPage`

**UI dos calendarios (na barra de filtros):**
- Dois Popovers lado a lado apos os selects existentes
- Cada um com um Button mostrando a data selecionada ou placeholder ("Start date" / "End date")
- Icone de calendario no botao
- Estilo dark consistente: `bg-white/[0.04] border-white/[0.06] text-white/70`
- Calendar dentro do PopoverContent com `pointer-events-auto`

**Nome do arquivo CSV:**
- Base: `leads`
- Se source filtrado: `-source-{source}`
- Se country filtrado: `-country-{country}`
- Se startDate: `-from-{YYYY-MM-DD}`
- Se endDate: `-to-{YYYY-MM-DD}`
- Sufixo: data atual
- Exemplo: `leads-source-website-country-BR-from-2025-01-01-to-2025-06-30-2026-02-20.csv`

