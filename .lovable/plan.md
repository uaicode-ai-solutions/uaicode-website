
# Plano: HTML Estático Completo - Réplica do Business Plan

## Objetivo
Criar um HTML estático que seja uma **réplica fiel** da tela de Business Plan, incluindo todos os 9 cards, todos os dados e representações visuais dos gráficos.

## Diagnóstico Detalhado

### Problemas Atuais do Template HTML

| Problema | Causa | Impacto |
|----------|-------|---------|
| TAM/SAM/SOM vazios | Template busca `opp.tam_value` mas DB tem string como `"$38.50B"` | Mostra "..." |
| Revenue/Users vazios | Template busca `growth.projected_revenue_year1` mas DB tem `financial_metrics.arr_year_1` | Mostra "..." |
| Competitors vazio | Template trata como array mas DB tem objeto `{ competitor_1: {...} }` | Lista vazia |
| Pain Points `[object Object]` | Template usa `painPoint` direto mas DB tem `{ pain_point: "texto" }` | Texto ilegível |
| ICP Title genérico | Template busca `icp.title` mas DB tem `persona.name` | Mostra "Target Customer" |
| Pricing Tiers vazio | Template busca `pricing.tiers` mas DB tem `recommended_tiers` | Seção omitida |
| Sem gráfico J-Curve | Template não gera visualização | Seção incompleta |
| Sem gráfico Market Sizing | Template não gera donut chart | Seção incompleta |

### Estrutura Real dos Dados (do SELECT que fizemos)

```text
opportunity_section:
├── tam_value: "$38.50B" (string formatada)
├── tam_value_numeric: 38500000000 (número)
├── sam_value: "$5.21B"
├── som_value: "$360K"
├── market_growth_rate: "15.5%"
├── macro_trends: [{ trend: "...", impact: "..." }]

growth_intelligence_section:
├── financial_metrics:
│   ├── arr_year_1: 240000 (número)
│   ├── arr_year_1_formatted: "$240K"
│   ├── arr_year_2: 580000
│   ├── break_even_months: 18
│   ├── mrr_month_12: 20000
│   ├── roi_year_1: -45
│   ├── roi_year_1_formatted: "-45%"
│   └── ltv_cac_ratio: 3.2
├── customer_metrics:
│   ├── customers_month_12: 1000
│   └── customers_month_24: 2500
├── financial_scenarios: [{ name: "Conservative", mrrMonth12: ..., breakEvenMonths: ... }]
└── year_evolution: [{ year: "Y1", arr: "$240K", arrNumeric: 240000 }]

competitive_analysis_section:
├── competitors: { competitor_1: {...}, competitor_2: {...} }
│   └── competitor_1:
│       ├── saas_app_name: "Competitor Name"
│       ├── saas_app_positioning: "Description"
│       ├── saas_app_price_range: "$50-200/mo"
│       └── priority_score: "high"

icp_intelligence_section:
├── persona:
│   ├── name: "Sarah Mitchell"
│   ├── job_title: "VP of Operations"
│   └── company_size: "50-200 employees"
├── pain_points: [{ pain_point: "texto", urgency_level: "high", intensity_score: 92 }]
├── demographics:
│   ├── industry: "Healthcare"
│   └── company_size: "SMB"
├── buying_triggers: ["trigger1", "trigger2"]
└── budget_timeline:
    ├── typical_budget: "$5K-15K/year"
    └── decision_timeline: "2-4 weeks"

price_intelligence_section:
├── recommended_tiers: [{ name: "Starter", price_monthly: 49, features: [...] }]
├── recommended_model: "Freemium + Subscription"
├── price_positioning: "Mid-market"
├── unit_economics:
│   └── recommended_arpu: 149
└── market_overview:
    └── market_average_price: 89

section_investment:
├── investment_one_payment_cents: 15990000 (= $159,900)
├── traditional_min_cents: 35000000
├── traditional_max_cents: 75000000
└── savings_percentage: 67

business_plan_section:
├── viability_score: 78
├── viability_label: "Promising"
├── ai_executive_narrative: "Strategic overview text..."
├── ai_strategic_verdict: "Go recommendation..."
├── ai_key_recommendations: ["Rec 1", "Rec 2", "Rec 3"]
└── ai_section_insights:
    ├── market_insight: "..."
    ├── competition_insight: "..."
    └── financial_insight: "..."
```

