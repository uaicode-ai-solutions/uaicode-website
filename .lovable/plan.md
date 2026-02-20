

# Social Media - Paginacao e cards menores

## O que muda

1. Adicionar barra de paginacao na parte inferior para navegar entre paginas de 8 cards
2. Reduzir o tamanho dos cards removendo o aspect-square e usando uma proporcao menor
3. Garantir que os 8 cards caibam na tela sem gerar scroll vertical

## Detalhes Tecnicos

### `src/components/hero/mock/SocialMediaOverview.tsx`

**Novo estado:**
- `currentPage` iniciando em `0`

**Paginacao:**
- Constante `PAGE_SIZE = 8`
- Calcular `totalPages = Math.ceil(contents.length / PAGE_SIZE)`
- Fatiar os dados: `paginatedContents = contents.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)`
- Renderizar apenas `paginatedContents` no grid

**Cards menores:**
- Trocar `aspect-square` por `aspect-[4/3]` nos cards para reduzir a altura
- Grid permanece `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` (2 linhas x 4 colunas = 8 cards)
- Reduzir padding inferior do card de `px-3 py-2` para `px-2 py-1`

**Barra de navegacao (paginacao):**
- Renderizar abaixo do grid apenas quando `totalPages > 1`
- Layout: `flex items-center justify-between` com estilo dark
- Lado esquerdo: texto "Page X of Y" em `text-xs text-white/40`
- Centro: botoes de pagina numerados (1, 2, 3...) com destaque no ativo
- Lado direito: botoes Previous/Next usando `ChevronLeft`/`ChevronRight` (ja importados)
- Botoes desabilitados quando na primeira/ultima pagina
- Estilo dos botoes: `bg-white/[0.04] hover:bg-white/[0.08] text-white/60 rounded-lg px-3 py-1.5 text-xs`
- Botao ativo: `bg-white/[0.12] text-white`

**Container principal:**
- Trocar `space-y-6` por `flex flex-col h-[calc(100vh-theme(spacing.24))]` para ocupar a altura disponivel sem scroll
- O grid de cards recebe `flex-1` e a barra de paginacao fica fixa na parte inferior

**Resetar pagina:**
- Ao mudar o total de conteudos (refetch), resetar `currentPage` para 0

