
# Plano: Corrigir "Try Again" - Evitar Exibição Prematura da Tela de Erro

## Diagnóstico do Bug

### Fluxo Atual (Problema)
```text
1. Report falha → status = "Step X - Fail"
2. Usuário clica "Try Again"
3. window.location.reload() → página remonta
4. Cache/banco AINDA tem status "fail" (webhook não rodou)
5. isFailed = true na PRIMEIRA renderização
6. Tela de erro é exibida IMEDIATAMENTE
7. Webhook é disparado em background, mas UI já está no erro
```

### Causa Raiz
A proteção `hasSeenNonCompleted` só protege contra navegação prematura ao dashboard. **Não existe proteção equivalente para a tela de erro.**

A tela de erro é exibida incondicional quando `isFailed = true`, sem verificar se observamos um "ciclo novo" de geração.

---

## Solução: Unificar Proteção de Cache

Criar uma única flag `hasObservedFreshCycle` que indica que observamos a geração **realmente iniciar** (ou seja, status diferente do terminal anterior).

### Regra Unificada
Só aplicar ações terminais (navegar ao dashboard OU mostrar tela de erro) quando:
1. Status atual é terminal (`"completed"` ou contém `"fail"`)
2. **E** `hasObservedFreshCycle === true`

Se `hasObservedFreshCycle === false`, mostrar skeleton de loading (mesmo que status seja fail/completed).

---

## Mudanças em `src/pages/PmsLoading.tsx`

### 1. Renomear e Generalizar a Flag

```typescript
// ANTES: só protegia contra completed
const hasSeenNonCompleted = useRef(false);

// DEPOIS: protege contra qualquer status terminal stale
const hasObservedFreshCycle = useRef(false);
```

### 2. Detectar Início de Novo Ciclo

O "ciclo novo" começou quando observamos um status que:
- NÃO é "completed"
- NÃO contém "fail"
- NÃO é vazio/undefined

Ou seja, quando vemos "Step X ... In Progress" pela primeira vez.

```typescript
useEffect(() => {
  // Status não-terminal = geração está em andamento
  const isInProgress = normalizedStatus && 
    normalizedStatus !== "completed" && 
    !normalizedStatus.includes("fail");
  
  if (isInProgress && !hasObservedFreshCycle.current) {
    console.log("[PmsLoading] Fresh cycle detected:", status);
    hasObservedFreshCycle.current = true;
    
    // Stop aggressive refetch
    if (aggressiveIntervalRef.current) {
      clearInterval(aggressiveIntervalRef.current);
      aggressiveIntervalRef.current = null;
    }
  }
}, [normalizedStatus, status]);
```

### 3. Condicionar Navegação ao Dashboard

```typescript
// Só navegar se fresh cycle foi observado
if (normalizedStatus === "completed" && hasObservedFreshCycle.current) {
  navigate(`/planningmysaas/dashboard/${wizardId}`);
}
```

### 4. Condicionar Exibição da Tela de Erro

```typescript
// Só mostrar erro se fresh cycle foi observado
const showErrorUI = isFailed && hasObservedFreshCycle.current;

if (showErrorUI) {
  return <ErrorUI ... />;
}

// Caso contrário, mostrar skeleton (aguardando ciclo iniciar)
return <GeneratingReportSkeleton ... />;
```

### 5. Simplificar handleRetry

```typescript
const handleRetry = () => {
  setIsRetrying(true);
  hasTriggeredWebhook.current = false;
  hasObservedFreshCycle.current = false; // Reset da flag unificada
  window.location.reload();
};
```

---

## Fluxo Corrigido

```text
┌──────────────────────────────────────────────────────────────────────┐
│                   FLUXO "TRY AGAIN" CORRIGIDO                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. Report falha → status = "Step X - Fail"                         │
│  2. Tela de erro exibida (hasObservedFreshCycle = true)             │
│                                                                      │
│  3. Usuário clica "Try Again"                                        │
│     ├─ hasTriggeredWebhook = false                                   │
│     ├─ hasObservedFreshCycle = false  ← RESET                        │
│     └─ window.location.reload()                                      │
│                                                                      │
│  4. Página remonta                                                   │
│     ├─ Cache ainda tem status "fail"                                 │
│     ├─ isFailed = true                                               │
│     ├─ hasObservedFreshCycle = false                                 │
│     └─ showErrorUI = false ← PROTEÇÃO                                │
│                                                                      │
│  5. Skeleton é exibido (não a tela de erro)                          │
│                                                                      │
│  6. useEffect dispara webhook                                        │
│                                                                      │
│  7. Polling começa (800ms agressivo)                                 │
│                                                                      │
│  8. Status muda para "Step 1 - In Progress"                         │
│     ├─ hasObservedFreshCycle = true                                  │
│     └─ Skeleton mostra progresso                                     │
│                                                                      │
│  9a. Se sucesso → status = "completed"                               │
│      └─ Navega para dashboard                                        │
│                                                                      │
│  9b. Se falha novamente → status = "Step X - Fail"                  │
│      └─ Tela de erro exibida (fresh cycle = true)                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Código Final Resumido

```typescript
// Flags de proteção
const hasTriggeredWebhook = useRef(false);
const hasObservedFreshCycle = useRef(false);

// Status analysis
const normalizedStatus = status?.trim().toLowerCase() || "";
const isFailed = normalizedStatus.includes("fail");
const isCompleted = normalizedStatus === "completed";
const isInProgress = normalizedStatus && 
  !isCompleted && 
  !isFailed;

// Detectar fresh cycle (status não-terminal)
useEffect(() => {
  if (isInProgress && !hasObservedFreshCycle.current) {
    hasObservedFreshCycle.current = true;
  }
}, [isInProgress]);

// Navegação condicional
useEffect(() => {
  if (isCompleted && hasObservedFreshCycle.current) {
    navigate(`/planningmysaas/dashboard/${wizardId}`);
  }
}, [isCompleted, hasObservedFreshCycle.current, ...]);

// Render condicional
const showErrorUI = isFailed && hasObservedFreshCycle.current;

if (showErrorUI) {
  return <ErrorUI />;
}

return <GeneratingReportSkeleton />;
```

---

## Critérios de Aceite

1. **Try Again não mostra erro imediatamente**
   - Clicar "Try Again" → skeleton aparece
   - Webhook é disparado
   - Só mostra erro se falhar novamente

2. **Novo report/regenerate continua funcionando**
   - Navegar para loading → skeleton
   - Ao completar → dashboard

3. **Deep-link para loading com status fail**
   - Se usuário acessar URL diretamente com status fail:
     - Webhook é disparado (nova tentativa)
     - Skeleton é exibido
     - Só mostra erro se falhar novamente

4. **Erro legítimo é exibido corretamente**
   - Se a geração falhar durante um ciclo observado → tela de erro aparece

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/pages/PmsLoading.tsx` | Unificar flags de proteção, condicionar tela de erro |

Apenas 1 arquivo precisa ser modificado.