## Arquitetura da Solução

### Seções a Renderizar (9 Cards)

| # | Seção | Componente Original | Dados Principais |
|---|-------|---------------------|------------------|
| 1 | Executive Snapshot | `ExecutiveSnapshotCard` | TAM/SAM/SOM, CAGR, Y1 ARR, LTV/CAC, Payback, Break-even, Investment, Savings, ROI Y1/Y2, Viability Score |
| 2 | Executive Narrative | `ExecutiveNarrativeCard` | `ai_executive_narrative`, `market_insight` |
| 3 | Market Analysis | `MarketAnalysisCard` | TAM/SAM/SOM com descrições, CAGR, Macro Trends, **Donut Chart (SVG)** |
| 4 | Competitive Landscape | `CompetitiveLandscapeCard` | Até 4 competitors com nome, posicionamento, preço, score |
| 5 | Target Customer | `TargetCustomerCard` | Persona (name, job_title), Demographics (company_size, industry, budget, decision_time), Pain Points, Buying Triggers |
| 6 | Business Model | `BusinessModelCard` | ARPU, Pricing Model, Market Position, até 3 Pricing Tiers com features |
| 7 | Financial Projections | `FinancialProjectionsCard` | Y1/Y2 ARR, Break-even, LTV/CAC, ROI Y1/Y2, **J-Curve (SVG static)** |
| 8 | Investment Ask | `InvestmentAskCard` | MVP Only (com savings), MVP + Marketing Bundle (com total e serviços) |
| 9 | Strategic Verdict | `StrategicVerdictCard` | Viability Score circle, Label, Verdict text, Key Recommendations |

### Representação de Gráficos (SVG Estático)

Para substituir os gráficos interativos Recharts:

1. **Donut Chart (TAM/SAM/SOM)**: SVG inline com 3 arcos proporcionais em cores amber
2. **J-Curve Chart**: SVG com 3 paths (Conservative/Realistic/Optimistic) mostrando a trajetória

```text
SVG Donut Chart (Market Sizing)
┌─────────────────────────────────────┐
│            ████████████             │
│         ███           ███           │
│       ██    TAM $38.5B  ██          │
│      █                    █         │
│     █   SAM $5.2B ████     █        │
│     █               ███    █        │
│      █   SOM $360K ██     █         │
│       ██               ██           │
│         ███         ███             │
│            ████████████             │
└─────────────────────────────────────┘

SVG J-Curve Chart (Simplified)
┌─────────────────────────────────────┐
│  $                    ╱╱ Optimistic │
│  +              ╱╱╱╱╱╱              │
│              ╱╱╱                    │
│  --------╱╱╱-------- Break-even    │
│       ╲╲╲            ╱╱╱ Realistic  │
│  -     ╲╲╲        ╱╱╱               │
│          ╲╲╲╲╲╱╱╱ Conservative      │
│              M0  M12  M24  M36  M60 │
└─────────────────────────────────────┘
```

## Implementação Técnica

### Modificações em `pms-orchestrate-report/index.ts`

#### 1. Corrigir Extração de Dados

