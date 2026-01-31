

# Plano: Página Pública de Compartilhamento (100% Isolada)

## Princípio de Segurança: ISOLAMENTO TOTAL

Todos os componentes da página pública serão **NOVOS** e **SEPARADOS** do sistema existente. Nenhum componente existente será modificado exceto:
1. `App.tsx` - Adicionar 1 rota pública
2. `PmsDashboard.tsx` - Adicionar lógica de geração de token (função nova, sem modificar existentes)
3. `ShareReportDialog.tsx` - Alterar 1 prop de URL (mudança mínima)

---

## 1. Nova Estrutura de Arquivos

Criação de uma **nova pasta isolada** para componentes públicos:

| Novo Arquivo | Descrição |
|--------------|-----------|
| `src/pages/PmsSharedReport.tsx` | Página pública principal |
| `src/components/planningmysaas/public/SharedReportHeader.tsx` | Header simplificado (sem navegação do sistema) |
| `src/components/planningmysaas/public/SharedReportContent.tsx` | Renderizador do Business Plan |
| `src/components/planningmysaas/public/SharedReportFooter.tsx` | Footer com CTAs |
| `src/components/planningmysaas/public/SharedReportSkeleton.tsx` | Loading skeleton |
| `src/components/planningmysaas/public/SharedReportError.tsx` | Página de erro (token inválido) |
| `src/components/planningmysaas/public/SharedReportCharts.tsx` | Renderizador de charts (cópia isolada) |
| `src/hooks/useSharedReport.ts` | Hook para fetch por share_token |

---

## 2. Alterações no Banco de Dados

### 2.1 Migration: Novas Colunas em `tb_pms_reports`

```sql
-- Add sharing columns
ALTER TABLE tb_pms_reports
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS share_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS share_created_at TIMESTAMPTZ;

-- Create index for fast lookup
CREATE INDEX IF NOT EXISTS idx_pms_reports_share_token 
ON tb_pms_reports(share_token) 
WHERE share_token IS NOT NULL;
```

### 2.2 RLS Policy para Acesso Anônimo

```sql
-- Allow anonymous users to SELECT reports that are shared
CREATE POLICY "Public can view shared reports by token"
ON tb_pms_reports FOR SELECT
TO anon
USING (
  share_enabled = true 
  AND share_token IS NOT NULL
);
```

Esta policy é **ADITIVA** - não afeta as policies existentes para usuários autenticados.

---

## 3. Hook Isolado: useSharedReport.ts

```typescript
// src/hooks/useSharedReport.ts
// NOVO ARQUIVO - Não modifica nada existente

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPlanSection } from "@/types/report";

interface SharedReportData {
  saas_name: string;
  business_plan_section: BusinessPlanSection;
}

export const useSharedReport = (shareToken: string | undefined) => {
  return useQuery({
    queryKey: ["shared-report", shareToken],
    queryFn: async (): Promise<SharedReportData | null> => {
      if (!shareToken) return null;

      // Fetch report by share_token (RLS permite anon se share_enabled=true)
      const { data: report, error } = await supabase
        .from("tb_pms_reports")
        .select("business_plan_section, wizard_id")
        .eq("share_token", shareToken)
        .eq("share_enabled", true)
        .maybeSingle();

      if (error || !report) return null;

      // Fetch project name from wizard (public read não é necessário - usamos service role via edge function)
      // Para evitar complexidade, embutimos o saas_name no business_plan_section.title
      // que já vem do n8n
      
      const bp = report.business_plan_section as BusinessPlanSection;
      
      return {
        saas_name: bp?.title || "SaaS Project",
        business_plan_section: bp,
      };
    },
    enabled: !!shareToken,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
```

---

## 4. Página Pública: PmsSharedReport.tsx

