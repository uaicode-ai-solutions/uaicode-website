

# Dialog de Imagem nos Cards do Social Media

Adicionar um dialog minimalista que abre ao clicar num card, mostrando apenas a imagem em tamanho grande com navegacao entre slides para carroseis.

## Alteracoes

### Arquivo: `src/components/hero/mock/SocialMediaOverview.tsx`

**1. Novo estado para controlar o dialog:**
- Adicionar `selectedContent: MediaContent | null` para rastrear qual card foi clicado
- Adicionar `dialogSlide: number` para controlar o slide ativo dentro do dialog

**2. Tornar o card clicavel:**
- Adicionar `cursor-pointer` e `onClick={() => { setSelectedContent(content); setDialogSlide(activeSlides[content.id] || 0); }}` no container do card
- O click no download e nas setas do card continuam com `e.stopPropagation()`

**3. Adicionar Dialog minimalista:**
- Importar `Dialog`, `DialogContent` de `@/components/ui/dialog`
- O dialog abre quando `selectedContent !== null`
- Conteudo do dialog: apenas a imagem centralizada, sem titulo, sem descricao, sem footer
- Usar `max-w-3xl` ou similar para a imagem ficar grande
- Fundo escuro (`bg-black/95` ou `bg-transparent`) sem padding extra
- Esconder o botao X padrao ou estiliza-lo discretamente

**4. Navegacao de slides no dialog (apenas para carroseis):**
- Se `selectedContent.content_type === "carousel"` e houver mais de 1 slide:
  - Setas ChevronLeft/ChevronRight posicionadas nos lados da imagem (mesmo estilo das setas dos cards, porem maiores: `h-10 w-10`)
  - Contador de slides na parte inferior da imagem (`{dialogSlide + 1} / {total}`)
  - Desabilitar seta esquerda no primeiro slide, direita no ultimo
- Se for imagem unica: mostrar apenas a imagem, sem setas

**5. Fechar o dialog:**
- `onOpenChange` do Dialog seta `selectedContent` para `null`

