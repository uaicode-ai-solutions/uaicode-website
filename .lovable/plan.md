

# Plano: Atualizar Sample Report para Refletir o Produto Real

## Análise do Produto Atual

### Estrutura Real do Dashboard (3 tabs)

| Tab | Nome | Conteúdo |
|-----|------|----------|
| **Report** | Viability Report | 15 seções de análise completa |
| **My Plan** | Business Plan | Documento markdown + gráficos interativos |
| **Next Steps** | Próximos Passos | Agendamento + Kyle AI + CTAs |

### Seções do Report Tab (em ordem)
1. Executive Summary (Verdict + Score)
2. Market Opportunity (TAM/SAM/SOM)
3. Demand Signals
4. Market Timing
5. Customer Pain Points
6. Macro Trends
7. Risk Factors
8. Competitors & Differentiation
9. Marketing Intelligence
10. Investment Required
11. Financial Return (J-Curve)
12. Growth Potential
13. Comparable Successes
14. Execution Plan
15. Why Uaicode

### Tabs REMOVIDOS (v1.0)
- ❌ Marketing (hidden)
- ❌ Branding/Assets (hidden)

---

## Problema Atual do Sample Report

O componente `PmsSampleReport.tsx` mostra:
- ❌ Tab "Brand Assets" (não existe mais)
- ❌ Tab "Competitors" separado (está no Report)
- ❌ Métricas genéricas que não refletem o relatório real
- ❌ Não menciona o Business Plan

---

## Nova Estrutura Proposta

### 3 Tabs Reais

| Tab | Label | Ícone | Preview |
|-----|-------|-------|---------|
| **report** | Viability Report | FileText | Key metrics do relatório |
| **businessplan** | Business Plan | Briefcase | Preview do documento AI |
| **nextsteps** | Next Steps | Rocket | CTAs e benefícios |

### Conteúdo por Tab

#### Tab 1: Viability Report
Métricas que realmente existem no dashboard:
- **Viability Score** (score ring, 0-100)
- **Market Opportunity** (TAM size)
- **Competition Level** (badge)
- **Market Timing** (percentage)
- **Investment Required** (currency)
- **ROI Projection** (percentage)

#### Tab 2: Business Plan
Preview do documento AI-generated:
- **Word Count** (ex: "8,500+ words")
- **Sections** (ex: "10 sections")
- **Charts Included** (ex: "5 interactive")
- **Export Options** (PDF, Share Link)
- Blurred preview de markdown content

#### Tab 3: Next Steps
O que o usuário ganha:
- **AI Consultant** (Kyle chat disponível)
- **Schedule Call** (link Cal.com)
- **Exclusive Discount** (oferta para MVP)
- **Share Report** (link público)

---

## Alterações Técnicas

### Arquivo: `src/components/planningmysaas/PmsSampleReport.tsx`

**Mudanças:**
1. Atualizar array `tabs` para refletir estrutura real
2. Atualizar `tabContent` com métricas do dashboard real
3. Substituir Brand Assets por Business Plan preview
4. Adicionar tab Next Steps com CTAs
5. Manter componentes auxiliares (ScoreRing, MetricCard, etc.)

---

## Nova Estrutura de Código

```text
tabs = [
  { id: "report", label: "Viability Report", icon: FileText },
  { id: "businessplan", label: "Business Plan", icon: Briefcase },
  { id: "nextsteps", label: "Next Steps", icon: Rocket },
]

tabContent = {
  report: {
    title: "Viability Analysis",
    metrics: [
      { label: "Viability Score", value: 87, type: "score" },
      { label: "Market Size (TAM)", value: "$4.2B", type: "text" },
      { label: "Competition", value: "Moderate", type: "badge" },
      { label: "Market Timing", value: 92, type: "percentage" },
      { label: "Investment Required", value: "$15,000", type: "text" },
      { label: "Projected ROI Y1", value: 180, type: "percentage" },
    ]
  },
  businessplan: {
    title: "AI-Generated Business Plan",
    // Layout especial com preview
  },
  nextsteps: {
    title: "What's Included",
    // Layout com benefícios
  }
}
```

---

## Preview Visual (Business Plan Tab)

```text
┌─────────────────────────────────────────┐
│  📄 AI-Generated Business Plan           │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 8,500+  │ │   10    │ │    5    │   │
│  │  Words  │ │Sections │ │ Charts  │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  # Executive Summary              │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │
│  │                                   │  │
│  │  ## Market Analysis               │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │
│  │  [CHART PREVIEW - blurred]        │  │
│  └───────────────────────────────────┘  │
│                                         │
│  📥 Export to PDF    🔗 Share Link      │
│                                         │
└─────────────────────────────────────────┘
```

---

## Preview Visual (Next Steps Tab)

```text
┌─────────────────────────────────────────┐
│  🚀 What's Included                      │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🤖 AI Consultant (Kyle)         │   │
│  │ Ask questions about your report │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📅 Schedule Strategy Call       │   │
│  │ 30-min call with our founder    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 💰 Exclusive MVP Discount       │   │
│  │ Special pricing for report users │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔗 Shareable Public Link        │   │
│  │ Share with investors & partners │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Impacto

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Tabs** | 4 (com Brand Assets) | 3 (estrutura real) |
| **Métricas** | Genéricas | Refletem dashboard |
| **Business Plan** | Não mencionado | Tab dedicado |
| **Next Steps** | Não mostrado | Destaca benefícios |
| **Precisão** | ~40% | 100% |

---

## Arquivos Alterados

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/PmsSampleReport.tsx` | Reescrever tabs e conteúdo |

