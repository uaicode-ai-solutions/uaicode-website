
# Plano: Simplificar Fluxo de Regeneração

## Problema Atual

O código está complicado demais com variáveis de estado (`isRegenerating`, `regenerationStarted`, `prevStatusRef`) e lógica de monitoramento duplicada. A página `PmsLoading` já faz tudo que precisa:
- Faz polling a cada 5 segundos
- Mostra o step-by-step
- Redireciona quando status = "completed"
- Mostra erro quando status contém "fail"

## Solução Simples

**Quando clicar em "Regenerate"** → Simplesmente navegar para `/planningmysaas/loading/{id}` (página que já existe e funciona perfeitamente).

## Alterações

### 1. Arquivo: `src/pages/PmsDashboard.tsx`

**Remover:**
- Estado `isRegenerating` (linha 67)
- Estado `regenerationStarted` (linha 68)
- Ref `prevStatusRef` (linha 72)
- Todo o `useEffect` de monitoramento (linhas 87-123)
- O bloco de renderização do `GeneratingReportSkeleton` (linhas 262-271)

**Simplificar `handleRegenerateReport`:**
```typescript
const handleRegenerateReport = async () => {
  if (!wizardId) return;
  
  try {
    // Dispara o webhook n8n
    await supabase.functions.invoke('pms-trigger-n8n-report', {
      body: { wizard_id: wizardId }
    });
    
    // Simplesmente navega para a tela de loading
    navigate(`/planningmysaas/loading/${wizardId}`);
  } catch (err) {
    console.error("Erro ao regenerar:", err);
  }
};
```

### 2. Arquivo: `src/pages/PmsLoading.tsx`

**Atualizar condição de sucesso (linha 65):**
```typescript
// Antes
if (status === "Created" || status === "completed") {

// Depois (conforme você vai mudar no n8n para "completed")
if (status === "completed") {
```

### 3. Arquivo: `src/pages/PmsDashboard.tsx` - Condição de Loading

**Simplificar verificação de status (linha 220-221):**
```typescript
// Antes
const isReportReady = reportData?.status === "Created" || reportData?.status === "completed";
if (isLoading || !reportData || !isReportReady) {

// Depois
if (isLoading || !reportData || reportData?.status !== "completed") {
```

## Fluxo Simplificado

```text
┌─────────────────┐
│  Dashboard      │
│  (Regenerate)   │
└────────┬────────┘
         │ 1. Dispara webhook
         │ 2. navigate("/loading/{id}")
         ▼
┌─────────────────┐
│  PmsLoading     │
│  (já existente) │
│  - Polling 5s   │
│  - Step-by-step │
└────────┬────────┘
         │ status === "completed"
         ▼
┌─────────────────┐
│  Dashboard      │
│  (dados prontos)│
└─────────────────┘
```

## Resumo das Remoções

| Arquivo | O que remover |
|---------|---------------|
| `PmsDashboard.tsx` | `isRegenerating`, `regenerationStarted`, `prevStatusRef`, useEffect de monitoramento, bloco if(isRegenerating) |

## Resultado

- Código muito mais simples
- Uma única fonte de verdade (PmsLoading)
- Sem estados complicados de rastrear
- Funciona tanto para geração inicial quanto regeneração