```typescript
// OPPORTUNITY - Usar valores já formatados ou numéricos
const tam = opp.tam_value || formatCurrency(opp.tam_value_numeric);
const sam = opp.sam_value || formatCurrency(opp.sam_value_numeric);
const som = opp.som_value || formatCurrency(opp.som_value_numeric);
const cagr = opp.market_growth_rate || formatPercent(opp.market_growth_rate_numeric);

// GROWTH - Acessar financial_metrics nested
const fm = (growth.financial_metrics || {}) as Record<string, unknown>;
const arrY1 = fm.arr_year_1_formatted || formatCurrency(fm.arr_year_1);
const arrY2 = fm.arr_year_2_formatted || formatCurrency(fm.arr_year_2);
const breakEven = fm.break_even_months ? `${fm.break_even_months} mo` : "...";
const roiY1 = fm.roi_year_1_formatted || formatPercent(fm.roi_year_1);
const roiY2 = fm.roi_year_2_formatted || formatPercent(fm.roi_year_2);
const ltvCac = fm.ltv_cac_ratio ? `${Number(fm.ltv_cac_ratio).toFixed(1)}x` : "...";

// CUSTOMER METRICS
const cm = (growth.customer_metrics || {}) as Record<string, unknown>;
const customersY1 = cm.customers_month_12 ? Number(cm.customers_month_12).toLocaleString() : "...";

// COMPETITORS - Converter objeto para array
const competitorsObj = (comp.competitors || {}) as Record<string, unknown>;
const competitorsList = Object.keys(competitorsObj)
  .filter(k => k.startsWith("competitor_"))
  .map(k => competitorsObj[k] as Record<string, unknown>)
  .slice(0, 4);

// ICP - Acessar nested persona e demographics
const persona = (icp.persona || icp.primary_personas?.[0] || {}) as Record<string, unknown>;
const demographics = (icp.demographics || {}) as Record<string, unknown>;
const icpName = persona.name || persona.persona_name || "Target Customer";
const icpJobTitle = persona.job_title || persona.role || "";
const companySize = persona.company_size || demographics.company_size || "";
const industry = persona.industry_focus || demographics.industry || "";

// PAIN POINTS - Mapear objetos para strings
const rawPainPoints = Array.isArray(icp.pain_points) ? icp.pain_points : [];
const painPoints = rawPainPoints.map((p: any) => 
  typeof p === "string" ? p : (p.pain_point || "")
).filter(Boolean);

// PRICING - Usar recommended_tiers
const pricingTiers = Array.isArray(pricing.recommended_tiers) 
  ? pricing.recommended_tiers 
  : [];
const recommendedArpu = pricing.unit_economics?.recommended_arpu;
const pricingModel = pricing.recommended_model;
const pricePositioning = pricing.price_positioning;

// SCENARIOS - Para J-Curve
const scenarios = Array.isArray(growth.financial_scenarios) 
  ? growth.financial_scenarios 
  : [];
```

#### 2. Adicionar Funções SVG para Gráficos

