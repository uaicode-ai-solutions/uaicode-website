
# Plano: Simplificar e Corrigir a Tela de Loading

## Resumo do Problema

A tela de loading tem vários problemas de complexidade desnecessária:

1. **Array de steps com ordenação confusa**: IDs fora de ordem `[1, 7, 2, 8, 3, 9, ...]` para layout 2 colunas
2. **Lógica de parsing complexa**: Diferenciação entre `id`, `currentStep`, `failedStep` causando bugs
3. **Trigger automático no mount**: Dispara `pms-orchestrate-report` automaticamente, sem controle do usuário ao dar F5
4. **Ausência de escolha no refresh**: Não pergunta se quer retomar ou reiniciar

## Solução Proposta

### Arquitetura Simplificada

```text
┌─────────────────────────────────────────────────────────────┐
│                      PmsLoading.tsx                         │
│                                                             │
│  1. Ao entrar: verifica status atual do banco               │
│  2. Se status é "in progress": mostra diálogo de escolha    │
│  3. Se status é "completed": vai para dashboard             │
│  4. Se status é "failed": mostra tela de erro               │
│  5. Se status é vazio/inicial: inicia geração               │
│                                                             │
│  Após escolha/início: poll a cada 5s e atualiza skeleton    │
└─────────────────────────────────────────────────────────────┘
```

### Mudanças Técnicas

#### 1. `GeneratingReportSkeleton.tsx` - Simplificar Steps

**Problema atual:**
- Array com IDs fora de ordem: `[1, 7, 2, 8, 3, 9, 4, 10, 5, 11, 6]`
- Lógica de comparação `step.id <= currentStep` não funciona corretamente

**Solução:**
- **Uma única lista ordenada 1→11**
- **Usar apenas `index` (0-10) internamente**
- **Remover campo `id` - usar posição no array**

```typescript
// ANTES: Array com IDs embaralhados
const steps = [
  { id: 1, label: "Initialize Report", icon: Zap },
  { id: 7, label: "Pricing strategy", icon: Tag },
  { id: 2, label: "Investment analysis", icon: DollarSign },
  // ...confuso
];

// DEPOIS: Array sequencial simples (1 coluna)
const STEPS = [
  { label: "Initialize Report", icon: Zap },           // index 0 = Step 1
  { label: "Investment Analysis", icon: DollarSign },  // index 1 = Step 2
  { label: "Market Benchmarks", icon: Target },        // index 2 = Step 3
  { label: "Competitor Research", icon: BarChart3 },   // index 3 = Step 4
  { label: "Market Opportunity", icon: TrendingUp },   // index 4 = Step 5
  { label: "Customer Profiling", icon: Users },        // index 5 = Step 6
  { label: "Pricing Strategy", icon: Tag },            // index 6 = Step 7
  { label: "Paid Media Analysis", icon: Megaphone },   // index 7 = Step 8
  { label: "Growth Projections", icon: Rocket },       // index 8 = Step 9
  { label: "Executive Summary", icon: FileText },      // index 9 = Step 10
  { label: "Final Scoring", icon: Trophy },            // index 10 = Step 11
];
```

**Lógica simplificada:**

```typescript
// Parse do status
const parseStatus = (status: string | undefined) => {
  if (!status) return { lastCompleted: -1, failed: null, inProgress: null };
  
  const normalized = status.trim().toLowerCase();
  if (normalized === "completed") {
    return { lastCompleted: 10, failed: null, inProgress: null }; // Todos OK
  }
  
  const match = status.match(/Step (\d+)/i);
  if (!match) return { lastCompleted: -1, failed: null, inProgress: null };
  
  const stepNum = parseInt(match[1]); // 1-11
  const stepIndex = stepNum - 1;      // 0-10
  
  if (normalized.includes("fail")) {
    return { lastCompleted: stepIndex - 1, failed: stepIndex, inProgress: null };
  }
  if (normalized.includes("in progress")) {
    return { lastCompleted: stepIndex - 1, failed: null, inProgress: stepIndex };
  }
  if (normalized.includes("completed")) {
    return { lastCompleted: stepIndex, failed: null, inProgress: null };
  }
  
  return { lastCompleted: stepIndex - 1, failed: null, inProgress: stepIndex };
};

// Para cada step (usando index do map):
STEPS.map((step, index) => {
  const stepNumber = index + 1; // 1-11 para display
  
  const isComplete = index <= lastCompleted;
  const isActive = index === inProgress;
  const isFailed = index === failed;
  const isPending = !isComplete && !isActive && !isFailed;
  
  // Render com uma única coluna
});
```

#### 2. `PmsLoading.tsx` - Adicionar Diálogo de Escolha no Refresh

**Novo componente: `ResumeOrRestartDialog`**

Quando o usuário entra na página e já existe um status "in progress" ou "failed":

```typescript
// Estados possíveis ao entrar na página:
// 1. null/undefined → Primeira geração, iniciar automaticamente
// 2. "completed" → Ir para dashboard
// 3. "Step X - In Progress" → Mostrar diálogo: Retomar ou Reiniciar?
// 4. "Step X - Fail" → Mostrar tela de erro com botões
```

