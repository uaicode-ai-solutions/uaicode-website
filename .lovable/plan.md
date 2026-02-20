

# Navegacao de Carousel Direto nos Cards

## Resumo

Remover o dialog de detalhe que abre ao clicar num card e adicionar setas de navegacao (esquerda/direita) diretamente nos cards do tipo carousel, permitindo navegar entre os slides sem sair do grid.

## Alteracoes

### Arquivo: `src/components/hero/mock/SocialMediaOverview.tsx`

**1. Novo estado para controlar slide ativo por card:**
- Adicionar estado `activeSlides: Record<string, number>` (mapa de content.id para indice do slide atual)
- Substituir a logica de `selectedContent` / `currentSlide` / dialog

**2. Atualizar preview do card:**
- Em vez de sempre mostrar o primeiro slide, usar `activeSlides[content.id] || 0` para determinar qual slide exibir
- Atualizar a funcao `getPreviewUrl` ou fazer a logica inline no card

**3. Adicionar setas nos cards carousel:**
- Dentro do `div.relative` da imagem do card, quando `content.content_type === "carousel"` e houver mais de 1 slide:
  - Seta esquerda (ChevronLeft) posicionada `absolute left-1 top-1/2 -translate-y-1/2`
  - Seta direita (ChevronRight) posicionada `absolute right-1 top-1/2 -translate-y-1/2`
  - Ambas com `e.stopPropagation()` e `onClick` que atualiza `activeSlides` para o card especifico
  - Desabilitar seta esquerda no primeiro slide, seta direita no ultimo
  - Estilo: `bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6`
- Atualizar o contador de slides (badge no canto) para mostrar `{slideAtual + 1} / {total}`

**4. Remover o dialog de detalhe:**
- Remover o estado `selectedContent` e `currentSlide`
- Remover a funcao `openDetail`
- Remover o `onClick={() => openDetail(content)}` do card
- Remover todo o bloco `<Dialog>` no final do componente
- Remover variaveis derivadas `slides` e `currentImageUrl` que dependiam de `selectedContent`

**5. Remover o cursor pointer do card:**
- Remover `cursor-pointer` da classe do card ja que nao abre mais dialog

