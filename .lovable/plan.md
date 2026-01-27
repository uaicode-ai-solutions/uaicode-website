
# Plano: Status "preparing" com Confirmação Antes da Navegação

## Resumo da Solução

A ideia é **garantir que o status seja atualizado no banco ANTES de navegar** para a tela de loading. Isso elimina completamente a race condition.

**Fluxo proposto:**
1. Usuário clica em botão (Regenerate, Submit, Retry, View Progress)
2. Botão entra em estado de loading com animação
3. Atualiza `tb_pms_reports.status = "preparing"` no banco
4. Aguarda confirmação do banco (sem erro)
5. Só então navega para `/loading/:id`
6. Loading vê `status = "preparing"` → chama orchestrator
7. Orchestrator muda para `Step 1 - In Progress` e continua

---

## Todos os Pontos de Entrada para a Tela de Loading

| Origem | Arquivo | Ação Atual | Ação Necessária |
|--------|---------|------------|-----------------|
| Dashboard "Regenerate" | `PmsDashboard.tsx` | Navega direto | Atualizar status → navegar |
| Dashboard Banner "Regenerate" | `DataQualityBanner.tsx` | Chama `onRegenerate` (mesmo handler) | Já coberto pelo Dashboard |
| Wizard Submit | `PmsWizard.tsx` | Insere wizard, navega | Inserir report row com "preparing" → navegar |
| ReportCard "View Progress" | `ReportCard.tsx` | Navega se não completed | Apenas navegar (status já existe) |
| Loading "Retry" | `PmsLoading.tsx` | Chama orchestrator | Atualizar status para "preparing" → chamar orchestrator |

---

## Mudanças Técnicas

### 1. `PmsDashboard.tsx` - Regenerate com Confirmação

```typescript
// ANTES
const handleRegenerateReport = async () => {
  if (!wizardId || isRegenerating) return;
  setIsRegenerating(true);
  await queryClient.invalidateQueries({ ... });
  navigate(`/planningmysaas/loading/${wizardId}`);
};

// DEPOIS
const handleRegenerateReport = async () => {
  if (!wizardId || isRegenerating) return;
  setIsRegenerating(true);
  
  try {
    // 1. Atualizar status para "preparing" e AGUARDAR confirmação
    const { error } = await supabase
      .from("tb_pms_reports")
      .update({ status: "preparing" })
      .eq("wizard_id", wizardId);
    
    if (error) {
      console.error("Failed to update status:", error);
      setIsRegenerating(false);
      return; // Não navega se falhou
    }
    
    // 2. Invalidar cache após confirmar atualização
    await queryClient.invalidateQueries({ 
      queryKey: ["pms-report-data", wizardId] 
    });
    
    // 3. Só navegar após confirmação
    navigate(`/planningmysaas/loading/${wizardId}`);
  } catch (err) {
    console.error("Regenerate error:", err);
    setIsRegenerating(false);
  }
};
```

**Botão com animação:**
```tsx
<Button
  onClick={handleRegenerateReport}
  disabled={isRegenerating}
>
  <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
  {isRegenerating ? 'Preparing...' : 'Regenerate'}
</Button>
```

### 2. `PmsWizard.tsx` - Criar Report Row com "preparing"

```typescript
// ANTES: Insere apenas wizard, navega
const { error: insertError } = await supabase
  .from('tb_pms_wizard')
  .insert({ id: reportId, ... });

navigate(`/planningmysaas/loading/${reportId}`);

// DEPOIS: Inserir wizard E report row
// Step 1: Inserir wizard
const { error: wizardError } = await supabase
  .from('tb_pms_wizard')
  .insert({ id: reportId, user_id: pmsUser.id, ... });

if (wizardError) {
  console.error("Error saving wizard:", wizardError);
  setIsSubmitting(false);
  return;
}

// Step 2: Criar report row com status "preparing"
const { error: reportError } = await supabase
  .from('tb_pms_reports')
  .insert({ 
    wizard_id: reportId, 
    status: "preparing" 
  });

if (reportError) {
  console.error("Error creating report row:", reportError);
  // Não é crítico - orchestrator criará se não existir
}

// Step 3: Só navegar após ambos confirmados
navigate(`/planningmysaas/loading/${reportId}`);
```

### 3. `PmsLoading.tsx` - Tratar Status "preparing"

