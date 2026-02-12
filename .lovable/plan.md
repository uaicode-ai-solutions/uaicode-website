

# Adicionar InfoTooltips em Todos os Elementos do Business Plan

## Situacao Atual

Apenas 2 dos 9 componentes do Business Plan usam `InfoTooltip`:
- **InvestmentAskCard**: 1 tooltip no titulo
- **JCurveChart**: 1 tooltip no titulo

O **ExecutiveSnapshotCard** usa `title=` (tooltip nativo do browser, estilo diferente e inconsistente).

Os outros 6 componentes nao tem nenhum tooltip.

## Plano de Implementacao

### 1. ExecutiveSnapshotCard
- Substituir `title={metric.tooltip}` por `InfoTooltip` em cada metrica (TAM, SAM, SOM, CAGR, Y1 ARR, LTV/CAC, Payback, Break-even, Investment, Savings, ROI Y1, ROI Y2)
- Adicionar InfoTooltip no titulo "Executive Snapshot"
- Adicionar InfoTooltip no badge de Viability Score
- Textos explicativos em linguagem acessivel para cada metrica

### 2. ExecutiveNarrativeCard
- Adicionar InfoTooltip no titulo "Executive Summary" explicando que e um resumo gerado por IA
- Adicionar InfoTooltip no bloco de "market insight"

### 3. MarketAnalysisCard
- InfoTooltip no titulo "Market Analysis"
- InfoTooltip nos cards TAM, SAM, SOM com explicacoes claras
- InfoTooltip no CAGR
- InfoTooltip em "Key Market Trends"

### 4. CompetitiveLandscapeCard
- InfoTooltip no titulo "Competitive Landscape"
- InfoTooltip no badge "market share"
- InfoTooltip no badge "threat level"
- InfoTooltip no "Score" de cada competidor

### 5. TargetCustomerCard
- InfoTooltip no titulo "Target Customer"
- InfoTooltip em "Company Size", "Industry", "Budget", "Decision Time"
- InfoTooltip em "Top Pain Points"
- InfoTooltip nos badges de urgencia (High/Medium/Low)

### 6. BusinessModelCard
- InfoTooltip no titulo "Business Model"
- InfoTooltip em "Recommended ARPU"
- InfoTooltip em "Pricing Model"
- InfoTooltip em "Market Position"
- InfoTooltip em "Market Average"

### 7. FinancialProjectionsCard
- InfoTooltip no titulo "Financial Projections"
- InfoTooltip em "Year 1 ARR", "Year 2 ARR", "Break-even", "LTV/CAC"
- InfoTooltip em "ROI Year 1" e "ROI Year 2"

### 8. StrategicVerdictCard
- InfoTooltip no titulo "Strategic Verdict"
- InfoTooltip no badge de viability label
- InfoTooltip em "Next Steps"

## Detalhes Tecnicos

Todos os tooltips usarao o componente `InfoTooltip` existente (`src/components/ui/info-tooltip.tsx`) que ja segue o padrao visual UaiCode (amber/gold). Cada tooltip tera texto explicativo curto e acessivel, sem jargao tecnico.

### Arquivos Editados
- `src/components/planningmysaas/dashboard/businessplan/ExecutiveSnapshotCard.tsx`
- `src/components/planningmysaas/dashboard/businessplan/ExecutiveNarrativeCard.tsx`
- `src/components/planningmysaas/dashboard/businessplan/MarketAnalysisCard.tsx`
- `src/components/planningmysaas/dashboard/businessplan/CompetitiveLandscapeCard.tsx`
- `src/components/planningmysaas/dashboard/businessplan/TargetCustomerCard.tsx`
- `src/components/planningmysaas/dashboard/businessplan/BusinessModelCard.tsx`
- `src/components/planningmysaas/dashboard/businessplan/FinancialProjectionsCard.tsx`
- `src/components/planningmysaas/dashboard/businessplan/StrategicVerdictCard.tsx`

### Impacto na Tela Compartilhavel
Como a tela compartilhavel reutiliza o `BusinessPlanTab` (que renderiza todos esses componentes), os tooltips aparecerao automaticamente na versao publica tambem.