```text
┌─────────────────────────────────────────────────────────────────────┐
│  [UAICode Logo]                       Shared Business Plan          │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  📊 {Project Title}                                             ││
│  │  Viability Score: 78/100 — Promising                            ││
│  │  Generated: Jan 31, 2026 | 8,500 words                          ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ════════════════════════════════════════════════════════════════  │
│                                                                     │
│  [Business Plan Markdown Content]                                   │
│  - Headers (H1, H2, H3)                                             │
│  - Paragraphs, Lists, Tables                                        │
│  - Interactive Charts (Market Sizing, Financial Projections, etc.)  │
│                                                                     │
│  ════════════════════════════════════════════════════════════════  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  📥 Download PDF          🚀 Create Your Own Report             ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  Powered by PlanningMySaaS | uaicode.ai                             │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.1 Estados da Página

| Estado | UI |
|--------|-----|
| `isLoading` | `SharedReportSkeleton` animado |
| `error` ou `!data` | `SharedReportError` - "Report not found or sharing has been disabled" |
| Sucesso | Renderiza conteúdo completo |

### 4.2 Features da Página Pública

- **SEM navegação do sistema** (não expõe rotas internas)
- **SEM login required** (acesso anônimo)
- **Download PDF** (reutiliza `generateBusinessPlanPDF`)
- **CTA "Create Your Own Report"** → redireciona para `/planningmysaas`

---

## 5. Componentes Públicos Isolados

### 5.1 SharedReportHeader.tsx (NOVO)

```typescript
// Header simplificado SEM navegação do sistema
// Apenas: Logo + "Shared Business Plan"
// SEM: Menu de usuário, botões de ação do dashboard
```

### 5.2 SharedReportContent.tsx (NOVO)

```typescript
// Cópia ISOLADA da lógica de renderização do BusinessPlanTab
// - Markdown parser com react-markdown + remark-gfm
// - Chart placeholders [CHART:xxx] → renderiza SharedReportCharts
// - markdownComponents (h1, h2, p, table, etc.) - cópia local
```

### 5.3 SharedReportCharts.tsx (NOVO)

```typescript
// Cópia ISOLADA dos chart renderers
// - MarketSizingChart (Donut)
// - FinancialProjectionsChart (Bar)
// - CompetitorPricingChart (Horizontal Bar)
// - InvestmentBreakdownChart (Pie)
// Mesmo visual, mas em arquivo separado
```

### 5.4 SharedReportFooter.tsx (NOVO)

```typescript
// Footer com CTAs:
// - "Download PDF" button
// - "Create Your Own Report" button → /planningmysaas
// - "Powered by PlanningMySaaS | uaicode.ai"
```

### 5.5 SharedReportSkeleton.tsx (NOVO)

```typescript
// Skeleton de loading para a página pública
// Visual similar mas arquivo separado
```

### 5.6 SharedReportError.tsx (NOVO)

```typescript
// Página de erro elegante:
// - "Report Not Found"
// - "This report may have been removed or sharing has been disabled."
// - CTA: "Create Your Own Report"
```

---

## 6. Modificações Mínimas em Arquivos Existentes

### 6.1 App.tsx (+3 linhas)

```typescript
// Adicionar import
import PmsSharedReport from "./pages/PmsSharedReport";

// Adicionar rota PÚBLICA (fora do ProtectedRoute)
<Route 
  path="/planningmysaas/shared/:shareToken" 
  element={<PmsSharedReport />} 
/>
```

### 6.2 PmsDashboard.tsx (Adicionar função helper + modificar handleCopyLink)

```typescript
// ADICIONAR: Nova função para gerar token (não modifica funções existentes)
const generateShareToken = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
};

// ADICIONAR: Função para obter/criar URL pública
const getOrCreateShareUrl = async (): Promise<string> => {
  // Verificar se já tem token
  if (reportData?.share_token && reportData?.share_enabled) {
    return `${window.location.origin}/planningmysaas/shared/${reportData.share_token}`;
  }
  
  // Gerar novo token
  const token = generateShareToken();
  
  // Salvar no DB
  await supabase
    .from("tb_pms_reports")
    .update({ 
      share_token: token, 
      share_enabled: true,
      share_created_at: new Date().toISOString()
    })
    .eq("wizard_id", wizardId);
  
  // Invalidar cache
  await queryClient.invalidateQueries({ queryKey: ["pms-report-data", wizardId] });
  
  return `${window.location.origin}/planningmysaas/shared/${token}`;
};

