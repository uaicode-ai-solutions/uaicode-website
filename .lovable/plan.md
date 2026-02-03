
# Plano: Reutilizar BusinessPlanTab na Página Pública

## Problema Atual
A página pública `/planningmysaas/shared/:token` crasha porque:
- O `BusinessPlanTab` usa `useReportContext()`
- Não há `ReportProvider` na rota pública
- O `InvestmentAskCard` precisa de `marketingTotals` do contexto

## Solução Simplificada
Você tem razão - os dados JÁ EXISTEM no banco! Precisamos apenas:
1. Criar um `SharedReportProvider` que carrega os dados via `share_token`
2. Reutilizar **exatamente** o mesmo `BusinessPlanTab`
3. Salvar os `marketingTotals` no momento da geração (para não depender de preços futuros)

## Diagrama da Arquitetura

```text
DASHBOARD (autenticado)              PÁGINA PÚBLICA
────────────────────────             ──────────────────────────
                                     
    ReportProvider                      SharedReportProvider
    ├─ useReport(wizardId)              └─ useSharedReport(token)
    └─ useReportData(wizardId)              │
         │                                  ▼
         ▼                              SELECT * FROM tb_pms_reports
    tb_pms_wizard +                     WHERE share_token = :token
    tb_pms_reports                      AND share_enabled = true
         │                                  │
         ▼                                  ▼
    ReportContext.Provider              SharedReportContext.Provider
    {                                   {
      report,                             report: data.wizard_snapshot,
      reportData,                         reportData: data,
      marketingTotals                     marketingTotals: data.marketing_snapshot
    }                                   }
         │                                  │
         ▼                                  ▼
    BusinessPlanTab ◄───────────────► BusinessPlanTab (MESMO!)
```

## Dados a Salvar no Relatório

Adicionaremos duas novas colunas JSONB em `tb_pms_reports`:

| Coluna | Conteúdo | Origem |
|--------|----------|--------|
| `wizard_snapshot` | Dados do wizard (saas_name, market_type) | tb_pms_wizard |
| `marketing_snapshot` | marketingTotals calculado | tb_pms_mkt_tier (snapshot) |

Isso garante que a página pública mostrará os valores **do momento da geração**, mesmo que os preços mudem depois.

## Implementação

### 1. Migração SQL

Adicionar colunas para snapshots:

```sql
ALTER TABLE public.tb_pms_reports 
ADD COLUMN wizard_snapshot JSONB NULL,
ADD COLUMN marketing_snapshot JSONB NULL;

COMMENT ON COLUMN public.tb_pms_reports.wizard_snapshot IS 
  'Snapshot of wizard data (saas_name, market_type) for public sharing';
COMMENT ON COLUMN public.tb_pms_reports.marketing_snapshot IS 
  'Snapshot of marketingTotals at generation time for public sharing';
```

### 2. Atualizar Orchestrator

No final da geração (após Step 12), salvar os snapshots:

```typescript
// Fetch wizard data
const { data: wizard } = await supabase
  .from("tb_pms_wizard")
  .select("id, saas_name, market_type, industry")
  .eq("id", wizard_id)
  .single();

// Fetch marketing prices
const { data: mktTiers } = await supabase
  .from("tb_pms_mkt_tier")
  .select("uaicode_price_cents, traditional_max_cents")
  .eq("is_active", true);

// Calculate totals
const marketingSnapshot = {
  uaicodeTotal: mktTiers?.reduce((s, t) => s + (t.uaicode_price_cents || 0), 0) || 0,
  traditionalMaxTotal: mktTiers?.reduce((s, t) => s + (t.traditional_max_cents || 0), 0) || 0,
  // ... outros campos calculados
};

// Save snapshots
await supabase.from("tb_pms_reports").update({
  wizard_snapshot: wizard,
  marketing_snapshot: marketingSnapshot,
  status: "completed"
}).eq("wizard_id", wizard_id);
```

### 3. Criar SharedReportContext

Novo arquivo: `src/contexts/SharedReportContext.tsx`

