

# Plano: Regenerar Imagem Step 5 com Cores Padronizadas

## Análise do Padrão Visual

As imagens dos Steps 1-4 seguem um estilo visual consistente:

| Característica | Padrão Existente |
|----------------|------------------|
| **Perspectiva** | 3D isométrica (inclinado) |
| **Fundo** | Preto/cinza muito escuro (#0A0A0A) |
| **Cores de destaque** | Apenas amber/gold (#F59E0B, #FCD34D) |
| **Estilo UI** | Dashboard flat/2D em mockup |
| **Elementos** | Sem objetos 3D realistas (sem foguetes, etc) |

## Problema da Imagem Atual (Step 5)

A imagem `pms-step-launch.webp` atual tem:
- ❌ Visualização frontal (não isométrica)
- ❌ Foguete 3D realista
- ❌ Cores laranja e variações além do amber
- ❌ Fundo cinza mais claro

## Solução

Regenerar a imagem usando um prompt específico para seguir exatamente o padrão visual.

**Prompt otimizado:**
> "3D isometric dark theme SaaS dashboard mockup floating on pure black background, angled perspective like a tablet tilted in 3D space, showing MVP launch timeline with progress bars and milestones, ONLY amber and gold accent colors (#F59E0B), no realistic 3D objects, flat UI design, clean minimalist interface, matching the style of a dark analytics dashboard with golden highlights, subtle amber glow effects, no rocket icons, no gradients to orange, pure amber/gold only"

## Alteração

**Arquivo:** `src/assets/pms-step-launch.webp`

**Ação:** Regenerar imagem com:
1. Perspectiva 3D isométrica (device inclinado)
2. Fundo preto puro
3. Apenas cores amber/gold (#F59E0B, #FCD34D)
4. UI flat/dashboard sem elementos 3D realistas
5. Tema de "launch/progress" com barras de progresso e timeline

## Impacto

- **Arquivos alterados:** 1 (imagem)
- **Visual:** Consistência completa entre os 5 steps
- **Funcionalidade:** Nenhuma alteração de código

