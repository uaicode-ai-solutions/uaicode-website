
# Plano: Atualizar FAQ do PlanningMySaas

## Objetivo

Atualizar as perguntas e respostas do FAQ para refletir exatamente o que o produto oferece hoje, removendo referências a features que não existem mais (logos, mockups, brand assets) e ajustando para o modelo gratuito.

---

## Problemas Atuais no FAQ

| # | FAQ Atual | Problema |
|---|-----------|----------|
| 1 | "Complex analyses for the Enterprise tier may take up to 15 minutes" | **Não existe mais Enterprise tier** - o produto é 100% free |
| 3 | "Can I edit the logo and colors after generation?" | **Não geramos mais logos** - brand assets foram removidos |
| 4 | "Can I use the assets commercially?" | **Não geramos mais assets** - logos, mockups não existem |
| 6 | "Each purchase validates one idea" | **Não há mais purchase** - o produto é gratuito |

---

## Novas FAQs Propostas

Baseado no que o app realmente oferece (3 tabs: Report, My Plan, Next Steps):

| # | Pergunta | Resposta |
|---|----------|----------|
| 1 | **How long does it take to generate my report?** | Most reports are generated within 5 minutes. Our AI analyzes your idea in real-time, compiling comprehensive market insights, financial projections, and a complete business plan. |
| 2 | **What's included in my validation report?** | You receive a complete package: viability score (0-100), market size analysis (TAM/SAM/SOM), competitor intelligence, customer pain points, risk assessment, financial projections, and a full AI-generated business plan. |
| 3 | **Where does the market data come from?** | We aggregate data from multiple reliable sources including industry reports, public databases, and real-time market trends. Our AI cross-references this data to provide accurate, up-to-date insights. |
| 4 | **Is my idea kept confidential?** | Absolutely. Your idea and all submitted information are encrypted and never shared. We take confidentiality seriously and have strict data protection policies in place. |
| 5 | **Can I share my report with investors or partners?** | Yes! Each report includes a shareable public link that you can send to investors, co-founders, or advisors. You can also export your business plan as a PDF. |
| 6 | **Can I validate multiple ideas?** | Yes, you can create unlimited reports — it's completely free. Each idea gets its own dedicated dashboard with full analysis. |
| 7 | **Who is Kyle and how can he help me?** | Kyle is your AI business consultant available in the "Next Steps" tab. He can answer questions about your report, explain metrics, and provide strategic advice based on your specific analysis. |
| 8 | **Is PlanningMySaas really free?** | Yes, 100% free with no hidden costs. You get the same comprehensive validation that traditional consulting firms charge $10,000+ for — viability analysis, business plan, financials, and AI consultant access. |

---

## Alterações Técnicas

### Arquivo: `src/components/planningmysaas/PmsFaq.tsx`

Substituir o array `faqs` (linhas 10-35) pelo novo conteúdo:

```typescript
const faqs = [
  {
    question: "How long does it take to generate my report?",
    answer: "Most reports are generated within 5 minutes. Our AI analyzes your idea in real-time, compiling comprehensive market insights, financial projections, and a complete business plan.",
  },
  {
    question: "What's included in my validation report?",
    answer: "You receive a complete package: viability score (0-100), market size analysis (TAM/SAM/SOM), competitor intelligence, customer pain points, risk assessment, financial projections, and a full AI-generated business plan.",
  },
  {
    question: "Where does the market data come from?",
    answer: "We aggregate data from multiple reliable sources including industry reports, public databases, and real-time market trends. Our AI cross-references this data to provide accurate, up-to-date insights.",
  },
  {
    question: "Is my idea kept confidential?",
    answer: "Absolutely. Your idea and all submitted information are encrypted and never shared. We take confidentiality seriously and have strict data protection policies in place.",
  },
  {
    question: "Can I share my report with investors or partners?",
    answer: "Yes! Each report includes a shareable public link that you can send to investors, co-founders, or advisors. You can also export your business plan as a PDF.",
  },
  {
    question: "Can I validate multiple ideas?",
    answer: "Yes, you can create unlimited reports — it's completely free. Each idea gets its own dedicated dashboard with full analysis.",
  },
  {
    question: "Who is Kyle and how can he help me?",
    answer: "Kyle is your AI business consultant available in the \"Next Steps\" tab. He can answer questions about your report, explain metrics, and provide strategic advice based on your specific analysis.",
  },
  {
    question: "Is PlanningMySaas really free?",
    answer: "Yes, 100% free with no hidden costs. You get the same comprehensive validation that traditional consulting firms charge $10,000+ for — viability analysis, business plan, financials, and AI consultant access.",
  },
];
```

---

## Comparativo: Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Quantidade de FAQs** | 6 | 8 |
| **Referência a logos/assets** | ❌ Sim (incorreto) | ✅ Removido |
| **Referência a payment/purchase** | ❌ Sim (incorreto) | ✅ Removido |
| **Referência a Enterprise tier** | ❌ Sim (incorreto) | ✅ Removido |
| **Menciona Kyle AI** | ❌ Não | ✅ Sim |
| **Menciona share/PDF export** | ❌ Não | ✅ Sim |
| **Destaca que é FREE** | ❌ Não | ✅ Sim |
| **Precisão** | ~50% | 100% |

---

## Arquivo Alterado

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/PmsFaq.tsx` | Substituir array `faqs` (linhas 10-35) |
