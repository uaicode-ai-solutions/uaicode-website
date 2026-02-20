

# Botao Clear Filters com icone de borracha

## O que muda

Adicionar um botao com o icone `Eraser` do Lucide na barra de filtros que limpa todos os filtros de uma vez (search, source, country, startDate, endDate).

## Detalhes Tecnicos

### `src/components/hero/mock/LeadManagement.tsx`

- Adicionar import do icone `Eraser` de `lucide-react`
- Criar uma funcao `clearFilters` que reseta: `setSearchTerm("")`, `setSourceFilter("all")`, `setCountryFilter("all")`, `setStartDate(undefined)`, `setEndDate(undefined)`
- Adicionar um botao ao final da barra de filtros com:
  - Icone `Eraser` (w-4 h-4)
  - Sem texto, apenas o icone
  - Tooltip ou title "Clear filters"
  - Estilo consistente: `p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:bg-white/[0.08] hover:text-white transition-colors`
  - Desabilitado quando nenhum filtro esta ativo (todos nos valores default)

