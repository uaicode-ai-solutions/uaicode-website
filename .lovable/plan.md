
# Plano: Adicionar Aba "Business Plan" no Dashboard

## Objetivo

Criar uma nova aba "Business Plan" no dashboard que renderiza o conteúdo do `business_plan_section` (JSONB) do banco de dados, separada da aba "Report" existente.

---

## 1. Atualização de Tipos (src/types/report.ts)

### 1.1 Adicionar Interfaces para Business Plan

```typescript
// ==========================================
// Business Plan Section (from n8n Business Plan AI pipeline)
// ==========================================

export interface BusinessPlanChartsData {
  market_sizing?: {
    tam: string;
    sam: string;
    som: string;
  };
  financial_projections?: {
    month_6_mrr: string;
    year_1_arr: string;
    year_2_arr: string;
  };
  competitor_pricing?: Array<{
    name: string;
    min_price: number;
    max_price: number;
  }>;
  investment_breakdown?: Array<{
    category: string;
    amount: number;
  }>;
}

export interface BusinessPlanSection {
  title: string;
  subtitle: string;
  generated_at: string;
  viability_score: number;
  viability_label: string;
  markdown_content: string;
  charts_data: BusinessPlanChartsData;
  word_count: number;
}
```

---

## 2. Criar Componente BusinessPlanTab.tsx

**Arquivo:** `src/components/planningmysaas/dashboard/sections/BusinessPlanTab.tsx`

### 2.1 Estrutura Visual

