

# Plano: Criar Página de Loading Dedicada e Corrigir Fluxo de Geração

## Problema Identificado

O fluxo atual está errado:

```text
ATUAL (ERRADO):
1. Clica em "Get my SaaS Analysis"
2. Dispara confetti (linha 362)
3. Mostra toast de sucesso (linha 365-368)
4. Aguarda 1.5 segundos (linha 371-373)
5. Navega para o dashboard
6. Dashboard detecta status != "Created" e mostra loading interno
```

```text
ESPERADO (CORRETO):
1. Clica em "Get my SaaS Analysis"
2. Navega IMEDIATAMENTE para página de loading (/planningmysaas/loading/{id})
3. Página de loading faz polling do status
4. Quando status = "Created", navega para o dashboard
5. Dashboard dispara confetti
```

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/pages/PmsLoading.tsx` | **CRIAR** - Nova página de loading dedicada |
| `src/App.tsx` | Adicionar nova rota `/planningmysaas/loading/:id` |
| `src/pages/PmsWizard.tsx` | Remover toast, confetti e delay - navegar para página de loading |
| `src/pages/PmsDashboard.tsx` | Disparar confetti ao carregar (relatório já pronto) + remover lógica de isGenerating |

---

## Parte 1: Criar Página de Loading Dedicada

### Arquivo: `src/pages/PmsLoading.tsx` (NOVO)

```typescript
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GeneratingReportSkeleton from "@/components/planningmysaas/skeletons/GeneratingReportSkeleton";
import { useReportData } from "@/hooks/useReportData";
import { useReport } from "@/hooks/useReport";

const PmsLoading = () => {
  const navigate = useNavigate();
  const { id: wizardId } = useParams<{ id: string }>();
  
  // Get wizard data for project name
  const { data: wizardData } = useReport(wizardId);
  const projectName = wizardData?.saas_name || "Your SaaS";
  
  // Get report data with polling (every 5 seconds)
  const { data: reportData } = useReportData(wizardId);
  
  // Track if we've already navigated to avoid double navigation
  const hasNavigated = useRef(false);
  
  // Monitor status and navigate when complete
  useEffect(() => {
    if (hasNavigated.current) return;
    
    const status = reportData?.status;
    
    // Terminal statuses - report is ready
    if (status === "Created" || status === "completed") {
      hasNavigated.current = true;
      navigate(`/planningmysaas/dashboard/${wizardId}`, { replace: true });
    }
    
    // Error statuses - redirect back to reports with error
    if (status === "failed" || status === "error") {
      hasNavigated.current = true;
      navigate("/planningmysaas/reports", { replace: true });
    }
  }, [reportData?.status, wizardId, navigate]);
  
  return (
    <div className="fixed inset-0 z-[100] bg-background">
      <GeneratingReportSkeleton 
        projectName={projectName}
        currentStatus={reportData?.status}
      />
    </div>
  );
};

export default PmsLoading;
```

---

## Parte 2: Adicionar Rota no App.tsx

### Linha ~18: Adicionar import

```typescript
import PmsLoading from "./pages/PmsLoading";
```

### Linha ~51 (após rota do wizard): Adicionar nova rota

```typescript
<Route path="/planningmysaas/loading/:id" element={
  <ProtectedRoute><PmsLoading /></ProtectedRoute>
} />
```

---

## Parte 3: Simplificar Wizard

### Arquivo: `src/pages/PmsWizard.tsx`

**Remover imports não utilizados (linhas 9-10):**
- Remover `useToast` (só será usado para erros)
- Remover `useConfetti`

**Remover no componente (linha ~117):**
```typescript
const { fireConfetti } = useConfetti(); // REMOVER
```

**Substituir linhas 361-373 (confetti + toast + setTimeout) por:**

```typescript
// Navigate immediately to loading screen
navigate(`/planningmysaas/loading/${reportId}`);
```

**Manter apenas o toast de erro (já existe nas linhas 217-223 e 290-295 e 377-381)**

---

## Parte 4: Adicionar Confetti ao Dashboard

### Arquivo: `src/pages/PmsDashboard.tsx`

**Adicionar imports (após linha 17):**
```typescript
import { useConfetti } from "@/hooks/useConfetti";
```

**Adicionar ref no componente PmsDashboardContent (após linha 74):**
```typescript
const hasShownConfetti = useRef(false);
const { fireConfetti } = useConfetti();
```

**Adicionar useEffect para disparar confetti (após linha 210, junto dos outros useEffects):**
```typescript
// Fire confetti when dashboard loads with a completed report
useEffect(() => {
  // Only fire once per mount and only for completed reports
  if (!hasShownConfetti.current && reportData?.status === "Created") {
    hasShownConfetti.current = true;
    // Small delay for UI to render
    setTimeout(() => {
      fireConfetti();
    }, 300);
  }
}, [reportData?.status, fireConfetti]);
```

**Simplificar lógica de isGenerating (linhas 270-276):**

Remover toda a lógica de isGenerating e o bloco que renderiza o loading skeleton (linhas 278-287), pois agora a página de loading é separada.

```typescript
// REMOVER ESTE BLOCO:
const isGenerating = isRegenerating || !reportData?.status || ...

if (isGenerating) {
  return (
    <div className="fixed inset-0 z-[100] bg-background">
      <GeneratingReportSkeleton ... />
    </div>
  );
}
```

**Manter apenas a lógica de isRegenerating para o botão Regenerate**, que continua usando o componente de loading inline.

---

## Fluxo Corrigido

```text
1. Usuário clica "Get my SaaS Analysis"
2. Wizard salva dados no banco
3. Navega IMEDIATAMENTE para /planningmysaas/loading/{id}
4. Página de Loading:
   - Mostra GeneratingReportSkeleton em tela cheia
   - Faz polling do status via useReportData (a cada 5s)
   - Quando status = "Created" → navega para dashboard
5. Dashboard carrega com relatório pronto
6. useEffect detecta que é um relatório novo → dispara confetti
```

---

## Estrutura de Arquivos Final

```text
src/pages/
├── PmsWizard.tsx      (simplificado - sem confetti/toast)
├── PmsLoading.tsx     (NOVO - página de loading dedicada)
└── PmsDashboard.tsx   (com confetti ao carregar)
```

---

## Detalhes Técnicos

| Mudança | Arquivo | Linhas |
|---------|---------|--------|
| Remover `useConfetti` import | PmsWizard.tsx | 10 |
| Remover `const { fireConfetti }` | PmsWizard.tsx | 117 |
| Remover confetti + toast + setTimeout | PmsWizard.tsx | 361-373 |
| Adicionar navegação para loading | PmsWizard.tsx | 361 |
| Criar página PmsLoading | PmsLoading.tsx | NOVO |
| Adicionar rota loading | App.tsx | ~51 |
| Adicionar confetti hook | PmsDashboard.tsx | ~18 |
| Adicionar confetti useEffect | PmsDashboard.tsx | ~211 |
| Remover isGenerating block | PmsDashboard.tsx | 270-287 |

---

## Resultado Esperado

1. Ao clicar no botão, a tela de loading abre INSTANTANEAMENTE
2. A tela mostra o progresso em tempo real dos 10 steps
3. Quando o relatório estiver pronto, redireciona automaticamente
4. O dashboard abre com o relatório completo
5. Confetti dispara celebrando a conclusão

