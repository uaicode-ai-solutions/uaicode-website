

# Filtros Avançados - Social Media

## Resumo

Melhorar a barra de filtros da tela Social Media com labels "Start Date" e "End Date" nos calendarios, adicionar filtros por content_type e pillar usando Select dropdowns, e um botao "Clear Filters" com icone de borracha que aparece sempre que houver filtros ativos.

## Detalhes Tecnicos

### Arquivo: `src/components/hero/mock/SocialMediaOverview.tsx`

**Novos estados (apos dateFrom/dateTo):**
- `contentType`: `string | undefined` - filtro por content_type
- `pillarFilter`: `string | undefined` - filtro por pillar

**Listas de opcoes derivadas dos dados:**
- Extrair valores unicos de `content_type` e `pillar` dos dados carregados usando `useMemo`
- Isso garante que os dropdowns sempre refletem os dados reais

**Atualizar `hasFilters`:**
- Incluir `contentType` e `pillarFilter` na verificacao

**Atualizar `filteredContents`:**
- Adicionar filtros por `content_type` e `pillar` alem das datas
- Adicionar `contentType` e `pillarFilter` nas dependencias do `useMemo`

**Atualizar `useEffect` de reset de pagina:**
- Incluir `contentType` e `pillarFilter` nas dependencias

**Barra de filtros - layout:**
- Trocar labels "From"/"To" por "Start Date"/"End Date"
- Adicionar dois `Select` (do shadcn/ui) para content_type e pillar
- Usar placeholder "All Types" e "All Pillars"
- Estilizar com mesma aparencia dark dos botoes existentes (bg-white/[0.04], border-white/[0.08])
- Adicionar botao "Clear Filters" com icone `Eraser` e texto, visivel sempre que `hasFilters` for true
- O botao limpa todos os 4 filtros de uma vez

**Importacoes adicionais:**
- Importar `Select, SelectContent, SelectItem, SelectTrigger, SelectValue` de `@/components/ui/select`

**Funcao clearFilters:**
- Reseta `dateFrom`, `dateTo`, `contentType` e `pillarFilter` para `undefined`

