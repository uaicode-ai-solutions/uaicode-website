
# Plano: Centralizar Disparo do Webhook na Tela de Loading

## Diagnóstico

Atualmente o webhook `pms-orchestrate-report` é chamado em **3 lugares diferentes**:
- `PmsWizard.tsx`: ao submeter o formulário
- `PmsDashboard.tsx`: ao clicar em Regenerate
- `PmsLoading.tsx`: ao clicar em Try Again (retry)

A tela de Loading **não dispara** o webhook ao montar - ela apenas monitora o status.

## Arquitetura Corrigida

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         FLUXO UNIFICADO                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Wizard Submit ──┐                                                 │
│                   │                                                 │
│   Dashboard       ├──▶ navigate("/loading/:id") ──▶ Loading Page   │
│   Regenerate ─────┤        (sem webhook)              (ao montar,   │
│                   │                                   dispara       │
│   Retry Button ───┘                                   webhook)      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Alteracoes

### 1. PmsLoading.tsx - Adicionar Disparo do Webhook ao Montar

Adicionar `useEffect` que dispara o webhook quando a pagina abre:

```typescript
// Guard para evitar double-trigger (StrictMode)
const hasTriggeredWebhook = useRef(false);

useEffect(() => {
  if (!wizardId || hasTriggeredWebhook.current) return;
  
  // Marcar como disparado ANTES de chamar (evita race condition)
  hasTriggeredWebhook.current = true;
  
  console.log("[PmsLoading] Triggering orchestrator for:", wizardId);
  
  supabase.functions.invoke('pms-orchestrate-report', {
    body: { wizard_id: wizardId }
  }).then(result => {
    console.log('[PmsLoading] Orchestrator response:', result);
  }).catch(err => {
    console.error('[PmsLoading] Orchestrator error:', err);
  });
}, [wizardId]);
```

### 2. PmsLoading.tsx - Simplificar Retry

Remover chamada ao webhook do `handleRetry`:

```typescript
const handleRetry = () => {
  // Apenas recarregar a pagina - o useEffect vai disparar o webhook novamente
  hasTriggeredWebhook.current = false; // Reset guard
  window.location.reload();
};
```

### 3. PmsWizard.tsx - Remover Chamada ao Webhook

Remover linhas 316-322 (chamada ao webhook), manter apenas a navegacao:

```typescript
// Antes:
supabase.functions.invoke('pms-orchestrate-report', {
  body: { wizard_id: reportId }
}).then(...).catch(...);
navigate(`/planningmysaas/loading/${reportId}`);

// Depois:
navigate(`/planningmysaas/loading/${reportId}`);
```

### 4. PmsDashboard.tsx - Remover Chamada ao Webhook

Simplificar `handleRegenerateReport`:

```typescript
const handleRegenerateReport = async () => {
  if (!wizardId || isRegenerating) return;
  
  setIsRegenerating(true);
  
  // Apenas invalidar cache e navegar - Loading page dispara o webhook
  await queryClient.invalidateQueries({ 
    queryKey: ["pms-report-data", wizardId] 
  });
  
  navigate(`/planningmysaas/loading/${wizardId}`);
};
```

## Resumo das Alteracoes

| Arquivo | Acao |
|---------|------|
| `PmsLoading.tsx` | Adicionar `useEffect` que dispara webhook ao montar |
| `PmsLoading.tsx` | Simplificar `handleRetry` para apenas recarregar |
| `PmsWizard.tsx` | Remover chamada ao webhook (manter so navegacao) |
| `PmsDashboard.tsx` | Remover chamada ao webhook (manter so navegacao) |

## Beneficios

1. **Single Source of Truth**: O webhook so e disparado em UM lugar (Loading page)
2. **Facilidade de Debug**: Qualquer problema de disparo esta em um unico arquivo
3. **Consistencia**: Todos os fluxos (new, regenerate, retry) passam pelo mesmo codigo
4. **Evita Duplicacao**: Impossivel disparar webhook 2x acidentalmente
