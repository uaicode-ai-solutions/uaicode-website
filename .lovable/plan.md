
# Plano: Unificar Fluxo de Geração - Usar Apenas `pms-orchestrate-report`

## Objetivo
Garantir que todos os pontos de entrada para geração de relatório utilizem a Edge Function `pms-orchestrate-report` como único orquestrador, eliminando a duplicação e inconsistência de payloads.

## Análise Atual

### Pontos de Entrada Identificados

| Local | Arquivo | Função | Fluxo Atual |
|-------|---------|--------|-------------|
| Wizard Step 5 | `src/pages/PmsWizard.tsx` | `handleSubmit` | INSERT → trigger → `pms-webhook-new-report` ❌ |
| Dashboard Header | `src/pages/PmsDashboard.tsx` | `handleRegenerateReport` | `pms-orchestrate-report` ✅ |
| Data Quality Banner | `src/components/.../DataQualityBanner.tsx` | `onRegenerate` prop | Usa o handler do Dashboard ✅ |
| Loading Try Again | `src/pages/PmsLoading.tsx` | `handleRetry` | `pms-orchestrate-report` ✅ |

### O Problema Principal
O Wizard depende de um **trigger de banco de dados** (`notify_pms_wizard_created_webhook`) que chama a Edge Function antiga `pms-webhook-new-report`, enviando um payload diferente do esperado pelo novo fluxo orquestrado.

---

## Alterações Necessárias

### 1. Atualizar `PmsWizard.tsx` - Chamar `pms-orchestrate-report` diretamente

**Arquivo:** `src/pages/PmsWizard.tsx`

**Alteração na função `handleSubmit` (linhas ~279-338):**

Após o INSERT bem-sucedido em `tb_pms_wizard`, adicionar chamada direta à Edge Function orquestradora:

```typescript
// ANTES (linha ~284-314):
console.log("Report saved to database:", reportId);
// Note: Webhook is now called automatically via database trigger (on_pms_report_created)

// Send report ready email notification...
```

```typescript
// DEPOIS:
console.log("Report saved to database:", reportId);

// Chamar Edge Function orquestradora diretamente (não depender do trigger)
supabase.functions.invoke('pms-orchestrate-report', {
  body: { wizard_id: reportId }
});

// REMOVER a chamada de email (será enviado pelo orquestrador quando completar)
// Send report ready email notification... (REMOVER ESTE BLOCO)
```

**Também adicionar proteção contra clique duplo:**

```typescript
// Linha ~67: Adicionar estado
const [isSubmitting, setIsSubmitting] = useState(false);

// Linha ~208: Modificar início do handleSubmit
const handleSubmit = async () => {
  if (!validateStep(currentStep) || isSubmitting) return;
  
  setIsSubmitting(true);
  // ... resto do código
```

**Atualizar o botão no `WizardLayout.tsx` para mostrar loading:**

```typescript
// Receber prop isSubmitting
interface WizardLayoutProps {
  // ... existentes
  isSubmitting?: boolean;
}

// No botão de submit:
<Button
  onClick={onSubmit}
  disabled={!canGoNext || isSubmitting}
  className="gap-2 bg-accent hover:bg-accent/90 text-background font-semibold glow-white"
>
  {isSubmitting ? (
    <>
      <RefreshCw className="w-4 h-4 animate-spin" />
      Generating...
    </>
  ) : (
    <>
      🚀 Get my SaaS Analysis
      <ArrowRight className="w-4 h-4" />
    </>
  )}
</Button>
```

### 2. Atualizar `PmsDashboard.tsx` - Proteção contra clique duplo

**Arquivo:** `src/pages/PmsDashboard.tsx`

Adicionar estado de loading no botão Regenerate:

```typescript
// Linha ~67: Adicionar estado
const [isRegenerating, setIsRegenerating] = useState(false);

// Modificar handleRegenerateReport:
const handleRegenerateReport = async () => {
  if (!wizardId || isRegenerating) return;
  
  setIsRegenerating(true);
  try {
    await queryClient.invalidateQueries({ 
      queryKey: ["pms-report-data", wizardId] 
    });
    
    supabase.functions.invoke('pms-orchestrate-report', {
      body: { wizard_id: wizardId }
    });
    
    navigate(`/planningmysaas/loading/${wizardId}`);
  } catch (err) {
    console.error("Error triggering regeneration:", err);
    setIsRegenerating(false);
  }
};
```

**Atualizar botão para mostrar spinner:**

```typescript
<Button
  variant="outline"
  size="sm"
  onClick={handleRegenerateReport}
  disabled={isRegenerating}
  className="gap-2 border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
>
  <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
  <span className="hidden sm:inline">
    {isRegenerating ? 'Starting...' : 'Regenerate'}
  </span>
</Button>
```

---

## Resumo das Alterações por Arquivo

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/PmsWizard.tsx` | Adicionar `isSubmitting` state, chamar `pms-orchestrate-report` após INSERT, remover email |
| `src/components/planningmysaas/wizard/WizardLayout.tsx` | Adicionar prop `isSubmitting`, mostrar loading no botão |
| `src/pages/PmsDashboard.tsx` | Adicionar `isRegenerating` state, proteção contra clique duplo, spinner no botão |

---

## Resultado Esperado

Após implementação:

1. **Wizard Submit** → INSERT + `pms-orchestrate-report` → Loading → Dashboard
2. **Dashboard Regenerate** → `pms-orchestrate-report` → Loading → Dashboard
3. **Banner Regenerate** → Usa mesmo handler do Dashboard
4. **Loading Try Again** → `pms-orchestrate-report` (já correto)

Todos os fluxos agora usam o mesmo orquestrador step-by-step.

---

## Observação sobre o Trigger do Banco

O trigger `notify_pms_wizard_created_webhook` ainda existe e vai disparar `pms-webhook-new-report` a cada INSERT. Isso pode ser ignorado porque:
1. O n8n pode simplesmente ignorar payloads sem `tool_name` 
2. Ou podemos remover/desabilitar o trigger posteriormente

Recomendo manter o trigger por enquanto como backup e removê-lo em uma fase posterior quando confirmarmos que o novo fluxo está 100% estável.
