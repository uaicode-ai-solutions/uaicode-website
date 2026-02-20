

# Social Media - Exibicao de conteudo em cards

## O que muda

Substituir o placeholder "Coming soon" por uma grade de cards que exibe o conteudo da tabela `tb_media_content`. Cada card mostra a primeira imagem (ou asset), tipo de midia, pilar, status e data. Ao clicar, abre um Dialog com visualizacao ampliada e todos os detalhes da midia (incluindo navegacao por slides no caso de carrossel).

## Detalhes Tecnicos

### `src/components/hero/mock/SocialMediaOverview.tsx` (reescrever)

**Imports:**
- `useState` de React
- `useQuery` de `@tanstack/react-query`
- `supabase` de `@/integrations/supabase/client`
- `format` de `date-fns`
- `Dialog, DialogContent, DialogHeader, DialogTitle` de `@/components/ui/dialog`
- `Badge` de `@/components/ui/badge`
- `Button` de `@/components/ui/button`
- `Image, Video, Layers, ChevronLeft, ChevronRight, Calendar, Eye` de `lucide-react`
- Tipo `Tables` de `@/integrations/supabase/types`

**Query Supabase:**
- Buscar todos os registros de `tb_media_content` ordenados por `created_at` desc
- A tabela ja tem RLS para admins (o usuario logado e admin)

**Interface de slide:**
```typescript
interface Slide {
  image_url: string;
  slide_number: number;
}
```

**Grid de cards:**
- Layout: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`
- Cada card:
  - Imagem de preview: primeira imagem do `slides_json` (para carousel) ou `asset_url` (para single_image/video)
  - Aspect ratio quadrado (1:1) com `object-cover`
  - Overlay inferior com gradiente escuro mostrando:
    - Badge com `content_type` (icone Layers para carousel, Image para single_image, Video para video)
    - Badge com `pillar`
    - Badge com `status` (cores diferentes: ready=verde, generating=amarelo, draft=cinza)
  - Data de criacao no canto
  - Estilo dark: `rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden cursor-pointer hover:border-white/[0.12] transition-colors`

**Dialog de detalhes (ao clicar no card):**
- Estado: `selectedContent` e `currentSlide` (para navegacao de carrossel)
- Imagem ampliada no topo (aspect ratio 1:1)
- Para carrossel: botoes de navegacao prev/next com indicador de slide atual (ex: "3 / 7")
- Abaixo da imagem:
  - Badges: content_type, pillar, status
  - Caption completa (texto scrollavel)
  - Datas: created_at, scheduled_for, published_at (se existirem)
  - Instagram Media ID (se existir)
- Estilo do dialog: `bg-[#0a0a0a] border-white/[0.06] text-white max-w-2xl`

**Estado de loading:**
- Skeleton cards enquanto carrega

**Estado vazio:**
- Manter estilo similar ao atual caso nao haja conteudo

