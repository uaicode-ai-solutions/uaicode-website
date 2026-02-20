

# Social Media - 4 Cards em Uma Unica Linha

## Resumo

Reorganizar o grid para exibir os 4 cards lado a lado em uma unica linha horizontal (4 colunas), eliminando a segunda linha e maximizando o espaco vertical disponivel.

## Detalhes Tecnicos

### Arquivo: `src/components/hero/mock/SocialMediaOverview.tsx`

**PAGE_SIZE:** permanece `4`

**Grid de cards (linha 164):**
- Trocar `grid-cols-2 gap-3` por `grid-cols-4 gap-3`
- 4 colunas x 1 linha = 4 cards lado a lado

**Skeleton loading (linha 143):**
- Trocar `grid-cols-2 gap-3` por `grid-cols-4 gap-3`
- Manter `length: 4`

**Aspect ratio dos cards:** manter `aspect-[3/4]` (pode ser ajustado se necessario apos teste visual)

