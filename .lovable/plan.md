
# Plano: Corrigir Loading Screen - Erro no Step 12 e Tela de Erro

## Diagnóstico

### Problema 1: Tela de erro não aparece após falha

**Cenário identificado**: Quando o usuário navega para a página de loading com um report que já está em status `"Step 12 Business Plan - Fail"`, a tela de erro não é exibida.

**Causa raiz**: A lógica de decisão no `useEffect` da linha 94-137 em `PmsLoading.tsx` tem um fluxo correto, MAS há um bug sutil:

```tsx
// Linha 95: Esta condição impede re-avaliação após retry
if (hasCheckedInitialStatus.current || hasDecided) return;
```

Quando o usuário clica em "Retry":
1. `handleRetryFailedStep` atualiza o status para `"preparing"`
2. Mas `hasCheckedInitialStatus.current` permanece `true`
3. Se o fetch falhar novamente e o status voltar para `"Fail"`, o useEffect não roda porque a condição na linha 95 bloqueia

**Além disso**: Se o usuário navegar diretamente para a URL (reload ou link direto) quando o status já é `Fail`:
- O `hasCheckedInitialStatus.current` é setado como `true`
- `setHasDecided(true)` é chamado
- A condição `hasDecided && isFailed` na linha 238 deveria renderizar a tela de erro

O problema real pode estar no **primeiro cenário**: quando o usuário vem da página de Reports ou Dashboard com cache do React Query.

### Problema 2: Step 12 (Business Plan) falhando

O orchestrator está corretamente marcando o Step 12 como `"Fail"`, indicando que:
- O webhook n8n retornou erro HTTP
- OU o timeout de 150s foi excedido
- OU houve erro de parsing no pipeline n8n

Isso requer investigação nos logs do n8n (externo ao Lovable).

---

## Correções Propostas

### Correção 1: Garantir que a tela de erro apareça

**Arquivo:** `src/pages/PmsLoading.tsx`

O problema é que a lógica atual não re-avalia o estado quando o status muda para `Fail` após um retry. A solução é:

1. Separar a lógica de "decisão inicial" da lógica de "watch for failure"
2. Adicionar um `useEffect` dedicado para detectar falhas a qualquer momento

**Mudança:**

```tsx
// NOVO useEffect: Watch for failure at any time (not just initial)
useEffect(() => {
  // If we're retrying and status changes to fail, show error UI
  if (isFailed && !isRetrying) {
    console.log("[PmsLoading] Failure detected, showing error UI");
    setHasDecided(true);
  }
}, [isFailed, isRetrying]);
```

Também preciso garantir que o retry reseta corretamente os refs:

```tsx
const handleRetryFailedStep = useCallback(async () => {
  if (!wizardId) return;
  
  setIsRetrying(true);
  
  // NOVO: Reset the initial check flag to allow re-evaluation
  hasCheckedInitialStatus.current = false;
  setHasDecided(false);
  
  // ... resto do código
}, [wizardId, refetch, triggerOrchestrator]);
```

### Correção 2: Invalidar cache do React Query antes de navegar

**Arquivo:** `src/components/planningmysaas/reports/ReportCard.tsx`

Quando o usuário clica em um report com status `Fail`, invalidar o cache para garantir dados frescos:

```tsx
const handleView = () => {
  // Invalidate cache to ensure fresh data on loading page
  queryClient.invalidateQueries({ queryKey: ["pms-report-data", report.id] });
  
  if (isCompleted) {
    navigate(`/planningmysaas/dashboard/${report.id}`);
  } else {
    navigate(`/planningmysaas/loading/${report.id}`);
  }
};
```

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/PmsLoading.tsx` | Adicionar useEffect para detectar falhas + resetar refs no retry |
| `src/components/planningmysaas/reports/ReportCard.tsx` | Invalidar cache antes de navegar |

---

## Fluxo Corrigido

```text
Usuário navega para /loading/:wizardId
        ↓
   useReportData faz fetch
        ↓
   Status = "Step 12 ... - Fail"
        ↓
   useEffect detecta isFailed
        ↓
   setHasDecided(true)
        ↓
   Render: hasDecided && isFailed → Tela de Erro ✓
        ↓
   Usuário clica "Retry"
        ↓
   hasCheckedInitialStatus.current = false (RESET)
   setHasDecided(false) (RESET)
   Status → "preparing"
        ↓
   Orchestrator roda
        ↓
   Se falhar novamente:
   useEffect detecta isFailed → Tela de Erro ✓
```

---

## Resumo das Alterações

1. **Adicionar useEffect separado** para detectar falhas independente do fluxo inicial
2. **Resetar refs/state no retry** para permitir re-avaliação completa
3. **Invalidar cache do React Query** na navegação para loading page