```text
┌─────────────────────────────────────────────────────────────┐
│  Header: Título + Viability Score Badge                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🟡 Promising — Score: 70/100                           │ │
│  └────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Markdown Content (react-markdown + remark-gfm)             │
│                                                             │
│  ├─ ## Executive Summary                                    │
│  │    Texto renderizado...                                  │
│  │                                                          │
│  ├─ ## Market Analysis                                      │
│  │    [CHART:market_sizing] → PieChart (TAM/SAM/SOM)       │
│  │                                                          │
│  ├─ ## Financial Projections                                │
│  │    [CHART:financial_projections] → BarChart             │
│  │                                                          │
│  ├─ ## Competitive Landscape                                │
│  │    [CHART:competitor_pricing] → HorizontalBarChart      │
│  │                                                          │
│  └─ ## Investment Ask                                       │
│       [CHART:investment_breakdown] → DonutChart            │
├─────────────────────────────────────────────────────────────┤
│  Footer: Generated At + Word Count                          │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Funcionalidades

| Feature | Descrição |
|---------|-----------|
| **Viability Badge** | Badge colorido baseado no score (verde 80+, amarelo 60-79, vermelho <60) |
| **Markdown Renderer** | `react-markdown` com `remark-gfm` para tabelas e formatação |
| **Chart Placeholders** | Detecta `[CHART:xxx]` e substitui por componentes Recharts |
| **Custom Styling** | Headings com gradient, tabelas shadcn, blockquotes destacados |
| **Empty State** | Mensagem amigável quando business_plan_section está vazio |

### 2.3 Charts Interativos (Recharts)

| Placeholder | Chart Type | Dados |
|-------------|------------|-------|
| `[CHART:market_sizing]` | Donut Chart | TAM, SAM, SOM com valores em $ |
| `[CHART:financial_projections]` | Bar Chart | MRR Month 6, ARR Year 1, ARR Year 2 |
| `[CHART:competitor_pricing]` | Horizontal Bar | Min/Max price por competidor |
| `[CHART:investment_breakdown]` | Pie Chart | Categorias de investimento |

---

## 3. Integrar Tab no Dashboard

### 3.1 Adicionar Nova Tab (PmsDashboard.tsx)

**Antes:**
```typescript
{[
  { id: "report", label: "Report", icon: FileText },
  // tabs ocultas...
].map((tab) => ...)}
```

**Depois:**
```typescript
{[
  { id: "report", label: "Report", icon: FileText },
  { id: "businessplan", label: "Business Plan", icon: Briefcase },
].map((tab) => ...)}
```

### 3.2 Import do Ícone

```typescript
import { Briefcase } from "lucide-react"; // Adicionar ao import
```

### 3.3 Renderização Condicional

```typescript
{activeTab === "businessplan" && <BusinessPlanTab />}
```

---

## 4. Fluxo de Dados

```text
┌──────────────────┐
│  tb_pms_reports  │
│                  │
│ business_plan_   │
│ section (JSONB)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ ReportContext    │
│                  │
│ reportData.      │
│ business_plan_   │
│ section          │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│ BusinessPlanTab                   │
│                                   │
│ const bp = reportData?.           │
│   business_plan_section as        │
│   BusinessPlanSection             │
│                                   │
│ - bp.title                        │
│ - bp.viability_score              │
│ - bp.markdown_content             │
│ - bp.charts_data                  │
└──────────────────────────────────┘
```

---

## 5. Arquivos a Criar/Modificar

| Ação | Arquivo | Descrição |
|------|---------|-----------|
| **Modificar** | `src/types/report.ts` | Adicionar `BusinessPlanSection` e `BusinessPlanChartsData` |
| **Criar** | `src/components/planningmysaas/dashboard/sections/BusinessPlanTab.tsx` | Componente principal da aba |
| **Modificar** | `src/pages/PmsDashboard.tsx` | Adicionar tab "Business Plan" e renderização |

---

## 6. Detalhes Técnicos

### 6.1 Parsing Markdown com Charts Inline

```typescript
const renderContentWithCharts = (markdown: string, chartsData: BusinessPlanChartsData) => {
  // Split pelo padrão [CHART:xxx]
  const parts = markdown.split(/(\[CHART:\w+\])/g);
  
  return parts.map((part, index) => {
    const chartMatch = part.match(/\[CHART:(\w+)\]/);
    if (chartMatch) {
      const chartType = chartMatch[1];
      return <ChartRenderer key={index} type={chartType} data={chartsData} />;
    }
    // Markdown normal
    return <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>{part}</ReactMarkdown>;
  });
};
```

### 6.2 Viability Score Badge

```typescript
const getViabilityStyle = (score: number) => {
  if (score >= 80) return {
    bg: "bg-green-500/20",
    border: "border-green-500/30",
    text: "text-green-400"
  };
  if (score >= 60) return {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
    text: "text-yellow-400"
  };
  return {
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    text: "text-red-400"
  };
};
```

### 6.3 Custom Markdown Components

```typescript
const markdownComponents = {
  h1: ({ children }) => <h1 className="text-3xl font-bold text-gradient-gold">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold text-foreground border-b pb-2">{children}</h2>,
  table: ({ children }) => <Table>{children}</Table>,
  blockquote: ({ children }) => (
    <div className="p-4 rounded-xl bg-accent/10 border-l-4 border-accent">
      {children}
    </div>
  ),
};
```

---

## 7. Estilo Visual (Padrão Premium UaiCode)

- **Header:** Gradient `bg-accent/20`, border `border-accent/30`
- **Cards:** `glass-card` com `border-accent/20`
- **Charts:** Cores amber/gold (`#F59E0B`, `#D97706`)
- **Typography:** `text-gradient-gold` para títulos principais
- **Spacing:** `space-y-8` entre seções

---

## Resumo da Implementação

| Step | Ação |
|------|------|
| 1 | Adicionar tipagem `BusinessPlanSection` em `report.ts` |
| 2 | Criar `BusinessPlanTab.tsx` com markdown + charts |
| 3 | Adicionar tab "Business Plan" no array de tabs do dashboard |
| 4 | Adicionar renderização condicional `{activeTab === "businessplan" && ...}` |
| 5 | Testar end-to-end com dados reais |

Ao aprovar, implementarei todos os arquivos necessários.
