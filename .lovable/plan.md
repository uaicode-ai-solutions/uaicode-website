
# Plano: Correção Definitiva do Fluxo Loading ↔ Dashboard

## Resumo das Mudanças

O fluxo será simplificado para:
- **Status válidos**: apenas `"completed"` (sucesso) e `"Step X ... - Fail"` (falha)
- **Dashboard só acessível se status = "completed"** - senão, redireciona para Loading
- **Loading page é o único lugar que dispara o webhook**

---

## Arquivos a Modificar

### 1. `src/hooks/useReportData.ts`
**Objetivo**: Simplificar lógica de polling

**Mudanças**:
- Remover `"Created"` como status terminal (não é mais usado)
- Terminal = apenas `"completed"` ou contém `"fail"`
- Continuar polling em qualquer outro caso

```typescript
// Polling logic simplificada
const isTerminal = 
  normalizedStatus === "completed" || 
  normalizedStatus.includes("fail");
```

---

### 2. `src/pages/PmsLoading.tsx`
**Objetivo**: Evitar navegação prematura por cache antigo

**Mudanças**:
- Adicionar guarda `hasSeenNonCompleted` para só navegar ao dashboard após observar status não-completed
- Adicionar "force refetch" agressivo após disparar o webhook (a cada 800ms por 15s)
- Remover referências a status "Created" e "Started"

**Nova lógica de navegação**:
```typescript
// Só navegar se:
// 1. Status atual é "completed"
// 2. E já vimos algum status não-completed nesta sessão
if (normalizedStatus === "completed" && hasSeenNonCompleted.current) {
  navigate(`/planningmysaas/dashboard/${wizardId}`);
}
```

---

### 3. `src/pages/PmsDashboard.tsx`
**Objetivo**: Dashboard só acessível se completed, senão redireciona

**Mudanças**:
- Adicionar `useEffect` que redireciona para `/loading/:id` se status ≠ "completed"
- Corrigir confetti (trocar `"Created"` → `"completed"`)
- Manter skeleton apenas para `isLoading || !reportData` (crash protection)

**Nova lógica**:
```typescript
// Redirect to loading if not completed
useEffect(() => {
  if (!isLoading && reportData && wizardId) {
    const status = reportData.status?.trim().toLowerCase();
    if (status !== "completed") {
      navigate(`/planningmysaas/loading/${wizardId}`, { replace: true });
    }
  }
}, [isLoading, reportData, wizardId, navigate]);
```

---

### 4. `src/components/planningmysaas/skeletons/GeneratingReportSkeleton.tsx`
**Objetivo**: Alinhar com status reais do orchestrator

**Mudanças**:
- Remover tratamento de "Created" e "Started"
- `"completed"` = 100%
- `undefined/null` ou início = 0%
- Atualizar TOTAL_STEPS para 11 (conforme orchestrator atual)

---

### 5. `src/components/planningmysaas/reports/ReportCard.tsx`
**Objetivo**: Corrigir detecção de "generating" e navegação

**Mudanças**:
- `isGenerating` = status ≠ "completed" (e não contém "fail")
- `handleView`: se completed → dashboard, senão → loading

---

### 6. `src/hooks/useReports.ts`
**Objetivo**: Garantir report mais recente por wizard

**Mudanças**:
- Adicionar `created_at` no select
- Ordenar por `created_at desc` e pegar primeiro por wizard_id

---

## Fluxo Final

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FLUXO UNIFICADO                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Wizard Submit ───┐                                                  │
│                   │                                                  │
│  Dashboard        ├──▶ navigate("/loading/:id") ──▶ Loading Page    │
│  Regenerate ──────┤        (sem webhook)             │               │
│                   │                                  │               │
│  Retry Button ────┘                                  ▼               │
│                                              ┌──────────────────┐    │
│                                              │ useEffect mount  │    │
│                                              │ → dispara webhook│    │
│                                              └────────┬─────────┘    │
│                                                       │              │
│                                                       ▼              │
│                                              ┌──────────────────┐    │
│                                              │ Polling status   │    │
│                                              │ (a cada 5s)      │    │
│                                              └────────┬─────────┘    │
│                                                       │              │
│                                     ┌─────────────────┼──────────────┤
│                                     │                 │              │
│                               status="completed"   status="fail"    │
│                               + já viu não-completed                 │
│                                     │                 │              │
│                                     ▼                 ▼              │
│                              ┌───────────┐     ┌────────────┐        │
│                              │ Dashboard │     │ Error UI   │        │
│                              │ (estático)│     │ + Retry    │        │
│                              └───────────┘     └────────────┘        │
│                                                                      │
│  Deep-link para Dashboard ──▶ se status ≠ completed ──▶ Loading     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Detalhes Técnicos

### Proteção contra Cache (PmsLoading.tsx)

O problema atual: ao clicar "Regenerate", o React Query ainda tem o status `"completed"` em cache do report anterior. A Loading page vê isso e navega de volta imediatamente.

**Solução**:
1. `hasSeenNonCompleted` ref = false ao montar
2. Quando status muda para qualquer coisa ≠ "completed" → marcar true
3. Só permitir navegação ao dashboard quando:
   - status === "completed" **E**
   - hasSeenNonCompleted === true

Isso garante que o "completed" observado é **novo**, não do cache.

### Force Refetch Agressivo

Após disparar o webhook, fazer refetch a cada 800ms por ~15s para capturar rapidamente a transição de status do cache antigo para o novo "Step 1 ... In Progress".

```typescript
// Após chamar invoke()
const intervalId = setInterval(() => refetch(), 800);
setTimeout(() => clearInterval(intervalId), 15000);
```

---

## Critérios de Aceite

1. ✅ Clicar "Regenerate" no Dashboard → vai para Loading e **não volta**
2. ✅ Loading mostra progresso dos steps em tempo real
3. ✅ Só vai para Dashboard quando status = "completed" (após ciclo de geração)
4. ✅ Deep-link direto para Dashboard de report não-completed → redireciona para Loading
5. ✅ Erro (Fail) → Loading mostra tela de erro com Retry
6. ✅ Retry → recarrega e dispara webhook novamente
7. ✅ Reports list: card de report em progresso mostra spinner
