

# Plano: Diferenciar os Títulos das Duas Sections

## Análise do Problema

Atualmente temos duas sections com o título idêntico "Lock In Your Discount":

| Section | Localização | Conteúdo | Objetivo no Funil |
|---------|-------------|----------|-------------------|
| NextStepsSection | Linha 322 | Cards de pricing (Flash Deal 25%, Bundle 30%) | **DECISÃO** - Escolher o pacote |
| ScheduleCallSection | Linha 105 | Calendário Cal.com para agendar | **AÇÃO** - Marcar a reunião |

Isso causa **confusão cognitiva** e reduz a taxa de conversão porque o usuário não entende que são duas etapas diferentes.

---

## Estratégia de Marketing: Diferenciar por Etapa do Funil

Do ponto de vista de marketing, cada section representa uma etapa distinta no funil de conversão:

```text
┌────────────────────────────────────────────────────────────────┐
│  FUNIL DE CONVERSÃO                                            │
│                                                                │
│  1. AWARENESS    → (já passou - viu o Report)                  │
│                                                                │
│  2. CONSIDERATION → NextStepsSection                           │
│     "Qual pacote é melhor para mim?"                           │
│     Títuo sugerido: "Choose Your Package"                      │
│                     ou "Pick Your Plan"                        │
│                                                                │
│  3. ACTION        → ScheduleCallSection                        │
│     "Quero garantir meu desconto agora"                        │
│     Título sugerido: "Book Your Call" (mais direto)            │
│                     ou "Schedule & Save" (combina ação+valor)  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Sugestões de Títulos (Opções)

### Para NextStepsSection (Cards de Pricing)

| Opção | Título | Subtítulo | Psicologia |
|-------|--------|-----------|------------|
| A | **Choose Your Package** | Select the plan that fits your goals | Empoderamento - usuário no controle |
| B | **Pick Your Plan** | Limited-time discounts on all packages | Simplicidade + urgência |
| C | **Special Launch Offers** | Exclusive pricing for early founders | Exclusividade + FOMO |
| D | **Exclusive Pricing** | Lock in your discount today | Escassez + valor |

**Recomendação:** Opção A - "Choose Your Package"
- Claro e direto
- Foca na **decisão** que o usuário precisa tomar
- Não compete semanticamente com "Book Your Call"

### Para ScheduleCallSection (Calendário)

| Opção | Título | Subtítulo | Psicologia |
|-------|--------|-----------|------------|
| A | **Book Your Call** | Secure your discount before time runs out | Ação clara + urgência |
| B | **Schedule & Lock In** | Your exclusive discount awaits | Benefício embutido |
| C | **Claim Your Discount** | Book a call to secure your pricing | Foco no ganho |
| D | **Ready? Let's Talk** | Schedule your strategy session | Tom conversacional |

**Recomendação:** Opção A - "Book Your Call"
- Extremamente claro - usuário sabe exatamente o que fazer
- "Book" é uma action word forte
- Combina bem com "Choose Your Package" (Choose → Book)

---

## Fluxo Visual Proposto

```text
Next Steps Tab
│
├── NextStepsSection
│   ├── "Next Steps" (header principal)
│   ├── Viability Score
│   ├── "What happens when you choose Uaicode" (4 cards)
│   └── 🆕 "Choose Your Package" ← ANTES: "Lock In Your Discount"
│       ├── MVP Flash Deal (25% OFF)
│       └── Complete Launch Bundle (30% OFF)
│
├── MeetKyleSection
│   └── "Meet Kyle" (sem mudança)
│
└── ScheduleCallSection
    └── 🆕 "Book Your Call" ← ANTES: "Lock In Your Discount"
        ├── Countdown Timer
        └── Calendário Cal.com
```

---

## Alterações Propostas

### Alteração 1: NextStepsSection.tsx

**Arquivo:** `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx`  
**Linha:** 322

**De:**
```typescript
<h2 className="text-2xl font-bold text-foreground">Lock In Your Discount</h2>
```

**Para:**
```typescript
<h2 className="text-2xl font-bold text-foreground">Choose Your Package</h2>
```

**Subtítulo (linha 327):**

**De:**
```typescript
<p className="text-sm text-muted-foreground">Limited time offers available</p>
```

**Para:**
```typescript
<p className="text-sm text-muted-foreground">Limited-time discounts on all packages</p>
```

---

### Alteração 2: ScheduleCallSection.tsx

**Arquivo:** `src/components/planningmysaas/dashboard/sections/ScheduleCallSection.tsx`  
**Linha:** 105

**De:**
```typescript
<h2 className="text-2xl font-bold text-foreground">Lock In Your Discount</h2>
```

**Para:**
```typescript
<h2 className="text-2xl font-bold text-foreground">Book Your Call</h2>
```

**Subtítulo (linhas 113-115):**

**De:**
```typescript
<p className="text-sm text-muted-foreground">
  Schedule your call now to secure your exclusive discount on {projectName ? `"${projectName}"` : "your project"}
</p>
```

**Para:**
```typescript
<p className="text-sm text-muted-foreground">
  Secure your exclusive discount before time runs out
</p>
```

---

## Resumo de Alterações

| Arquivo | Local | De | Para |
|---------|-------|-----|------|
| NextStepsSection.tsx | Linha 322 | "Lock In Your Discount" | "Choose Your Package" |
| NextStepsSection.tsx | Linha 327 | "Limited time offers available" | "Limited-time discounts on all packages" |
| ScheduleCallSection.tsx | Linha 105 | "Lock In Your Discount" | "Book Your Call" |
| ScheduleCallSection.tsx | Linhas 113-115 | Subtítulo longo | "Secure your exclusive discount before time runs out" |

**Total: 4 linhas modificadas em 2 arquivos**

---

## Arquivos Tocados

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx` | Modificar |
| `src/components/planningmysaas/dashboard/sections/ScheduleCallSection.tsx` | Modificar |

---

## Benefícios de Marketing

1. **Clareza** - Usuário entende que são duas etapas diferentes
2. **Progressão** - Choose → Book cria sensação de avanço no funil
3. **Reduz Fricção** - Menos confusão = maior conversão
4. **Action Words** - "Choose" e "Book" são verbos de ação que motivam cliques

