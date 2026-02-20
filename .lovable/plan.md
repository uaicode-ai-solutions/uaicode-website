

# Paginacao na tabela de Leads

## O que muda

Adicionar paginacao na tabela para exibir um numero fixo de leads por pagina, eliminando a barra de rolagem vertical. Sem necessidade de fixar cabecalho ou filtros.

## Detalhes Tecnicos

### `src/components/hero/mock/LeadManagement.tsx`

1. Adicionar estado `currentPage` e constante `ITEMS_PER_PAGE = 15`
2. Criar `useMemo` para calcular `totalPages` e `paginatedLeads` (fatia do array `filtered`)
3. Adicionar `useEffect` para resetar `currentPage` para 1 quando `filtered` mudar (busca/filtros)
4. Substituir `filtered.map(...)` por `paginatedLeads.map(...)` no render da tabela
5. Adicionar rodape abaixo da tabela com:
   - Texto "Showing X-Y of Z"
   - Botoes "Previous" e "Next" desabilitados quando na primeira/ultima pagina
   - Estilo dark consistente com o restante da pagina

