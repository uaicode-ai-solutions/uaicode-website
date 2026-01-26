
# Plano: Remoção Completa de Toasts do Sistema

## Objetivo

Remover todas as notificações toast do sistema para evitar problemas. Isso inclui ambos os sistemas de toast atualmente em uso: **Radix UI Toast** (useToast) e **Sonner**.

---

## Arquivos a Modificar

### Componentes com useToast (Radix)

| Arquivo | Linhas | Toasts |
|---------|--------|--------|
| `src/pages/PmsWizard.tsx` | 215-220, 288-293 | 2 toasts |
| `src/pages/PmsDashboard.tsx` | 121-125, 154-159, 183-186, 192-201 | 5 toasts |
| `src/pages/PmsProfile.tsx` | 79-88, 91-95, 103-116, 125-128, 491-504 | 7 toasts |
| `src/components/ChatSection.tsx` | 75-80, 162-167 | 2 toasts |
| `src/components/chat/EmailContactDialog.tsx` | 92-95 | 1 toast |
| `src/components/ROICalculator.tsx` | 81-85, 88-93 | 2 toasts |
| `src/components/Schedule.tsx` | 175-179 | 1 toast |
| `src/components/planningmysaas/PmsFooter.tsx` | 57-61 | 1 toast |
| `src/components/planningmysaas/dashboard/ShareReportDialog.tsx` | 37-47, 52-68, 77-80 | 5 toasts |

### Componentes com Sonner

| Arquivo | Linhas | Toasts |
|---------|--------|--------|
| `src/components/planningmysaas/wizard/StepYourIdea.tsx` | 132, 192-197, 209, 216, 221, 277-282, 293, 298 | 10 toasts |
| `src/components/blog/SocialShareButtons.tsx` | 27 | 1 toast |
| `src/components/planningmysaas/dashboard/sections/BrandAssetsTab.tsx` | 28 | 1 toast |
| `src/components/planningmysaas/dashboard/marketing/MarketingServiceSelector.tsx` | 281-283 | 1 toast |
| `src/pages/PmsResetPassword.tsx` | 78 | 1 toast |

### Infraestrutura (Arquivos a Remover/Limpar)

| Arquivo | Ação |
|---------|------|
| `src/components/ui/toaster.tsx` | Manter arquivo vazio ou com componente dummy |
| `src/components/ui/sonner.tsx` | Manter arquivo vazio ou com componente dummy |
| `src/hooks/use-toast.ts` | Manter arquivo com hook dummy |
| `src/components/ui/use-toast.ts` | Manter arquivo com re-export dummy |
| `src/App.tsx` | Remover `<Toaster />` e `<Sonner />` das linhas 30-31 |

---

## Estratégia de Remoção

### Para cada componente:

1. **Remover imports** de `useToast`, `toast` do sonner
2. **Remover chamadas** `toast({...})` e `toast.success/error/info()`
3. **Manter a lógica de negócio** (validações, returns, etc.)
4. **Usar console.log** para debugging onde necessário

### Exemplo de Transformação

**Antes:**
```typescript
import { useToast } from "@/hooks/use-toast";

const Component = () => {
  const { toast } = useToast();
  
  const handleSave = async () => {
    try {
      await saveData();
      toast({ title: "Saved!", description: "Data saved." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    }
  };
};
```

**Depois:**
```typescript
const Component = () => {
  const handleSave = async () => {
    try {
      await saveData();
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };
};
```

---

## Detalhes por Arquivo

### 1. `src/App.tsx`
- Remover import do `Toaster` de `@/components/ui/toaster`
- Remover import do `Sonner` de `@/components/ui/sonner`
- Remover `<Toaster />` (linha 30)
- Remover `<Sonner />` (linha 31)

### 2. `src/pages/PmsWizard.tsx`
- Remover import `useToast`
- Remover `const { toast } = useToast();`
- Linha 215-220: Remover toast "Authentication Required" (manter apenas o return)
- Linha 288-293: Remover toast "Error saving report" (manter apenas o return)

