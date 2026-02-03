

# Plano: Corrigir Imagem Step 5 - Foguete, Tamanho e Fundo Degradê

## Problemas Identificados

A imagem atual do Step 5 (`pms-step-launch.webp`) precisa de ajustes:

| Problema | Correção Necessária |
|----------|---------------------|
| **Foguete ausente** | Adicionar ícone de foguete estilizado (flat/2D, não realista) |
| **Tamanho incorreto** | Ajustar para dimensões consistentes com outras imagens |
| **Fundo sem degradê** | Aplicar gradiente sutil como nas outras imagens |

---

## Padrão Visual das Outras Imagens

Baseado nas imagens existentes (Steps 1-4):

- **Fundo**: Degradê sutil do preto (#0A0A0A) para cinza escuro, não fundo sólido
- **Elementos**: Ícones flat/2D representando o conceito do step
- **Perspectiva**: 3D isométrica com device inclinado
- **Dimensões**: Aproximadamente 1200x800px ou similar

---

## Solução

Regenerar a imagem com prompt otimizado:

**Prompt corrigido:**
> "3D isometric dark theme SaaS dashboard mockup floating on dark gradient background (black to dark gray), angled perspective like a tablet tilted in 3D space, showing MVP launch timeline with progress bars and milestones, include a stylized flat 2D rocket icon taking off from the dashboard, amber and gold accent colors (#F59E0B, #FCD34D), clean minimalist interface design, subtle amber glow effects, gradient background from #0A0A0A to #1A1A1A, matching the style of a premium dark analytics dashboard"

---

## Alteração

**Arquivo:** `src/assets/pms-step-launch.webp`

**Especificações:**
1. ✅ Foguete estilizado flat/2D (não realista 3D)
2. ✅ Fundo com degradê preto → cinza escuro
3. ✅ Perspectiva 3D isométrica
4. ✅ Cores amber/gold (#F59E0B, #FCD34D)
5. ✅ Dimensões consistentes com outras imagens

---

## Impacto

- **Arquivos alterados:** 1 (imagem)
- **Visual:** Consistência completa entre os 5 steps
- **Funcionalidade:** Nenhuma alteração de código

