

# Social Media - Voltar para 4 cards sem scroll vertical

## Resumo

Reverter para 4 cards por pagina (grid 2x2) e reduzir ainda mais o aspect ratio dos cards para garantir que nao haja barra de rolagem vertical.

## Detalhes Tecnicos

### Arquivo: `src/components/hero/mock/SocialMediaOverview.tsx`

**PAGE_SIZE (linha 23):**
- Alterar de `6` para `4`

**Grid de cards (linha 164):**
- Trocar `grid-cols-2 sm:grid-cols-3 gap-3` por `grid-cols-2 gap-3`
- 2 colunas x 2 linhas = 4 cards

**Aspect ratio dos cards (linha 173):**
- Trocar `aspect-[4/5]` por `aspect-[3/4]` para reduzir ainda mais a altura de cada card

**Skeleton loading (linhas 143-145):**
- Trocar `grid-cols-2 sm:grid-cols-3 gap-3` por `grid-cols-2 gap-3`
- Trocar `length: 6` por `length: 4`
- Trocar `aspect-[4/5]` por `aspect-[3/4]`

