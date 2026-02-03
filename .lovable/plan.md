

# Plano: Criar Business Plan Estruturado (Zero Markdown da IA)

## Conceito

Substituir o Business Plan baseado em markdown por uma **UI estruturada fixa** que:
1. Busca **todos os dados direto do banco** (já existem nas JSONB columns)
2. Usa a IA **apenas para 2-3 parágrafos narrativos** (Executive Summary e Strategic Verdict)
3. Reaproveita os **componentes visuais já existentes** no projeto

## Arquitetura Proposta

```text
ANTES (atual):
┌─────────────────────────────────────────────────────┐
│  IA gera ~3500 palavras de markdown + charts_data  │
│  ↓                                                  │
│  Frontend parseia markdown e renderiza             │
│  ↓                                                  │
│  Problema: truncamento, lentidão, inconsistências  │
└─────────────────────────────────────────────────────┘

DEPOIS (proposto):
┌─────────────────────────────────────────────────────┐
│  IA gera APENAS:                                    │
│  - executive_narrative (~150 palavras)             │
│  - strategic_verdict (~100 palavras)               │
│  - key_recommendations (3-5 bullet points)         │
│  ↓                                                  │
│  Frontend busca TODOS os dados do banco            │
│  e renderiza em componentes visuais fixos          │
│  ↓                                                  │
│  Resultado: rápido, consistente, sem truncamento   │
└─────────────────────────────────────────────────────┘
```

## Seções do Business Plan Estruturado

| Seção | Fonte de Dados | Componente Visual |
|-------|----------------|-------------------|
| 1. Executive Snapshot | `opportunity_section` + `growth_intelligence_section` | Grid 4x3 de KPIs |
| 2. Executive Narrative | IA (novo campo `ai_narrative`) | Card com texto |
| 3. Market Analysis | `opportunity_section` (TAM/SAM/SOM, trends) | Cards + Chart |
| 4. Competitive Landscape | `competitive_analysis_section` | Competitor Cards (já existe!) |
| 5. Target Customer | `icp_intelligence_section` | Persona Card (já existe!) |
| 6. Business Model | `price_intelligence_section` | Pricing Tiers Table |
| 7. Financial Projections | `growth_intelligence_section.financial_metrics` | J-Curve + Metrics |
| 8. Investment Ask | `section_investment` | Investment Breakdown (já existe!) |
| 9. Strategic Verdict | IA (novo campo `ai_verdict`) | Callout Card |

## Estrutura do Novo `business_plan_section` JSONB

Simplificado para conter apenas o que a IA gera:

```typescript
interface BusinessPlanSection {
  // Metadata
  generated_at: string;
  viability_score: number;
  viability_label: string;
  
  // AI-generated narratives only (~400 tokens total)
  ai_executive_narrative: string;  // ~150 palavras
  ai_strategic_verdict: string;    // ~100 palavras
  ai_key_recommendations: string[];  // 3-5 bullet points
  
  // Optional: AI-generated one-liners for each section
  ai_section_insights?: {
    market_insight?: string;      // 1 frase sobre o mercado
    competition_insight?: string; // 1 frase sobre competição
    customer_insight?: string;    // 1 frase sobre ICP
    financial_insight?: string;   // 1 frase sobre finanças
  };
}
```

## Novo Componente: BusinessPlanStructured.tsx

```typescript
// Estrutura do componente principal
const BusinessPlanStructured = () => {
  const { reportData, report } = useReportContext();
  const financialMetrics = useFinancialMetrics(reportData, report?.market_type);
  
  // Parse all JSONB sections (já existe!)
  const opportunity = reportData?.opportunity_section;
  const competitive = reportData?.competitive_analysis_section;
  const icp = reportData?.icp_intelligence_section;
  const pricing = reportData?.price_intelligence_section;
  const growth = reportData?.growth_intelligence_section;
  const investment = reportData?.section_investment;
  const businessPlan = reportData?.business_plan_section;
  
  return (
    <div className="space-y-8">
      {/* 1. Executive Snapshot - KPI Grid */}
      <ExecutiveSnapshotCard 
        opportunity={opportunity}
        growth={growth}
        investment={investment}
        viabilityScore={businessPlan?.viability_score}
      />
      
      {/* 2. Executive Narrative - AI Generated */}
      <ExecutiveNarrativeCard 
        narrative={businessPlan?.ai_executive_narrative}
      />
      
      {/* 3. Market Analysis - Data from DB */}
      <MarketAnalysisCard 
        opportunity={opportunity}
      />
      
      {/* 4. Competitive Landscape - Reuse existing component */}
      <CompetitiveLandscapeCard 
        competitive={competitive}
      />
      
      {/* 5. Target Customer - Reuse existing ICP Card */}
      <TargetCustomerCard 
        icp={icp}
      />
      
      {/* 6. Business Model - Pricing from DB */}
      <BusinessModelCard 
        pricing={pricing}
      />
      
      {/* 7. Financial Projections - Reuse J-Curve */}
      <FinancialProjectionsCard 
        growth={growth}
        metrics={financialMetrics}
      />
      
      {/* 8. Investment Ask - Reuse existing section */}
      <InvestmentAskCard 
        investment={investment}
      />
      
      {/* 9. Strategic Verdict - AI Generated */}
      <StrategicVerdictCard 
        verdict={businessPlan?.ai_strategic_verdict}
        recommendations={businessPlan?.ai_key_recommendations}
      />
    </div>
  );
};
```

