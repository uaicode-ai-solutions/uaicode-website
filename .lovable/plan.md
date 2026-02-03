

# Plano: Expandir "How It Works" para 5 Steps

## Objetivo

Transformar a seção de 4 steps para 5 steps:
- **Step 4 (novo):** "Download Your Launch Plan" - focado no business plan/plano de lançamento
- **Step 5 (novo):** "Start Building Your MVP" - senso de urgência para começar o desenvolvimento

---

## Alterações

### Arquivo: `src/components/planningmysaas/PmsHowItWorks.tsx`

**1. Atualizar array de steps:**

```typescript
const steps = [
  {
    icon: Lightbulb,
    step: 1,
    title: "Describe Your Idea",
    description: "Tell us about your SaaS concept, target audience, and goals in a simple form.",
    image: stepIdea,
  },
  {
    icon: BarChart3,
    step: 2,
    title: "AI Market Analysis",
    description: "Our AI analyzes market size, trends, competitors, and opportunities in real-time.",
    image: stepAnalysis,
  },
  {
    icon: FileText,
    step: 3,
    title: "Get Your Full Report",
    description: "Receive a comprehensive validation report with actionable, data-backed insights.",
    image: stepReport,
  },
  {
    icon: Palette,
    step: 4,
    title: "Download Your Brand Kit",
    description: "Get your logo, colors, mockups, and landing page suggestion — ready to use.",
    image: stepBrand,
  },
  // NOVO STEP 5
  {
    icon: Rocket,
    step: 5,
    title: "Launch Your MVP",
    description: "Your validated idea is ready. Start building with our partner network — spots are limited!",
    image: stepLaunch, // Nova imagem a ser gerada
    isUrgent: true, // Flag especial para destacar urgência
  },
];
```

**2. Atualizar header:**

De: `"in 4 Simple Steps"` → Para: `"in 5 Simple Steps"`

**3. Adicionar destaque visual para Step 5 (urgência):**

O Step 5 terá estilo diferenciado:
- Badge "Limited Spots" pulsando
- Borda com gradiente amber mais intenso
- CTA button integrado ao step

---

## Novas Imagens Necessárias

| Step | Título Atual | Título Novo | Imagem |
|------|-------------|-------------|--------|
| 4 | Download Your Brand Kit | Download Your Brand Kit | `pms-step-brand.webp` (manter) |
| 5 | — (novo) | Launch Your MVP | **Gerar nova imagem** |

**Imagem Step 5 - Sugestão de prompt:**
> "Modern dashboard showing MVP development timeline with rocket launch countdown, dark theme with amber/gold accents, SaaS startup aesthetic, showing progress bars and milestones"

---

## Código do Step 5 com Urgência

```typescript
{/* Step 5 - Special Urgent Style */}
{step.isUrgent && (
  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/30">
    <div className="flex items-center gap-2 mb-2">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
      </span>
      <span className="text-sm font-semibold text-amber-400">Limited spots this month</span>
    </div>
    <p className="text-sm text-muted-foreground">
      First 10 founders get 25% off MVP development →
    </p>
  </div>
)}
```

---

## Alternativas para Step 5 (Título + Descrição)

**Opção A - Foco em Urgência:**
- **Título:** "Launch Your MVP"
- **Descrição:** "Your validated idea is ready. Start building with our partner network — spots are limited!"

**Opção B - Foco em Velocidade:**
- **Título:** "Build in 4 Weeks"
- **Descrição:** "Go from validated idea to working MVP. Our AI-accelerated development gets you to market faster."

**Opção C - Foco em Oferta:**
- **Título:** "Claim Your MVP Discount"
- **Descrição:** "Validated founders get exclusive access to our MVP development program — limited spots available."

---

## Estrutura Final dos 5 Steps

```text
Step 1: Describe Your Idea          (Lightbulb)    - Entrada do wizard
Step 2: AI Market Analysis          (BarChart3)    - Processamento AI
Step 3: Get Your Full Report        (FileText)     - Entrega do relatório
Step 4: Download Your Brand Kit     (Palette)      - Assets visuais
Step 5: Launch Your MVP             (Rocket)       - CTA com urgência ⚡
```

---

## Impacto

- **Linhas adicionadas:** ~30 linhas
- **Nova imagem:** 1 (step 5 - launch/MVP)
- **Componentes:** Nenhum novo, apenas expansão do array

---

## Próximos Passos (Implementação)

1. Gerar imagem para Step 5 usando AI image generation
2. Adicionar novo step ao array
3. Atualizar header "4 → 5 Steps"
4. Adicionar estilo de urgência ao Step 5

