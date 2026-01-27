
# Plano: Edge Function Orquestradora com Controle de Status Centralizado

## Objetivo

Criar uma nova Edge Function `pms-orchestrate-report` que controla o fluxo de geração de relatório, chamando sequencialmente cada tool do n8n e gerenciando o status em `tb_pms_reports.status`.

---

## Arquitetura do Fluxo

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  1. Usuário submete wizard ou clica "Regenerate"                            │
│  2. Invalida cache do React Query                                           │
│  3. Chama Edge Function "pms-orchestrate-report"                            │
│  4. Navega para /planningmysaas/loading/:id                                 │
│  5. Faz polling em tb_pms_reports.status                                    │
│  6. Exibe progresso step-by-step                                            │
│  7. Quando status = "completed" → navega para dashboard                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              EDGE FUNCTION "pms-orchestrate-report"                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  for (tool of TOOLS_SEQUENCE) {                                             │
│    1. UPDATE status = "Step X Label - In Progress"                          │
│    2. CALL webhook: { tool_name, wizard_id }                                │
│    3. AWAIT response: { success, data } ou { success: false, error }        │
│    4. IF success → save data, UPDATE status = "Step X - Completed"          │
│    5. ELSE → UPDATE status = "Step X - Fail", RETURN error                  │
│  }                                                                           │
│  UPDATE status = "completed"                                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    n8n WORKFLOW (Single Entry Point)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  Webhook receives: { tool_name, wizard_id }                                 │
│  Switch (tool_name):                                                        │
│    → Create_Report_Row           → Execute & Respond                        │
│    → Call_Get_Investment_Tool_   → Execute & Respond                        │
│    → ...                                                                     │
│  Each branch ends with "Respond to Webhook" node                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Componentes a Criar/Modificar

### 1. NOVA: Edge Function `pms-orchestrate-report`

**Arquivo:** `supabase/functions/pms-orchestrate-report/index.ts`

**Lógica Principal:**

```typescript
const TOOLS_SEQUENCE = [
  { id: 0, tool_name: "Create_Report_Row", label: "Initialize Report", field: null },
  { id: 1, tool_name: "Call_Get_Investment_Tool_", label: "Investment Analysis", field: "section_investment" },
  { id: 2, tool_name: "Call_Get_Benchmark_Tool_", label: "Market Benchmarks", field: "benchmark_section" },
  { id: 3, tool_name: "Call_Get_Competitors_Tool_", label: "Competitor Research", field: "competitive_analysis_section" },
  { id: 4, tool_name: "Call_Get_Opportunity_Tool_", label: "Market Opportunity", field: "opportunity_section" },
  { id: 5, tool_name: "Call_Get_ICP_Tool_", label: "Customer Profiling", field: "icp_intelligence_section" },
  { id: 6, tool_name: "Call_Get_Price_Tool_", label: "Pricing Strategy", field: "price_intelligence_section" },
  { id: 7, tool_name: "Call_Get_PaidMedia_Tool_", label: "Paid Media Analysis", field: "paid_media_intelligence_section" },
  { id: 8, tool_name: "Call_Get_Growth_Tool_", label: "Growth Projections", field: "growth_intelligence_section" },
  { id: 9, tool_name: "Call_Get_Summary_Tool_", label: "Executive Summary", field: "summary_section" },
  { id: 10, tool_name: "Call_Get_Hero_Score_Tool_", label: "Final Scoring", field: "hero_score_section" },
];
```

**Webhook URL:** Usa `REPORT_NEWREPORT_WEBHOOK_ID` (já configurada)

**Payload enviado ao n8n:**
```json
{
  "tool_name": "Call_Get_Investment_Tool_",
  "wizard_id": "67700d3e-6a6a-4c4b-89cd-3b0b90efa406"
}
```

---

### 2. MODIFICAR: Frontend - PmsDashboard.tsx

**Arquivo:** `src/pages/PmsDashboard.tsx`

**Alterações na função `handleRegenerateReport`:**

```typescript
const handleRegenerateReport = async () => {
  if (!wizardId) return;
  
  try {
    // 1. Invalidar cache para forçar dados frescos
    await queryClient.invalidateQueries({ 
      queryKey: ["pms-report-data", wizardId] 
    });
    
    // 2. Chamar nova Edge Function orquestradora
    // Fire-and-forget - não bloqueia a UI
    supabase.functions.invoke('pms-orchestrate-report', {
      body: { wizard_id: wizardId }
    });
    
    // 3. Navegar para loading page
    navigate(`/planningmysaas/loading/${wizardId}`);
  } catch (err) {
    console.error("Error triggering regeneration:", err);
  }
};
```

---

### 3. MODIFICAR: Frontend - PmsLoading.tsx