**Fluxo:**

```text
Entrar em /loading/:id
         ↓
  Buscar status do banco
         ↓
    ┌────┴────────────────────────────┐
    ↓              ↓                  ↓                    ↓
  null       "completed"        "Step X - ..."        "Step X - Fail"
    ↓              ↓                  ↓                    ↓
 Iniciar       Dashboard         Diálogo:              Tela de erro:
 geração       redirect        "Retomar ou            "Try Again" ou
                               Reiniciar?"            "Back to Wizard"
```

**Diálogo de escolha:**

```tsx
<AlertDialog open={showResumeDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Report Generation in Progress</AlertDialogTitle>
      <AlertDialogDescription>
        We found an existing generation at Step {currentStep}.
        Would you like to resume or start over?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={handleResume}>
        Resume from Step {currentStep}
      </AlertDialogCancel>
      <AlertDialogAction onClick={handleRestart}>
        Start Over
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### 3. Retry de Step Falho (não reiniciar do zero)

Quando o usuário clica "Try Again" após uma falha:

```typescript
const handleRetryFailedStep = async () => {
  // 1. Não recarregar a página
  // 2. Chamar pms-orchestrate-report com flag para retomar
  // OU: Atualizar status no banco para "Step X - In Progress"
  //     e deixar o orchestrator continuar
};
```

**Opção mais simples:** O orchestrator já verifica o status atual. Podemos apenas:
1. Atualizar o status de "Step X - Fail" para "Step X - In Progress"
2. Re-chamar o orchestrator

Mas o orchestrator atual sempre começa do Step 1. Precisamos modificá-lo para aceitar um parâmetro `resume_from_step`.

**Mudança no orchestrator:**

```typescript
// pms-orchestrate-report/index.ts
const { wizard_id, resume_from_step } = await req.json();

// Se resume_from_step foi passado, pular steps anteriores
const startIndex = resume_from_step ? resume_from_step - 1 : 0;

for (let i = startIndex; i < TOOLS_SEQUENCE.length; i++) {
  const tool = TOOLS_SEQUENCE[i];
  // ... execução normal
}
```

### Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `GeneratingReportSkeleton.tsx` | Simplificar array de steps (ordem 1→11), usar index, uma coluna |
| `PmsLoading.tsx` | Adicionar diálogo de escolha Retomar/Reiniciar, remover trigger automático |
| `pms-orchestrate-report/index.ts` | Aceitar parâmetro `resume_from_step` opcional |

### Fluxo Completo Simplificado

```text
1. Usuário entra em /loading/:id

2. Busca status do banco:
   - null → Iniciar geração (Step 1)
   - "completed" → Redirect para dashboard
   - "Step X - In Progress" → Diálogo: Retomar ou Reiniciar?
   - "Step X - Fail" → Tela de erro

3. Se escolher Retomar:
   - Chamar orchestrator com resume_from_step = X

4. Se escolher Reiniciar:
   - Chamar orchestrator sem resume_from_step (começa do 1)

5. Durante geração:
   - Poll a cada 5s
   - Skeleton mostra:
     * Steps < lastCompleted: ✓
     * Step === inProgress: 🔄
     * Step === failed: ❌
     * Steps > inProgress: ⏳ (inativo)

6. Ao completar todos os steps:
   - Redirect para dashboard
```

### Visual do Skeleton (Uma Coluna)

```text
┌────────────────────────────────────────────┐
│         🚀 Generating Your Report          │
│   Our AI is analyzing "MeuProjeto"         │
│                                            │
│   [████████████░░░░░░░░░░░░] 54%           │
│   ~2 min remaining                         │
│                                            │
│   ┌──────────────────────────────────────┐ │
│   │ ✓ 1. Initialize Report          ✓   │ │
│   │ ✓ 2. Investment Analysis        ✓   │ │
│   │ ✓ 3. Market Benchmarks          ✓   │ │
│   │ ✓ 4. Competitor Research        ✓   │ │
│   │ ✓ 5. Market Opportunity         ✓   │ │
│   │ 🔄 6. Customer Profiling    In prog │ │
│   │ ⏳ 7. Pricing Strategy              │ │
│   │ ⏳ 8. Paid Media Analysis           │ │
│   │ ⏳ 9. Growth Projections            │ │
│   │ ⏳ 10. Executive Summary            │ │
│   │ ⏳ 11. Final Scoring                │ │
│   └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### Critérios de Aceite

1. **Steps em ordem**: Lista 1→11, uma coluna, sem confusão de IDs
2. **F5/Refresh**: Mostra diálogo perguntando se quer Retomar ou Reiniciar
3. **Try Again**: Retoma do step falho, não reinicia do zero
4. **Progresso correto**:
   - Steps completos: ✓
   - Step em execução: 🔄
   - Step falho: ❌
   - Steps pendentes: ⏳ (ícone padrão)
5. **Sem trigger automático**: Só inicia geração após escolha do usuário ou se for primeira execução
