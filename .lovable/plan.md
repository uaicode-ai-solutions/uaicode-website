

# Social Media - 4 Cards, Paginacao e Filtro por Data com Calendarios

## Resumo

Limitar a exibicao a 4 cards por pagina (grid 2x2), adicionar barra de paginacao inferior e uma barra de filtros com dois date pickers (data inicio e data fim) usando o componente Calendar dentro de Popovers, mais um botao de reset com icone de borracha (Eraser do lucide-react).

## Detalhes Tecnicos

### Arquivo: `src/components/hero/mock/SocialMediaOverview.tsx`

**Novos imports:**
- `useMemo, useEffect` de React
- `Popover, PopoverContent, PopoverTrigger` de `@/components/ui/popover`
- `Calendar` de `@/components/ui/calendar`
- `Eraser` de `lucide-react`
- `cn` de `@/lib/utils`
- `isAfter, isBefore, startOfDay, endOfDay` de `date-fns`

**Novos estados:**
- `currentPage` (number, default 0)
- `dateFrom` (Date | undefined)
- `dateTo` (Date | undefined)

**Constante:**
- `PAGE_SIZE = 4`

**Logica de filtragem (useMemo):**
1. Partir de `contents`
2. Se `dateFrom` definido, filtrar `content.created_at >= startOfDay(dateFrom)`
3. Se `dateTo` definido, filtrar `content.created_at <= endOfDay(dateTo)`
4. Resultado: `filteredContents`

**Paginacao (useMemo):**
- `totalPages = Math.ceil(filteredContents.length / PAGE_SIZE)`
- `paginatedContents = filteredContents.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)`

**Reset de pagina:**
- `useEffect` com dependencias `[dateFrom, dateTo]` para setar `currentPage = 0`

**Barra de filtros (entre titulo e grid):**
```text
[Calendar icon] [From: Pick a date ▼] [To: Pick a date ▼] [Eraser icon button]
```
- Cada date picker: `Popover` contendo `PopoverTrigger` (botao com icone Calendar + data formatada ou placeholder) e `PopoverContent` com o componente `Calendar` mode="single"
- Estilo dos botoes trigger: `h-8 text-xs bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.08]`
- Botao de reset: `Button` variant="ghost" size="icon" com icone `Eraser`, visivel apenas quando algum filtro esta ativo, limpa `dateFrom` e `dateTo` para `undefined`
- Estilo do botao reset: `h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.08]`

**Grid de cards:**
- Mudar para `grid-cols-1 sm:grid-cols-2 gap-4` (maximo 2 colunas, 2 linhas = 4 cards)
- Renderizar apenas `paginatedContents`
- Skeleton loading: mostrar 4 skeletons (em vez de 8) com grid `grid-cols-1 sm:grid-cols-2`

**Barra de paginacao (abaixo do grid, somente se totalPages > 1):**
- Layout: `flex items-center justify-between pt-4`
- Esquerda: "Page X of Y" em `text-xs text-white/40`
- Centro: botoes de pagina numerados (1, 2, 3...) com destaque no ativo (`bg-white/[0.12] text-white` vs `text-white/40`)
- Direita: botoes Previous/Next com `ChevronLeft`/`ChevronRight`, desabilitados na primeira/ultima pagina
- Direita inferior: "N items" em `text-xs text-white/40`

**Dialog de detalhes:** permanece inalterado.