```typescript
import { createContext, useContext, ReactNode } from "react";
import { useSharedReport } from "@/hooks/useSharedReport";

export const SharedReportProvider = ({ 
  shareToken, 
  children 
}: { shareToken: string; children: ReactNode }) => {
  const { data, isLoading, error } = useSharedReport(shareToken);
  
  // Transform shared data into context format
  const value = {
    report: data?.wizard_snapshot,
    reportData: data,
    isLoading,
    error,
    wizardId: data?.wizard_id,
    pmsReportId: data?.id,
    selectedMarketingIds: [],
    setSelectedMarketingIds: () => {},
    marketingTotals: data?.marketing_snapshot || defaultMarketingTotals,
    setMarketingTotals: () => {},
  };
  
  return (
    <SharedReportContext.Provider value={value}>
      {children}
    </SharedReportContext.Provider>
  );
};
```

### 4. Atualizar useReportContext

Modificar para suportar fallback:

```typescript
export const useReportContext = (): ReportContextType => {
  const reportContext = useContext(ReportContext);
  const sharedContext = useContext(SharedReportContext);
  
  // Prefer authenticated context, fallback to shared
  if (reportContext) return reportContext;
  if (sharedContext) return sharedContext;
  
  throw new Error("Must be used within ReportProvider or SharedReportProvider");
};
```

### 5. Atualizar useSharedReport

Retornar todos os dados necessários:

```typescript
export const useSharedReport = (shareToken: string | undefined) => {
  return useQuery({
    queryKey: ["shared-report", shareToken],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tb_pms_reports")
        .select(`
          id, wizard_id, status,
          business_plan_section,
          opportunity_section,
          competitive_analysis_section,
          icp_intelligence_section,
          price_intelligence_section,
          growth_intelligence_section,
          section_investment,
          wizard_snapshot,
          marketing_snapshot
        `)
        .eq("share_token", shareToken)
        .eq("share_enabled", true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!shareToken,
  });
};
```

### 6. Atualizar PmsSharedReport

Usar o Provider e reutilizar BusinessPlanTab:

```typescript
const PmsSharedReport = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  
  if (!shareToken) return <SharedReportError />;

  return (
    <SharedReportProvider shareToken={shareToken}>
      <SharedReportContent />
    </SharedReportProvider>
  );
};

const SharedReportContent = () => {
  const { isLoading, error, report } = useReportContext();
  
  if (isLoading) return <SharedReportSkeleton />;
  if (error) return <SharedReportError />;

  return (
    <div className="min-h-screen bg-background">
      <SharedReportHeader projectName={report?.saas_name} />
      <main className="pt-24 pb-16 max-w-5xl mx-auto px-4">
        <BusinessPlanTab /> {/* MESMO componente! */}
      </main>
      <SharedReportFooter />
    </div>
  );
};
```

## Arquivos a Modificar/Criar

| Arquivo | Ação |
|---------|------|
| Migração SQL | CRIAR - colunas wizard_snapshot e marketing_snapshot |
| `supabase/functions/pms-orchestrate-report/index.ts` | MODIFICAR - salvar snapshots |
| `src/contexts/SharedReportContext.tsx` | CRIAR - provider para página pública |
| `src/contexts/ReportContext.tsx` | MODIFICAR - fallback para shared context |
| `src/hooks/useSharedReport.ts` | MODIFICAR - retornar dados completos |
| `src/pages/PmsSharedReport.tsx` | MODIFICAR - usar Provider + BusinessPlanTab |

## Benefícios

| Aspecto | HTML Estático | JSON + React (Esta solução) |
|---------|---------------|----------------------------|
| Visual | 80% similar | 100% idêntico |
| Gráficos | SVG estático | Recharts interativo |
| Código | Duplicado | Compartilhado |
| Manutenção | Alta | Zero |
| Responsivo | Precisa replicar | Automático |
| Dark mode | Precisa CSS | Automático |

## Ordem de Execução

1. Criar migração SQL (wizard_snapshot, marketing_snapshot)
2. Criar SharedReportContext.tsx
3. Modificar ReportContext.tsx (fallback)
4. Modificar useSharedReport.ts
5. Modificar pms-orchestrate-report (salvar snapshots)
6. Modificar PmsSharedReport.tsx
7. Remover código HTML estático do orchestrator
8. Deploy e regenerar relatório para testar