## Arquivos a Criar/Modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/types/report.ts` | Modificar | Simplificar `BusinessPlanSection` interface |
| `src/components/planningmysaas/dashboard/sections/BusinessPlanTab.tsx` | Reescrever | Nova estrutura fixa |
| `src/components/planningmysaas/dashboard/businessplan/ExecutiveSnapshotCard.tsx` | Criar | Grid de KPIs |
| `src/components/planningmysaas/dashboard/businessplan/ExecutiveNarrativeCard.tsx` | Criar | Texto da IA |
| `src/components/planningmysaas/dashboard/businessplan/MarketAnalysisCard.tsx` | Criar | TAM/SAM/SOM + trends |
| `src/components/planningmysaas/dashboard/businessplan/CompetitiveLandscapeCard.tsx` | Criar | Wrapper do CompetitorsDifferentiationSection |
| `src/components/planningmysaas/dashboard/businessplan/TargetCustomerCard.tsx` | Criar | Wrapper do ICP Card |
| `src/components/planningmysaas/dashboard/businessplan/BusinessModelCard.tsx` | Criar | Pricing tiers |
| `src/components/planningmysaas/dashboard/businessplan/FinancialProjectionsCard.tsx` | Criar | J-Curve + metrics |
| `src/components/planningmysaas/dashboard/businessplan/InvestmentAskCard.tsx` | Criar | Investment breakdown |
| `src/components/planningmysaas/dashboard/businessplan/StrategicVerdictCard.tsx` | Criar | Verdict + recommendations |

## Novo System Prompt da IA (Ultra-Simples)

```text
You are a Business Strategist. Generate ONLY strategic narratives for a SaaS business plan.

Return valid JSON with EXACTLY these fields:

{
  "generated_at": "February 3, 2026",
  "viability_score": 66,
  "viability_label": "Promising",
  "ai_executive_narrative": "string (150 words max - compelling overview)",
  "ai_strategic_verdict": "string (100 words max - Go/No-Go recommendation)",
  "ai_key_recommendations": ["string array - 3-5 actionable next steps"],
  "ai_section_insights": {
    "market_insight": "string (1 sentence)",
    "competition_insight": "string (1 sentence)",
    "customer_insight": "string (1 sentence)",
    "financial_insight": "string (1 sentence)"
  }
}

RULES:
- Write for investors and executives
- Be data-driven and specific
- Use confident, decisive language
- Maximum 400 words total
- Return ONLY valid JSON
```

## Benefícios

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Tokens IA | ~12,000 | ~600 |
| Tempo geração | 4-6 min | 15-30 seg |
| Risco truncamento | Alto | Zero |
| Consistência dados | Baixa (IA duplica) | 100% (DB único) |
| Manutenibilidade | Difícil (markdown) | Fácil (componentes) |
| Investor-ready layout | Irregular | Fixo e profissional |

## Compatibilidade com PDF Export

O export de PDF será adaptado para usar a mesma estrutura:

```typescript
// businessPlanPdfExport.ts - Nova versão
const exportBusinessPlanToPdf = (
  reportData: ReportData,
  report: ReportRow,
  metrics: FinancialMetrics
) => {
  // Seção 1: Executive Snapshot (tabela de KPIs)
  // Seção 2: AI Narrative (texto simples)
  // Seção 3: Market Analysis (TAM/SAM/SOM tabela)
  // ... etc
  
  // Tudo vem do DB, mesma fonte da UI
};
```

## Compatibilidade com Public Shared Report

O `SharedReportContent.tsx` também será atualizado para usar a estrutura fixa, garantindo que relatórios compartilhados tenham o mesmo visual profissional.

## Checklist de Implementacao

1. [ ] Simplificar interface `BusinessPlanSection` em `types/report.ts`
2. [ ] Criar pasta `src/components/planningmysaas/dashboard/businessplan/`
3. [ ] Criar componente `ExecutiveSnapshotCard` (grid 4x3 de KPIs)
4. [ ] Criar componente `ExecutiveNarrativeCard` (texto AI)
5. [ ] Criar componente `MarketAnalysisCard` (TAM/SAM/SOM + chart)
6. [ ] Criar componente `CompetitiveLandscapeCard` (wrapper)
7. [ ] Criar componente `TargetCustomerCard` (wrapper ICP)
8. [ ] Criar componente `BusinessModelCard` (pricing tiers)
9. [ ] Criar componente `FinancialProjectionsCard` (J-Curve)
10. [ ] Criar componente `InvestmentAskCard` (breakdown)
11. [ ] Criar componente `StrategicVerdictCard` (verdict + recommendations)
12. [ ] Reescrever `BusinessPlanTab.tsx` para usar novos componentes
13. [ ] Atualizar `SharedReportContent.tsx` para mesma estrutura
14. [ ] Atualizar `businessPlanPdfExport.ts` para nova estrutura
15. [ ] Atualizar prompt da IA no n8n (simplificado)
16. [ ] Testar com wizard_id existente
17. [ ] Validar PDF export

