

# Social Media - 6 Cards (3x2) sem scroll vertical

## Resumo

Alterar o grid para 3 colunas com 2 linhas (6 cards por pagina), reduzir o tamanho dos cards trocando `aspect-square` por `aspect-[4/5]` e diminuindo o padding, para que tudo caiba na tela sem gerar barra de rolagem vertical.

## Detalhes Tecnicos

### Arquivo: `src/components/hero/mock/SocialMediaOverview.tsx`

**PAGE_SIZE:**
- Alterar de `4` para `6` (linha 23)

**Grid de cards (linha 164):**
- Trocar `grid-cols-1 sm:grid-cols-2 gap-4` por `grid-cols-2 sm:grid-cols-3 gap-3`
- Isso garante 3 colunas em telas maiores, 2 linhas = 6 cards

**Aspect ratio dos cards (linha 173):**
- Trocar `aspect-square` por `aspect-[4/5]` para reduzir a altura de cada card

**Padding do rodape do card (linha 202):**
- Trocar `px-3 py-2` por `px-2 py-1` para reduzir espaco vertical

**Espacamento do container (linha 106):**
- Trocar `space-y-6` por `space-y-4` para reduzir gaps entre titulo, filtros e grid

**Titulo (linha 107):**
- Trocar `text-xl` por `text-lg` para economizar espaco vertical

**Skeleton loading (linha 143):**
- Trocar `grid-cols-1 sm:grid-cols-2` por `grid-cols-2 sm:grid-cols-3 gap-3`
- Trocar `length: 4` por `length: 6`
- Trocar `aspect-square` por `aspect-[4/5]`