### 3. `src/pages/PmsDashboard.tsx`
- Remover import `useToast`
- Remover `const { toast } = useToast();`
- Linha 121-125: Remover toast de falha de regeneração
- Linha 154-159: Remover toast de falha do n8n trigger
- Linha 183-186: Remover toast de logout
- Linha 192-201: Remover toasts de copy link (sucesso/falha)

### 4. `src/pages/PmsProfile.tsx`
- Remover import `useToast`
- Remover `const { toast } = useToast();`
- Linhas 79-95: Remover toasts de update de perfil
- Linhas 103-116: Remover toasts de validação de senha
- Linha 125-128: Remover toast de sucesso de senha
- Linhas 491-504: Remover toasts de delete account

### 5. `src/components/ChatSection.tsx`
- Remover import `useToast`
- Remover `const { toast } = useToast();`
- Linha 75-80: Remover toast de erro de voz
- Linha 162-167: Remover toast de erro de mensagem

### 6. `src/components/chat/EmailContactDialog.tsx`
- Remover import `useToast`
- Remover `const { toast } = useToast();`
- Linha 92-95: Remover toast "Message Sent!"

### 7. `src/components/ROICalculator.tsx`
- Remover import `useToast`
- Remover `const { toast } = useToast();`
- Linhas 81-93: Remover toasts de PDF (sucesso/falha)

### 8. `src/components/Schedule.tsx`
- Remover import `useToast`
- Remover `const { toast } = useToast();`
- Linha 175-179: Remover toast de erro de form

### 9. `src/components/planningmysaas/PmsFooter.tsx`
- Remover import `useToast`
- Remover `const { toast } = useToast();`
- Linhas 57-61: Remover toast de email duplicado

### 10. `src/components/planningmysaas/dashboard/ShareReportDialog.tsx`
- Remover import `useToast`
- Remover `const { toast } = useToast();`
- Linhas 37-47: Remover toasts de copy link
- Linhas 52-68: Remover toasts de validação de email
- Linhas 77-80: Remover toast de email enviado

### 11. `src/components/planningmysaas/wizard/StepYourIdea.tsx`
- Remover import `toast` do sonner
- Remover todos os `toast.error()`, `toast.success()` (10 ocorrências)

### 12. `src/components/blog/SocialShareButtons.tsx`
- Remover import `toast` do sonner
- Linha 27: Remover `toast.success("Link copied...")`

### 13. `src/components/planningmysaas/dashboard/sections/BrandAssetsTab.tsx`
- Remover import `toast` do sonner
- Linha 28: Remover `toast.success("Copied...")`

### 14. `src/components/planningmysaas/dashboard/marketing/MarketingServiceSelector.tsx`
- Remover import `toast` do sonner
- Linhas 281-283: Remover `toast.info("Project Manager...")`

### 15. `src/pages/PmsResetPassword.tsx`
- Remover import `toast` do sonner
- Linha 78: Remover `toast.success("Password updated...")`

### 16. Arquivos de Infraestrutura

#### `src/components/ui/toaster.tsx`
Substituir por componente vazio:
```typescript
export function Toaster() {
  return null;
}
```

#### `src/components/ui/sonner.tsx`
Substituir por componente vazio:
```typescript
export const Toaster = () => null;
export const toast = {
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
};
```

#### `src/hooks/use-toast.ts`
Manter hook dummy para evitar erros de import:
```typescript
export function useToast() {
  return {
    toast: () => {},
    toasts: [],
    dismiss: () => {},
  };
}

export const toast = () => {};
```

---

## Resumo

| Categoria | Arquivos | Toasts Removidos |
|-----------|----------|------------------|
| Páginas PMS | 4 | 15 |
| Componentes Chat | 2 | 3 |
| Componentes Forms | 2 | 3 |
| Componentes PMS | 5 | 18 |
| Infraestrutura | 4 | - |
| **Total** | **17 arquivos** | **39 toasts** |

---

## Observações

- Validações de formulário que usavam toast para feedback agora só bloquearão a ação silenciosamente
- Erros de API serão logados no console para debugging
- O fluxo de negócio permanece intacto, apenas sem feedback visual via toast
- Componentes de toast ficam como "no-op" para evitar erros de import em casos não mapeados