**Arquivo:** `src/pages/PmsLoading.tsx`

**Alterações na função `handleRetry`:**

```typescript
const handleRetry = async () => {
  setIsRetrying(true);
  try {
    // Usar nova Edge Function orquestradora
    await supabase.functions.invoke('pms-orchestrate-report', {
      body: { wizard_id: wizardId }
    });
    await refetch();
  } catch (error) {
    console.error("Error retrying report:", error);
  } finally {
    setIsRetrying(false);
  }
};
```

---

### 4. MODIFICAR: useReportData.ts - Aceitar Status de Falha

**Arquivo:** `src/hooks/useReportData.ts`

**Atualizar lógica de polling para parar em status terminal:**

```typescript
refetchInterval: (query) => {
  const data = query.state.data as ReportData | null;
  const status = data?.status;
  
  // Terminal statuses - stop polling
  const isTerminal = 
    status === "completed" || 
    status === "Created" ||
    (status && status.toLowerCase().includes("fail"));
  
  if (isTerminal) {
    console.log("[useReportData] Terminal status:", status);
    return false;
  }
  
  return 5000; // Continue polling
},
```

---

## Configuração do n8n: "Respond to Webhook"

Cada branch do workflow n8n deve terminar com um nó **"Respond to Webhook"**:

### Configuração do Nó:

| Campo | Valor |
|-------|-------|
| **Respond With** | JSON |
| **Response Mode** | Last Node |
| **Response Code** | 200 |

### JSON de Resposta - Sucesso:

```json
{
  "success": true,
  "tool_name": "{{ $('Webhook').first().json.tool_name }}",
  "wizard_id": "{{ $('Webhook').first().json.wizard_id }}",
  "data": {{ JSON.stringify($json) }}
}
```

### JSON de Resposta - Erro (via Error Trigger):

```json
{
  "success": false,
  "tool_name": "{{ $('Webhook').first().json.tool_name }}",
  "wizard_id": "{{ $('Webhook').first().json.wizard_id }}",
  "error": "{{ $json.error?.message || 'Unknown error' }}"
}
```

### Estrutura do Workflow n8n:

```text
Webhook Trigger
    │
    ▼
 SWITCH (tool_name)
    │
    ├── Create_Report_Row ──────────────────┐
    │   └→ Fetch wizard data                │
    │   └→ Insert tb_pms_reports            │
    │   └→ Respond to Webhook { success }   │
    │                                        │
    ├── Call_Get_Investment_Tool_ ──────────┤
    │   └→ Fetch data                       │
    │   └→ Call AI/Perplexity               │
    │   └→ Parse response                   │
    │   └→ Respond to Webhook { success, data } │
    │                                        │
    └── ... (demais tools no mesmo padrão)  │
                                             │
    ERROR TRIGGER ───────────────────────────┘
        └→ Respond to Webhook { success: false, error }
```

---

## Resumo das Alterações

| Componente | Arquivo | Ação |
|------------|---------|------|
| Edge Function | `supabase/functions/pms-orchestrate-report/index.ts` | CRIAR |
| Frontend | `src/pages/PmsDashboard.tsx` | MODIFICAR handleRegenerateReport |
| Frontend | `src/pages/PmsLoading.tsx` | MODIFICAR handleRetry |
| Hook | `src/hooks/useReportData.ts` | MODIFICAR polling logic |
| n8n | Cada branch de tool | ADICIONAR "Respond to Webhook" node |

---

## Secret Utilizado

| Secret | Valor Atual |
|--------|-------------|
| `REPORT_NEWREPORT_WEBHOOK_ID` | URL completa do webhook n8n (já configurada) |

---

## Fluxo de Status no Banco

```text
┌─────────────────────────────────────────────────────────────────┐
│                     tb_pms_reports.status                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  "pending"                          ← Início                    │
│  "Step 0 Initialize Report - In Progress"                       │
│  "Step 0 Initialize Report - Completed"                         │
│  "Step 1 Investment Analysis - In Progress"                     │
│  "Step 1 Investment Analysis - Completed"                       │
│  ...                                                             │
│  "Step 10 Final Scoring - In Progress"                          │
│  "Step 10 Final Scoring - Completed"                            │
│  "completed"                        ← Sucesso final             │
│                                                                  │
│  OU em caso de erro:                                            │
│  "Step 5 Customer Profiling - Fail" ← Parou no step 5          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Próximos Passos Após Implementação

1. **Testar fluxo completo** com um novo wizard
2. **Verificar logs** da Edge Function no Supabase
3. **Confirmar resposta do n8n** com os nós "Respond to Webhook"
4. **Depreciar** `pms-trigger-n8n-report` após validação
5. **Opcional:** Remover trigger de banco que chama `pms-webhook-new-report`
