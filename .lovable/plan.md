
# Plano: Corrigir Exibição de Progresso na Tela de Loading

## Problema Identificado

A tela de loading exibe incorretamente os steps de progresso. Quando o status é "Step 4 ... - Fail":
- Steps 1-3 aparecem como completos ✓ (correto)
- Step 4 aparece como "Failed" ❌ (correto)
- **Step 5 aparece como "In progress..."** (ERRADO - deveria estar inativo)

## Causa Raiz

A lógica em `GeneratingReportSkeleton.tsx` não considera que, quando um step falha, **a geração para completamente**. O código atual ainda calcula o "próximo step" como ativo:

```typescript
// Código problemático atual
const isActive = !isFailed && step.id === currentStep + 1;
// Quando step 4 falha: step 5 tem isFailed=false e 5===4+1, então isActive=true
```

## Solução

Adicionar uma verificação global de falha que impede qualquer step de ser marcado como "active" quando há uma falha no pipeline.

## Mudanças Técnicas

### Arquivo: `src/components/planningmysaas/skeletons/GeneratingReportSkeleton.tsx`

1. **Detectar falha global** - Verificar se há qualquer step que falhou

2. **Corrigir lógica de `isActive`**:
```typescript
// NOVO: Se houve falha, nenhum step está "active" (geração parou)
const hasFailure = failedStep !== null;
const isActive = !hasFailure && step.id === currentStep + 1;
```

3. **Corrigir lógica de `isComplete`**:
```typescript
// Step é complete se:
// - ID < step atual (já passou)
// - Ou ID === step atual E não é o step que falhou
const isComplete = step.id < currentStep || 
  (step.id === currentStep && step.id !== failedStep);
```

4. **Parar progress bar no ponto de falha**:
```typescript
// Se falhou, progresso fica no step anterior ao que falhou
const effectiveStep = failedStep ? failedStep - 1 : currentStep;
const progress = Math.min((effectiveStep / TOTAL_STEPS) * 100, 100);
```

5. **Atualizar tempo estimado para falha**:
```typescript
const getEstimatedTime = (currentStep: number, hasFailure: boolean): string => {
  if (hasFailure) return "Generation stopped";
  // ... resto do código
};
```

## Fluxo Visual Após Correção

### Status: "Step 4 Competitor Research - Fail"

| Step | Status Visual | Explicação |
|------|--------------|------------|
| 1-3 | ✓ Completed | Executaram com sucesso |
| 4 | ❌ Failed | Onde a falha ocorreu |
| 5-11 | (ícone padrão) | Não executaram |

### Status: "Step 5 Market Opportunity - In Progress"

| Step | Status Visual | Explicação |
|------|--------------|------------|
| 1-4 | ✓ Completed | Executaram com sucesso |
| 5 | 🔄 In progress... | Executando agora |
| 6-11 | (ícone padrão) | Aguardando |

## Código Final Resumido

```typescript
const GeneratingReportSkeleton = ({ projectName, currentStatus }: Props) => {
  const currentStep = parseCurrentStep(currentStatus);
  const failedStep = parseFailedStep(currentStatus);
  const hasFailure = failedStep !== null;
  
  // Progress bar: se falhou, mostra até o step anterior à falha
  const effectiveProgress = hasFailure ? failedStep - 1 : currentStep;
  const progress = Math.min((effectiveProgress / TOTAL_STEPS) * 100, 100);

  // Para cada step:
  steps.map((step) => {
    const isFailed = step.id === failedStep;
    
    // Active SOMENTE se não há falha E é o próximo step
    const isActive = !hasFailure && step.id === currentStep + 1;
    
    // Complete se é anterior ao step atual (e não é o que falhou)
    const isComplete = !isFailed && step.id <= currentStep;
    
    // Render...
  });
};
```

## Critérios de Aceite

1. ✅ Quando status = "Step 4 - Fail":
   - Steps 1-3: ✓ completed
   - Step 4: ❌ Failed
   - Steps 5-11: inativos (ícone padrão)

2. ✅ Quando status = "Step 5 - In Progress":
   - Steps 1-4: ✓ completed
   - Step 5: 🔄 In progress...
   - Steps 6-11: inativos

3. ✅ Progress bar reflete corretamente o avanço
   - Em falha: para no step anterior
   - Em progresso: mostra % baseado no step atual

4. ✅ Tempo estimado mostra "Generation stopped" em caso de falha
