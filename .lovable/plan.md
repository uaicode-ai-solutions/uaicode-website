

# Plano: Recriar Todas as 5 Imagens dos Steps com Paleta UaiCode

## Paleta de Cores Oficial UaiCode (Extraída do index.css)

| Variável CSS | HSL | Hex Aproximado | Uso |
|--------------|-----|----------------|-----|
| `--background` | 0 0% 0% | #000000 | Fundo principal (preto puro) |
| `--card` / `--muted` | 202 9% 15% | #22272A | Cards, áreas secundárias (cinza escuro) |
| `--accent` / `--uai-gold` | 45 100% 55% | #EAAB08 | Cor de destaque principal (dourado) |
| `--uai-gold-dark` | 38 100% 50% | #E69500 | Dourado mais escuro (gradientes) |
| `--foreground` | 0 0% 100% | #FFFFFF | Textos, elementos brancos |

**Gradiente oficial:**
```css
--gradient-dark: linear-gradient(180deg, #000000, #22272A)
```

---

## Problema Identificado

As cores usadas nas imagens anteriores incluíam:
- ❌ Azul que não existe na paleta
- ❌ Laranja avermelhado em vez de dourado puro
- ❌ Fundos com tons incorretos

---

## Solução

Recriar todas as 5 imagens usando um prompt unificado que force EXATAMENTE as cores da paleta UaiCode:

### Especificações para Todas as Imagens

**Dimensões:** 1200 x 800 pixels
**Formato:** WebP
**Estilo:** 3D isométrico, dashboard mockup flutuando

**Cores Mandatórias (copiar exatamente):**
- Background: Gradiente de preto #000000 para cinza escuro #22272A
- Cards/Interface: Cinza #22272A a #1A1F22
- Destaque primário: Dourado #EAAB08 (botões, progress bars, ícones ativos)
- Destaque secundário: Dourado claro #FCD34D (textos, linhas, highlights)
- Textos: Branco #FFFFFF

**Proibido:**
- Azul em qualquer tom
- Laranja/vermelho
- Verde
- Roxo
- Qualquer cor fora da paleta dourado/cinza/preto/branco

---

## 5 Imagens a Criar

### Step 1 - Describe Your Idea
**Arquivo:** `src/assets/pms-step-idea.webp`

**Prompt:**
> "3D isometric dark theme SaaS form mockup floating on gradient background from pure black #000000 to dark gray #22272A, angled perspective like a tablet tilted in 3D space, showing a clean form with input fields for idea description, include a stylized flat 2D lightbulb icon glowing, STRICTLY USE ONLY THESE COLORS: gold #EAAB08 for buttons and input focus states, gold-light #FCD34D for text highlights, dark gray #22272A for cards, pure black #000000 for background, white #FFFFFF for text, NO blue, NO orange, NO red, NO purple, NO green, ONLY gold/gray/black/white palette, clean minimalist interface, subtle gold glow effects"

---

### Step 2 - AI Market Analysis
**Arquivo:** `src/assets/pms-step-analysis.webp`

**Prompt:**
> "3D isometric dark theme analytics dashboard mockup floating on gradient background from pure black #000000 to dark gray #22272A, angled perspective, showing bar charts pie charts and market data visualizations, include a stylized flat 2D chart/graph icon, STRICTLY USE ONLY THESE COLORS: gold #EAAB08 for chart bars and data points, gold-light #FCD34D for trend lines and highlights, dark gray #22272A for cards and panels, pure black #000000 for background, white #FFFFFF for labels, NO blue, NO orange, NO red, NO purple, NO green, ONLY gold/gray/black/white palette, professional data visualization style, subtle gold accents"

---

### Step 3 - Get Your Full Report
**Arquivo:** `src/assets/pms-step-report.webp`

**Prompt:**
> "3D isometric dark theme report document mockup floating on gradient background from pure black #000000 to dark gray #22272A, angled perspective, showing a comprehensive report with sections metrics and insights, include a stylized flat 2D document/file icon, STRICTLY USE ONLY THESE COLORS: gold #EAAB08 for section headers and key metrics, gold-light #FCD34D for highlights and scores, dark gray #22272A for document background, pure black #000000 for main background, white #FFFFFF for text content, NO blue, NO orange, NO red, NO purple, NO green, ONLY gold/gray/black/white palette, clean professional report layout"

---

### Step 4 - Download Your Launch Plan
**Arquivo:** `src/assets/pms-step-brand.webp`

**Prompt:**
> "3D isometric dark theme business plan dashboard mockup floating on gradient background from pure black #000000 to dark gray #22272A, angled perspective, showing financial projections go-to-market timeline and strategic plan sections, include a stylized flat 2D download/document icon, STRICTLY USE ONLY THESE COLORS: gold #EAAB08 for timeline progress and key indicators, gold-light #FCD34D for milestone markers and highlights, dark gray #22272A for cards, pure black #000000 for background, white #FFFFFF for text, NO blue, NO orange, NO red, NO purple, NO green, ONLY gold/gray/black/white palette, executive business plan aesthetic"

---

### Step 5 - Launch Your MVP
**Arquivo:** `src/assets/pms-step-launch.webp`

**Prompt:**
> "3D isometric dark theme MVP launch dashboard mockup floating on gradient background from pure black #000000 to dark gray #22272A, angled perspective, showing launch timeline with progress bars milestones and deployment status, include a stylized flat 2D rocket icon taking off, STRICTLY USE ONLY THESE COLORS: gold #EAAB08 for progress bars and active states, gold-light #FCD34D for completion indicators and rocket trail, dark gray #22272A for dashboard cards, pure black #000000 for background, white #FFFFFF for labels, NO blue, NO orange, NO red, NO purple, NO green, ONLY gold/gray/black/white palette, clean launch dashboard style, subtle gold glow on rocket"

---

## Arquivos Alterados

| Arquivo | Ação |
|---------|------|
| `src/assets/pms-step-idea.webp` | Recriar com paleta UaiCode |
| `src/assets/pms-step-analysis.webp` | Recriar com paleta UaiCode |
| `src/assets/pms-step-report.webp` | Recriar com paleta UaiCode |
| `src/assets/pms-step-brand.webp` | Recriar com paleta UaiCode |
| `src/assets/pms-step-launch.webp` | Recriar com paleta UaiCode |

---

## Impacto

- **Arquivos alterados:** 5 imagens
- **Visual:** Consistência 100% com a paleta de cores UaiCode
- **Funcionalidade:** Nenhuma alteração de código necessária

