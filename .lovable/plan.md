

# Plano: Adicionar Step 12 + Coluna share_url + Gerar Dados de Compartilhamento Automaticamente

## Objetivo

1. Adicionar **Step 12: Business Plan** no orchestrator e na tela de loading
2. Adicionar coluna **share_url** no banco para armazenar a URL completa
3. Após Step 12, **gerar automaticamente** `share_token`, `share_url`, `share_enabled`, `share_created_at`
4. Atualizar o Dashboard para usar a URL do banco diretamente (sem precisar gerar)

---

## Arquivos a Modificar (APENAS 4)

| Arquivo | Modificação |
|---------|-------------|
| `supabase/functions/pms-orchestrate-report/index.ts` | Adicionar Step 12 + gerar dados de compartilhamento |
| `src/components/planningmysaas/skeletons/GeneratingReportSkeleton.tsx` | Adicionar Step 12 na lista visual |
| `src/pages/PmsDashboard.tsx` | Simplificar lógica para usar share_url do banco |
| **Migration** | Adicionar coluna `share_url TEXT` |

---

## 1. Migration: Nova Coluna share_url

```sql
ALTER TABLE public.tb_pms_reports
ADD COLUMN IF NOT EXISTS share_url TEXT;
```

---

## 2. Modificação: pms-orchestrate-report/index.ts

### 2.1 Adicionar Step 12 no TOOLS_SEQUENCE (linha 22-34)

```typescript
// Sequential tools 1→12
const TOOLS_SEQUENCE = [
  { step: 1, tool_name: "Create_Report_Row", label: "Initialize Report" },
  { step: 2, tool_name: "Call_Get_Investment_Tool_", label: "Investment Analysis" },
  { step: 3, tool_name: "Call_Get_Benchmark_Tool_", label: "Market Benchmarks" },
  { step: 4, tool_name: "Call_Get_Competitors_Tool_", label: "Competitor Research" },
  { step: 5, tool_name: "Call_Get_Opportunity_Tool_", label: "Market Opportunity" },
  { step: 6, tool_name: "Call_Get_Price_Tool_", label: "Pricing Strategy" },
  { step: 7, tool_name: "Call_Get_ICP_Tool_", label: "Customer Profiling" },
  { step: 8, tool_name: "Call_Get_PaidMedia_Tool_", label: "Paid Media Analysis" },
  { step: 9, tool_name: "Call_Get_Growth_Tool_", label: "Growth Projections" },
  { step: 10, tool_name: "Call_Get_Summary_Tool_", label: "Executive Summary" },
  { step: 11, tool_name: "Call_Get_Hero_Score_Tool_", label: "Final Scoring" },
  { step: 12, tool_name: "Call_Get_Business_Plan_Tool_", label: "Business Plan" },  // NOVO
];
```

### 2.2 Adicionar constante da URL base (após corsHeaders, linha ~9)

```typescript
const PRODUCTION_URL = "https://uaicodewebsite.lovable.app";
```

### 2.3 Adicionar função de geração de token (após getWebhookUrl, linha ~19)

```typescript
// Generate cryptographically secure share token (32 hex chars)
const generateShareToken = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
};
```

### 2.4 Modificar bloco de conclusão (linha 127-131)

**ANTES:**
```typescript
// All steps completed successfully
await supabase
  .from("tb_pms_reports")
  .update({ status: "completed" })
  .eq("wizard_id", wizard_id);
```

**DEPOIS:**
```typescript
// All steps completed - generate share data and mark as completed
const shareToken = generateShareToken();
const shareUrl = `${PRODUCTION_URL}/planningmysaas/shared/${shareToken}`;

await supabase
  .from("tb_pms_reports")
  .update({ 
    status: "completed",
    share_token: shareToken,
    share_url: shareUrl,
    share_enabled: true,
    share_created_at: new Date().toISOString()
  })
  .eq("wizard_id", wizard_id);

console.log(`🔗 Share URL generated: ${shareUrl}`);
```

---

## 3. Modificação: GeneratingReportSkeleton.tsx

### 3.1 Adicionar import do ícone Briefcase (linha 1)

```typescript
import { Loader2, DollarSign, Target, BarChart3, TrendingUp, Users, Tag, Megaphone, Rocket, FileText, Trophy, CheckCircle2, XCircle, Zap, Briefcase } from "lucide-react";
```