```typescript
// ANTES: Não reconhece "preparing"
if (!status) {
  triggerOrchestrator();
  return;
}

// DEPOIS: Reconhecer "preparing" como sinal para iniciar
const normalizedStatus = status?.trim().toLowerCase() || "";

// Case 1: No status OR "preparing" → Start fresh generation
if (!normalizedStatus || normalizedStatus === "preparing") {
  console.log("[PmsLoading] Status is preparing/empty, starting generation");
  setHasDecided(true);
  triggerOrchestrator();
  return;
}

// Case 2: Completed → Dashboard
if (normalizedStatus === "completed") {
  navigate(`/planningmysaas/dashboard/${wizardId}`, { replace: true });
  return;
}

// Case 3: Failed → Show error
if (normalizedStatus.includes("fail")) {
  setHasDecided(true);
  return;
}

// Case 4: In Progress → Show Resume/Restart dialog
if (isInProgressStatus(status)) {
  setShowResumeDialog(true);
  return;
}
```

**Também corrigir o Retry:**
```typescript
// Handle retry failed step
const handleRetryFailedStep = useCallback(async () => {
  if (!failedStepInfo || !wizardId) return;
  
  setIsProcessing(true);
  
  // Atualizar status para "preparing" antes de chamar orchestrator
  await supabase
    .from("tb_pms_reports")
    .update({ status: "preparing" })
    .eq("wizard_id", wizardId);
  
  // Chamar orchestrator com resume
  triggerOrchestrator(failedStepInfo.stepNumber);
}, [failedStepInfo, wizardId, triggerOrchestrator]);
```

### 4. `useReportData.ts` - Reduzir staleTime para Loading

O polling já está funcionando, mas o staleTime de 5 minutos pode causar problemas. Para a tela de Loading, precisamos de dados frescos:

```typescript
// Opção 1: Reduzir staleTime global para 0 (simples)
staleTime: 0,

// Opção 2: Manter 5min mas usar refetchOnMount: 'always' no Loading
// (configuração no componente)
```

Vou optar por **reduzir staleTime para 0** pois garante dados sempre frescos.

### 5. `ReportCard.tsx` - Sem Mudança Necessária

O ReportCard apenas navega para `/loading/:id` quando o report já existe com algum status. Não precisa mudar nada - ele não inicia geração, apenas visualiza.

---

## Sequência de Estados

```text
Estado no Banco          | UI Loading             | Ação
-------------------------|------------------------|------------------
(não existe)             | Skeleton padrão        | Wizard insere "preparing"
"preparing"              | Skeleton + "Preparing" | Chamar orchestrator
"Step 1 - In Progress"   | Step 1 ativo           | Polling
"Step 1 - Completed"     | Step 1 ✓               | Continua...
"Step 5 - In Progress"   | Steps 1-4 ✓, 5 ativo   | Polling
"Step 5 - Fail"          | Tela de erro           | Botão Retry
"completed"              | Redirect               | → Dashboard
```

---

## Fluxo Visual com Status "preparing"

```text
┌─────────────────────────────────────────────────────────────┐
│                   FLUXO REGENERATE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Dashboard                                                  │
│  [Regenerate] ← clique                                      │
│       │                                                     │
│       ▼                                                     │
│  [Preparing...] ← botão desabilitado, spinner               │
│       │                                                     │
│       ▼                                                     │
│  UPDATE tb_pms_reports SET status = 'preparing'             │
│       │                                                     │
│       ▼                                                     │
│  ✓ Confirmação do banco (sem erro)                          │
│       │                                                     │
│       ▼                                                     │
│  navigate('/loading/:id')                                   │
│       │                                                     │
│       ▼                                                     │
│  Loading monta, busca status = 'preparing'                  │
│       │                                                     │
│       ▼                                                     │
│  Reconhece 'preparing' → chama orchestrator                 │
│       │                                                     │
│       ▼                                                     │
│  Orchestrator: status → 'Step 1 - In Progress'              │
│       │                                                     │
│       ▼                                                     │
│  ... execução normal ...                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Arquivos a Modificar

| Arquivo | Mudança | Prioridade |
|---------|---------|------------|
| `src/pages/PmsDashboard.tsx` | Update status → await → navigate | ALTA |
| `src/pages/PmsWizard.tsx` | Insert report row com "preparing" | ALTA |
| `src/pages/PmsLoading.tsx` | Reconhecer status "preparing" | ALTA |
| `src/hooks/useReportData.ts` | Reduzir staleTime para 0 | MÉDIA |

---

## Critérios de Aceite

1. **Botão Regenerate**: Mostra "Preparing..." com spinner enquanto atualiza banco
2. **Navegação só após confirmação**: Se UPDATE falhar, não navega
3. **Loading reconhece "preparing"**: Inicia orchestrator corretamente
4. **Wizard cria report row**: Status "preparing" já existe antes de navegar
5. **Retry funciona**: Atualiza status para "preparing" antes de chamar orchestrator
6. **Sem bounce-back**: Nunca mais redireciona de Loading para Dashboard durante regeneração
