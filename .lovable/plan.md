

# Plano: Adicionar Detecção de Falha na Tela de Loading

## Contexto

O n8n pode atualizar o campo `status` com padrões de falha como `"Step X - Fail"`. A tela de loading deve detectar isso e exibir uma interface de erro amigável com opções para o usuário.

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/hooks/useReportData.ts` | Corrigir lógica de polling + detectar status "Fail" |
| `src/pages/PmsLoading.tsx` | Adicionar estado de erro com UI e botões de ação |
| `src/components/planningmysaas/skeletons/GeneratingReportSkeleton.tsx` | Adicionar detecção visual de step com falha |

---

## Parte 1: Corrigir Polling e Adicionar Detecção de Falha

### Arquivo: `src/hooks/useReportData.ts`

Atualizar a lógica de `refetchInterval` para:
1. Continuar polling quando não há dados ainda
2. Parar quando status é terminal (sucesso OU falha)

```typescript
refetchInterval: (query) => {
  const data = query.state.data as ReportData | null;
  const status = data?.status;
  
  // Terminal statuses - stop polling
  const isTerminal = 
    status === "Created" || 
    status === "completed" || 
    status === "failed" || 
    status === "error" ||
    (status && status.toLowerCase().includes("fail"));
  
  if (isTerminal) {
    return false;
  }
  
  // Continue polling: no data yet OR in-progress status
  return 5000;
},
```

---

## Parte 2: Criar UI de Erro na Página de Loading

### Arquivo: `src/pages/PmsLoading.tsx`

Adicionar lógica para detectar falha e renderizar tela de erro:

```typescript
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import GeneratingReportSkeleton from "@/components/planningmysaas/skeletons/GeneratingReportSkeleton";
import { useReportData } from "@/hooks/useReportData";
import { useReport } from "@/hooks/useReport";
import { supabase } from "@/integrations/supabase/client";

// Helper to detect failure status
const isFailureStatus = (status: string | undefined): boolean => {
  if (!status) return false;
  return status.toLowerCase().includes("fail");
};

// Helper to extract failed step from status
const parseFailedStep = (status: string | undefined): { stepNumber: number; stepName: string } | null => {
  if (!status) return null;
  // Pattern: "Step X Name - Fail" or "Step X - Fail"
  const match = status.match(/Step (\d+)\s*([^-]*)?-?\s*Fail/i);
  if (match) {
    return {
      stepNumber: parseInt(match[1]),
      stepName: match[2]?.trim() || `Step ${match[1]}`
    };
  }
  return null;
};

const PmsLoading = () => {
  const navigate = useNavigate();
  const { id: wizardId } = useParams<{ id: string }>();
  const [isRetrying, setIsRetrying] = useState(false);
  
  const { data: wizardData } = useReport(wizardId);
  const projectName = wizardData?.saas_name || "Your SaaS";
  
  const { data: reportData, refetch } = useReportData(wizardId);
  const hasNavigated = useRef(false);
  
  const status = reportData?.status;
  const isFailed = isFailureStatus(status);
  const failedStepInfo = parseFailedStep(status);
  
  // Navigate on success
  useEffect(() => {
    if (hasNavigated.current) return;
    
    if (status === "Created" || status === "completed") {
      hasNavigated.current = true;
      navigate(`/planningmysaas/dashboard/${wizardId}`, { replace: true });
    }
  }, [status, wizardId, navigate]);
  
  // Handle retry
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Reset the report status and trigger regeneration
      await supabase.functions.invoke('pms-generate-report', {
        body: { reportId: wizardId }
      });
      // Refetch to get new status
      await refetch();
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  };
  
  // Handle back to wizard
  const handleBackToWizard = () => {
    navigate(`/planningmysaas/wizard?edit=${wizardId}`, { replace: true });
  };
  
  // Show error UI if failed
  if (isFailed) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          
          {/* Error Message */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Report Generation Failed
            </h2>
            <p className="text-muted-foreground">
              We encountered an issue while analyzing <span className="font-semibold text-accent">{projectName}</span>
            </p>
          </div>
          
          {/* Failed Step Details */}
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              {failedStepInfo 
                ? `Failed at Step ${failedStepInfo.stepNumber}: ${failedStepInfo.stepName}`
                : "Processing Error"
              }
            </AlertTitle>
            <AlertDescription>
              The AI analysis could not complete this step. You can try again or go back to review your inputs.
            </AlertDescription>
          </Alert>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleBackToWizard}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Wizard
            </Button>
            <Button
              className="flex-1"
              onClick={handleRetry}
              disabled={isRetrying}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? "Retrying..." : "Try Again"}
            </Button>
          </div>
          
          {/* Help Text */}
          <p className="text-xs text-muted-foreground text-center">
            If the problem persists, please contact support with your report ID: <code className="text-xs bg-muted px-1 py-0.5 rounded">{wizardId}</code>
          </p>
        </div>
      </div>
    );
  }
  
  // Normal loading state
  return (
    <div className="fixed inset-0 z-[100] bg-background">
      <GeneratingReportSkeleton 
        projectName={projectName}
        currentStatus={status}
      />
    </div>
  );
};

export default PmsLoading;
```

---

## Parte 3: Adicionar Visual de Falha no Skeleton (Opcional)

### Arquivo: `src/components/planningmysaas/skeletons/GeneratingReportSkeleton.tsx`

Adicionar detecção de step com falha para feedback visual antes do redirecionamento:

```typescript
// Adicionar função helper após parseCurrentStep
const parseFailedStep = (status: string | undefined): number | null => {
  if (!status) return null;
  const match = status.match(/Step (\d+).*Fail/i);
  return match ? parseInt(match[1]) : null;
};

// No componente, adicionar:
const failedStep = parseFailedStep(currentStatus);

// No render de cada step, adicionar estilo de falha:
const isFailed = step.id === failedStep;
// Usar cor vermelha e ícone X para steps com falha
```

---

## Fluxo Completo

```text
1. Usuário clica "Get my SaaS Analysis"
2. Wizard salva dados → navega para /planningmysaas/loading/{wizardId}
3. PmsLoading faz polling do status a cada 5s
4. Cenários:
   a) status = "Created" → navega para dashboard → confetti
   b) status = "Step X - Fail" → mostra tela de erro com:
      - Indicação do step que falhou
      - Botão "Back to Wizard" → volta ao último step do wizard
      - Botão "Try Again" → chama pms-generate-report novamente
```

---

## Status Patterns Detectados

| Pattern | Comportamento |
|---------|---------------|
| `"Created"` ou `"completed"` | Sucesso → navega para dashboard |
| `"Step X - Fail"` | Falha → mostra tela de erro |
| `"Step X Name"` (sem Fail) | Em progresso → continua polling |
| `undefined` | Aguardando registro → continua polling |

---

## Detalhes Técnicos

| Arquivo | Linhas | Mudança |
|---------|--------|---------|
| `useReportData.ts` | 36-44 | Atualizar lógica de polling para continuar sem dados |
| `PmsLoading.tsx` | Todo | Adicionar estado de erro, helpers e UI |
| `GeneratingReportSkeleton.tsx` | ~28-35, ~86-125 | Adicionar visual de step com falha (opcional) |

---

## Comportamento dos Botões

### "Back to Wizard"
- Navega para `/planningmysaas/wizard?edit={wizardId}`
- Usuário pode revisar/alterar inputs antes de tentar novamente
- Não executa nada automaticamente

### "Try Again"
- Chama `pms-generate-report` manualmente
- Mostra estado de loading no botão
- Após chamada, refaz polling para acompanhar novo status
- Não é automático - requer clique do usuário

