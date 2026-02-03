

# Plano: Corrigir Step 4 e Gerar Nova Imagem Step 5

## Problemas Identificados

1. **Step 4** - O título não foi alterado. Ainda está "Download Your Brand Kit", deveria ser "Download Your Launch Plan"
2. **Step 5** - A imagem `pms-step-launch.webp` não segue o mesmo padrão visual das outras imagens (pms-step-idea, pms-step-analysis, pms-step-report, pms-step-brand)

---

## Alterações

### 1. Corrigir Título e Descrição do Step 4

**Arquivo:** `src/components/planningmysaas/PmsHowItWorks.tsx`

**De:**
```typescript
{
  icon: Palette,
  step: 4,
  title: "Download Your Brand Kit",
  description: "Get your logo, colors, mockups, and landing page suggestion — ready to use.",
  image: stepBrand,
},
```

**Para:**
```typescript
{
  icon: FileText, // Trocar ícone para FileText (documento/plano)
  step: 4,
  title: "Download Your Launch Plan",
  description: "Get your complete business plan, financial projections, and go-to-market strategy.",
  image: stepBrand, // Manter imagem existente ou gerar nova
},
```

---

### 2. Gerar Nova Imagem para Step 5

A imagem atual do Step 5 não segue o padrão das outras. As imagens existentes (pms-step-idea, analysis, report, brand) seguem um estilo consistente de:
- Screenshots de dashboard/interface
- Tema escuro com acentos amber/gold
- Mockups de UI profissionais

**Prompt para nova imagem Step 5:**
> "Dark theme SaaS dashboard screenshot showing MVP development progress tracker, similar style to the other step images, with amber/gold accent colors, showing timeline with milestones, rocket icon, progress bars at 85%, professional UI mockup, clean modern interface design matching pms-step-analysis and pms-step-report style"

---

### 3. Atualizar Imports (se trocar ícone)

**De:**
```typescript
import { Lightbulb, BarChart3, FileText, Palette, Rocket } from "lucide-react";
```

Manter, pois `FileText` já está importado.

---

## Resumo das Alterações

| Step | Título Atual | Título Novo | Ícone |
|------|-------------|-------------|-------|
| 4 | Download Your Brand Kit | **Download Your Launch Plan** | FileText |
| 5 | Launch Your MVP | Launch Your MVP (manter) | Rocket |

| Imagem | Ação |
|--------|------|
| Step 5 (`pms-step-launch.webp`) | **Regenerar** seguindo o padrão visual das outras imagens |

---

## Código Final do Step 4

```typescript
{
  icon: FileText,
  step: 4,
  title: "Download Your Launch Plan",
  description: "Get your complete business plan, financial projections, and go-to-market strategy.",
  image: stepBrand,
},
```

---

## Impacto

- **Linhas alteradas:** ~5 linhas
- **Imagem regenerada:** 1 (Step 5)
- **Ícones:** Trocar Palette → FileText no Step 4