```typescript
// Gerar SVG Donut Chart
function generateDonutChartSvg(tam: string, sam: string, som: string): string {
  // Valores normalizados para proporções visuais (não precisam ser exatos)
  // TAM = anel externo completo
  // SAM = ~15% do TAM
  // SOM = ~1% do TAM
  return `
    <svg viewBox="0 0 200 200" class="sr-chart" style="width: 100%; max-width: 250px; height: auto;">
      <defs>
        <linearGradient id="tamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#D97706;stop-opacity:0.3" />
        </linearGradient>
        <linearGradient id="samGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:#D97706;stop-opacity:0.6" />
        </linearGradient>
        <linearGradient id="somGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFBD17;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:1" />
        </linearGradient>
      </defs>
      <!-- TAM outer ring -->
      <circle cx="100" cy="100" r="90" fill="none" stroke="url(#tamGrad)" stroke-width="15"/>
      <!-- SAM middle ring -->
      <circle cx="100" cy="100" r="70" fill="none" stroke="url(#samGrad)" stroke-width="15"/>
      <!-- SOM inner filled -->
      <circle cx="100" cy="100" r="45" fill="url(#somGrad)"/>
      <!-- Center text -->
      <text x="100" y="95" text-anchor="middle" fill="#fff" font-size="12" font-weight="600">SOM</text>
      <text x="100" y="112" text-anchor="middle" fill="#FFBD17" font-size="11">${som}</text>
    </svg>
    <div class="sr-chart-legend">
      <div class="sr-legend-item"><span class="sr-legend-dot" style="background: rgba(245,158,11,0.3);"></span>TAM: ${tam}</div>
      <div class="sr-legend-item"><span class="sr-legend-dot" style="background: rgba(245,158,11,0.6);"></span>SAM: ${sam}</div>
      <div class="sr-legend-item"><span class="sr-legend-dot" style="background: #FFBD17;"></span>SOM: ${som}</div>
    </div>
  `;
}

// Gerar SVG J-Curve Simplificado
function generateJCurveSvg(
  investment: number,
  scenarios: Array<{ name: string; breakEvenMonths: number; mrrMonth12: number }>
): string {
  if (scenarios.length < 3) return "";
  
  const conservative = scenarios.find(s => s.name === "Conservative");
  const realistic = scenarios.find(s => s.name === "Realistic" || s.name === "Base");
  const optimistic = scenarios.find(s => s.name === "Optimistic");
  
  if (!conservative || !realistic || !optimistic) return "";
  
  // Simplified paths representing cumulative cash flow over 60 months
  return `
    <svg viewBox="0 0 400 200" class="sr-chart" style="width: 100%; height: auto; min-height: 180px;">
      <!-- Grid -->
      <line x1="40" y1="100" x2="380" y2="100" stroke="rgba(255,255,255,0.2)" stroke-dasharray="4"/>
      
      <!-- Y Axis labels -->
      <text x="35" y="30" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="10">+</text>
      <text x="35" y="105" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="10">0</text>
      <text x="35" y="180" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="10">-</text>
      
      <!-- X Axis labels -->
      <text x="40" y="195" fill="rgba(255,255,255,0.5)" font-size="9">M0</text>
      <text x="125" y="195" fill="rgba(255,255,255,0.5)" font-size="9">M12</text>
      <text x="210" y="195" fill="rgba(255,255,255,0.5)" font-size="9">M24</text>
      <text x="295" y="195" fill="rgba(255,255,255,0.5)" font-size="9">M36</text>
      <text x="365" y="195" fill="rgba(255,255,255,0.5)" font-size="9">M60</text>
      
      <!-- Conservative path (dashed gray) -->
      <path d="M40,160 Q150,175 200,120 T380,40" fill="none" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4 2"/>
      
      <!-- Realistic path (solid amber - highlighted) -->
      <path d="M40,160 Q130,170 180,105 T380,25" fill="none" stroke="#F59E0B" stroke-width="3"/>
      
      <!-- Optimistic path (solid green) -->
      <path d="M40,160 Q110,160 150,90 T380,15" fill="none" stroke="#10B981" stroke-width="2"/>
      
      <!-- Legend -->
      <g transform="translate(50, 15)">
        <line x1="0" y1="0" x2="20" y2="0" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4 2"/>
        <text x="25" y="4" fill="rgba(255,255,255,0.6)" font-size="9">Conservative</text>
        
        <line x1="100" y1="0" x2="120" y2="0" stroke="#F59E0B" stroke-width="3"/>
        <text x="125" y="4" fill="#F59E0B" font-size="9" font-weight="600">Realistic</text>
        
        <line x1="195" y1="0" x2="215" y2="0" stroke="#10B981" stroke-width="2"/>
        <text x="220" y="4" fill="rgba(255,255,255,0.6)" font-size="9">Optimistic</text>
      </g>
    </svg>
    
    <div class="sr-jcurve-footer">
      <div class="sr-scenario-card sr-scenario-conservative">
        <div class="sr-scenario-label">Conservative</div>
        <div class="sr-scenario-value">Break-even M${conservative.breakEvenMonths}</div>
      </div>
      <div class="sr-scenario-card sr-scenario-realistic">
        <div class="sr-scenario-label">Realistic</div>
        <div class="sr-scenario-value">Break-even M${realistic.breakEvenMonths}</div>
      </div>
      <div class="sr-scenario-card sr-scenario-optimistic">
        <div class="sr-scenario-label">Optimistic</div>
        <div class="sr-scenario-value">Break-even M${optimistic.breakEvenMonths}</div>
      </div>
    </div>
  `;
}
```