### 3.2 Adicionar Step 12 na lista STEPS (linha 10-22)

```typescript
const STEPS = [
  { label: "Initialize Report", icon: Zap },
  { label: "Investment Analysis", icon: DollarSign },
  { label: "Market Benchmarks", icon: Target },
  { label: "Competitor Research", icon: BarChart3 },
  { label: "Market Opportunity", icon: TrendingUp },
  { label: "Pricing Strategy", icon: Tag },
  { label: "Customer Profiling", icon: Users },
  { label: "Paid Media Analysis", icon: Megaphone },
  { label: "Growth Projections", icon: Rocket },
  { label: "Executive Summary", icon: FileText },
  { label: "Final Scoring", icon: Trophy },
  { label: "Business Plan", icon: Briefcase },  // NOVO (Step 12)
];
```

---

## 4. Modificação: PmsDashboard.tsx

### 4.1 Simplificar getOrCreateShareUrl (linhas 173-206)

A lógica agora apenas lê do banco - não precisa mais gerar:

**ANTES:** Função que gera token se não existir

**DEPOIS:**
```typescript
// Get public share URL from database
const getShareUrl = (): string | null => {
  const shareUrl = (reportData as { share_url?: string; share_enabled?: boolean })?.share_url;
  const shareEnabled = (reportData as { share_enabled?: boolean })?.share_enabled;
  
  if (shareUrl && shareEnabled) {
    return shareUrl;
  }
  
  return null;
};
```

### 4.2 Simplificar handleCopyLink (linhas 208-216)

```typescript
const handleCopyLink = async () => {
  const url = getShareUrl();
  if (url) {
    await navigator.clipboard.writeText(url);
    console.log("Public link copied to clipboard");
  } else {
    console.error("Share URL not available");
  }
};
```

### 4.3 Simplificar handler do Share via Email (linhas 417-422)

```typescript
onClick={() => {
  const url = getShareUrl();
  if (url) {
    setShareUrl(url);
    setShareDialogOpen(true);
  }
}}
```

### 4.4 Remover função generateShareToken (linhas 165-170)

Não é mais necessária no frontend - token é gerado no backend.

---

## 5. Atualizar Types

A migration atualizará automaticamente os types para incluir `share_url`.

---

## 6. Fluxo Atualizado

```text
[Orchestrator executa Step 1-12]
          │
          └── Step 12: Business Plan ← NOVO
          │
          ▼
[Após Step 12 completar com sucesso]
          │
          ▼
[Gerar share_token + share_url + share_enabled=true]
          │
          ▼
[Atualizar status = "completed"]
          │
          ▼
[Dashboard carrega - share_url JÁ ESTÁ NO BANCO]
          │
          ▼
[Usuário clica "Copy Link" → Copia share_url instantaneamente]
```

---

## 7. Dados no Banco (para debug)

| Coluna | Exemplo |
|--------|---------|
| `share_token` | `a3f7c2e8b1d4f6a9c5e2b8d1f4a7c3e9` |
| `share_url` | `https://uaicodewebsite.lovable.app/planningmysaas/shared/a3f7c2e8b1d4f6a9c5e2b8d1f4a7c3e9` |
| `share_enabled` | `true` |
| `share_created_at` | `2026-01-31T15:30:00.000Z` |

---

## 8. O que NÃO será modificado

| Arquivo | Razão |
|---------|-------|
| `ShareReportDialog.tsx` | Nenhuma mudança necessária (já recebe `reportUrl` como prop) |
| `useSharedReport.ts` | Nenhuma mudança necessária (busca por `share_token`) |
| `PmsSharedReport.tsx` | Nenhuma mudança necessária |
| Componentes em `public/` | Nenhuma mudança necessária |
| RLS policies | Nenhuma mudança necessária |

---

## 9. Resumo

| Arquivo | Ação |
|---------|------|
| **Migration** | Adicionar coluna `share_url TEXT` |
| `pms-orchestrate-report/index.ts` | +Step 12, +generateShareToken, +PRODUCTION_URL, modificar bloco final |
| `GeneratingReportSkeleton.tsx` | +import Briefcase, +Step 12 na lista |
| `PmsDashboard.tsx` | Simplificar para ler share_url do banco, remover generateShareToken |