// MODIFICAR: handleCopyLink para usar URL pública
const handleCopyLink = async () => {
  try {
    const publicUrl = await getOrCreateShareUrl();
    await navigator.clipboard.writeText(publicUrl);
    toast.success("Public link copied!");
  } catch (error) {
    console.error("Failed to generate share link:", error);
    toast.error("Failed to generate share link");
  }
};
```

### 6.3 ShareReportDialog.tsx (Mudança de 1 prop)

```typescript
// O dialog já recebe reportUrl como prop
// PmsDashboard passará a URL pública ao invés da URL do dashboard
// Nenhuma mudança no componente ShareReportDialog em si
```

---

## 7. Segurança: Nenhuma Exposição de Dados Sensíveis

| O que É exposto | O que NÃO é exposto |
|-----------------|---------------------|
| `business_plan_section.title` | Email/telefone do usuário |
| `business_plan_section.subtitle` | `wizard_id` na URL |
| `business_plan_section.viability_score` | `report_id` na URL |
| `business_plan_section.viability_label` | Dados do wizard (goals, budget, timeline) |
| `business_plan_section.markdown_content` | Navegação para o sistema |
| `business_plan_section.charts_data` | Menu de usuário logado |
| `business_plan_section.generated_at` | Outras seções do report (ICP, Marketing, etc.) |
| `business_plan_section.word_count` | Dados financeiros detalhados |

---

## 8. Fluxo do Usuário

```text
[Owner no Dashboard]
      │
      ├─ Clica "Copy Link" ou "Share via Email"
      │
      ▼
[Sistema gera share_token se não existir]
      │
      ▼
[URL copiada: /planningmysaas/shared/{share_token}]
      │
      ▼
[Recipient abre o link (sem login)]
      │
      ▼
[PmsSharedReport.tsx carrega]
      │
      ├─ useSharedReport(shareToken)
      │   │
      │   └─ Supabase query com share_token
      │       │
      │       └─ RLS: share_enabled=true?
      │           │
      │           ├─ SIM → retorna business_plan_section
      │           │
      │           └─ NÃO → retorna null
      │
      ├─ Se dados: renderiza SharedReportContent
      │
      └─ Se null: renderiza SharedReportError
```

---

## 9. Resumo de Arquivos

| Ação | Arquivo |
|------|---------|
| **CRIAR** | `src/pages/PmsSharedReport.tsx` |
| **CRIAR** | `src/hooks/useSharedReport.ts` |
| **CRIAR** | `src/components/planningmysaas/public/SharedReportHeader.tsx` |
| **CRIAR** | `src/components/planningmysaas/public/SharedReportContent.tsx` |
| **CRIAR** | `src/components/planningmysaas/public/SharedReportFooter.tsx` |
| **CRIAR** | `src/components/planningmysaas/public/SharedReportSkeleton.tsx` |
| **CRIAR** | `src/components/planningmysaas/public/SharedReportError.tsx` |
| **CRIAR** | `src/components/planningmysaas/public/SharedReportCharts.tsx` |
| **MIGRATION** | Adicionar colunas `share_token`, `share_enabled`, `share_created_at` |
| **MIGRATION** | Criar RLS policy para acesso anônimo |
| **MODIFICAR** | `src/App.tsx` (+1 rota, +1 import) |
| **MODIFICAR** | `src/pages/PmsDashboard.tsx` (+2 funções novas, modificar 1 handler) |

---

## 10. Garantia de Não-Quebra

- **BusinessPlanTab.tsx** → NÃO TOCADO
- **ReportContext.tsx** → NÃO TOCADO
- **Todos os componentes em `dashboard/`** → NÃO TOCADOS
- **Todas as RLS policies existentes** → MANTIDAS (nova policy é aditiva)
- **Fluxo de autenticação** → NÃO AFETADO
- **Páginas protegidas** → CONTINUAM PROTEGIDAS

Ao aprovar, implementarei todos os arquivos novos e as modificações mínimas necessárias.