#### 3. Adicionar CSS Completo

```css
/* J-Curve Footer */
.sr-jcurve-footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
}
.sr-scenario-card {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}
.sr-scenario-conservative {
  background: rgba(148,163,184,0.1);
  border: 1px solid rgba(148,163,184,0.3);
}
.sr-scenario-realistic {
  background: rgba(245,158,11,0.15);
  border: 1px solid rgba(245,158,11,0.4);
}
.sr-scenario-optimistic {
  background: rgba(16,185,129,0.1);
  border: 1px solid rgba(16,185,129,0.3);
}
.sr-scenario-label {
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 4px;
}
.sr-scenario-value {
  font-size: 14px;
  font-weight: 600;
}
.sr-scenario-realistic .sr-scenario-label { color: #F59E0B; }
.sr-scenario-realistic .sr-scenario-value { color: #FFBD17; }
.sr-scenario-optimistic .sr-scenario-value { color: #10B981; }
.sr-scenario-conservative .sr-scenario-value { color: #94A3B8; }

/* Chart Legend */
.sr-chart-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
}
.sr-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}
.sr-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
```

#### 4. Renderizar Todos os 9 Cards

O template será reescrito para incluir:

1. **Executive Snapshot**: Grid 4x3 com todas as 12 métricas (TAM, SAM, SOM, CAGR, Y1 ARR, LTV/CAC, Payback, Break-even, Investment, Savings, ROI Y1, ROI Y2) + Viability Badge
2. **Executive Narrative**: Texto AI + insight box
3. **Market Analysis**: TAM/SAM/SOM cards com descrições + Donut Chart SVG + CAGR highlight + Macro Trends list
4. **Competitive Landscape**: Grid 2x2 de competitor cards com nome, positioning, preço, score, priority badge
5. **Target Customer**: Persona header + Demographics grid (4 items) + Pain Points list + Buying Triggers badges
6. **Business Model**: ARPU/Model/Position cards + Pricing Tiers grid (até 3) com features
7. **Financial Projections**: Metrics grid (Y1/Y2 ARR, Break-even, LTV/CAC) + J-Curve SVG + ROI cards
8. **Investment Ask**: MVP Only card + MVP+Marketing Bundle card com breakdown completo
9. **Strategic Verdict**: Score circle + Label + Verdict text + Recommendations list

---

## Arquivos a Modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `supabase/functions/pms-orchestrate-report/index.ts` | **MODIFICAR** | Reescrever `generateBusinessPlanHtml()` com extração correta e 9 seções completas |

---

## Ordem de Execução

1. Atualizar função `formatCurrency()` para aceitar strings pré-formatadas
2. Corrigir extração de todos os campos JSONB conforme estrutura real
3. Criar funções `generateDonutChartSvg()` e `generateJCurveSvg()`
4. Reescrever template HTML com todas as 9 seções completas
5. Adicionar CSS inline para novos componentes (gráficos, scenarios, legends)
6. Deploy da edge function
7. Regenerar relatório para testar

---

## Resultado Esperado

Após implementação:
- HTML mostrará **todos** os dados visíveis na tela de Business Plan
- Gráficos serão representados como SVG estático (visualmente similares)
- Métricas financeiras exibirão valores reais (não "...")
- Competitors, Pain Points, Pricing Tiers renderizados corretamente
- Tamanho estimado: ~60-80KB de HTML

