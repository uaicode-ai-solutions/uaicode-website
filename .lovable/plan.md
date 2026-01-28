
# Adicionar Botão "My Reports" na Tela de Erro

## Objetivo

Incluir um botão "My Reports" na tela de erro do PmsLoading que navega para `/planningmysaas/reports`.

## Alterações

### Arquivo: `src/pages/PmsLoading.tsx`

**1. Adicionar ícone FileText no import (linha 5)**

```typescript
import { AlertTriangle, ArrowLeft, RefreshCw, FileText } from "lucide-react";
```

**2. Adicionar handler para navegação (após linha 199)**

```typescript
// Handle go to reports
const handleGoToReports = useCallback(() => {
  navigate('/planningmysaas/reports', { replace: true });
}, [navigate]);
```

**3. Adicionar botão no grupo de Action Buttons (linhas 267-284)**

O grupo atual tem 2 botões em flex. Adicionar um terceiro botão "My Reports" abaixo dos existentes:

```typescript
{/* Action Buttons */}
<div className="flex flex-col gap-3">
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
      onClick={handleRetryFailedStep}
      disabled={isRetrying}
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
      {isRetrying ? "Preparing..." : "Retry"}
    </Button>
  </div>
  <Button
    variant="ghost"
    className="w-full"
    onClick={handleGoToReports}
  >
    <FileText className="w-4 h-4 mr-2" />
    My Reports
  </Button>
</div>
```

## Resultado Visual

```
┌─────────────────────────────────────┐
│         ⚠️ (Error Icon)             │
│                                     │
│    Report Generation Failed         │
│    We encountered an issue...       │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Failed at Step X: ...       │    │
│  │ The AI analysis could not...│    │
│  └─────────────────────────────┘    │
│                                     │
│  [Back to Wizard]  [Retry]          │
│         [My Reports]                │ ← NOVO
│                                     │
│  If the problem persists...         │
└─────────────────────────────────────┘
```

## Impacto

- Nenhuma alteração em outros elementos da tela
- O botão usa variant="ghost" para ser secundário visualmente
- Layout mantido com flex column para acomodar o terceiro botão
