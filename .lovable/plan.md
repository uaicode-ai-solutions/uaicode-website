

# Plano: Ajustar Cores do Step 5 para Padrão UaiCode

## Análise das Cores Corretas (Steps 1-4)

| Elemento | Cor Correta |
|----------|-------------|
| **Fundo** | Degradê #1A1A1A → #2D2D2D (cinza escuro) |
| **Acentos primários** | Amber #F59E0B (botões, highlights) |
| **Textos dourados** | Gold #FCD34D (títulos, linhas) |
| **Cards/Interface** | Cinza #1F1F1F a #262626 |
| **Bordas** | Amber sutil #F59E0B/30 |

---

## Problema Atual

A imagem do Step 5 atual usa:
- ❌ Tons laranja/bronze mais avermelhados
- ❌ Dourado com saturação diferente
- ❌ Não combina com o amber puro das outras imagens

---

## Solução

Regenerar a imagem forçando explicitamente as cores UaiCode:

**Prompt otimizado com cores forçadas:**
> "3D isometric dark theme SaaS dashboard mockup floating on dark gradient background from #1A1A1A to #2D2D2D, angled perspective like a tablet tilted in 3D space, showing MVP launch timeline with progress bars and milestones, include a stylized flat 2D rocket icon taking off from the dashboard, USE ONLY THESE EXACT COLORS: amber #F59E0B for buttons and primary accents, gold #FCD34D for text highlights and lines, dark gray #1F1F1F for cards, NO orange, NO bronze, NO red tones, pure amber/gold only matching UaiCode brand colors, clean minimalist interface design, subtle amber #F59E0B glow effects, professional dark analytics dashboard style"

---

## Especificações Técnicas

**Arquivo:** `src/assets/pms-step-launch.webp`

**Cores obrigatórias:**
```
Primary Accent: #F59E0B (amber-500)
Secondary: #FCD34D (amber-300)
Background: #1A1A1A → #2D2D2D gradient
Cards: #1F1F1F to #262626
```

**Elementos a manter:**
- ✅ Foguete estilizado 2D
- ✅ Perspectiva 3D isométrica
- ✅ Dashboard com timeline/progress bars
- ✅ Dimensões 1200x800

---

## Impacto

- **Arquivos alterados:** 1 (imagem)
- **Visual:** Cores 100% consistentes com Steps 1-4
- **Funcionalidade:** Nenhuma alteração de código

