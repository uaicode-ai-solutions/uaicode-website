

# Botao de Download (ZIP) nos Cards do Social Media

## Resumo

Adicionar um icone de download no canto inferior direito de cada card. Ao clicar, o sistema coleta todas as imagens do conteudo (imagem unica ou todos os slides do carousel), baixa cada uma como blob, empacota num arquivo ZIP usando a biblioteca JSZip, e dispara o download automaticamente.

## Alteracoes

### 1. Instalar dependencia JSZip
- Adicionar `jszip` ao projeto para criar arquivos ZIP no browser

### 2. Arquivo: `src/components/hero/mock/SocialMediaOverview.tsx`

**Importacoes:**
- Importar `Download` de `lucide-react`
- Importar `JSZip` de `jszip`
- Importar `{ toast }` de `sonner` para feedback ao usuario

**Nova funcao `handleDownload`:**
- Recebe o `MediaContent` e o evento (para `e.stopPropagation()` e nao abrir o dialog)
- Se for carousel: coleta todas as URLs dos slides via `slides_json`
- Se for imagem/video: usa `asset_url`
- Faz fetch de cada URL, converte para blob
- Adiciona cada blob ao JSZip com nome tipo `slide-1.webp`, `slide-2.webp` (ou `media.webp` para imagem unica)
- Gera o ZIP e dispara download com nome baseado no pillar e content_type (ex: `social-authority-carousel.zip`)
- Mostra toast de loading/sucesso/erro

**Alteracao no card (linha 251-254):**
- Na barra inferior do card (onde esta a data), adicionar o icone `Download` no lado direito
- Manter a data no lado esquerdo
- O container passa a usar `justify-between`
- O icone tera `onClick` com `stopPropagation` para nao abrir o dialog de detalhe
- Estilo: `text-white/30 hover:text-white/60 transition-colors`

Layout final da barra inferior do card:
```text
[ CalendarIcon  MMM d, yyyy          DownloadIcon ]
```

