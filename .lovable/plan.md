
# Plano: Substituir Console.error por Popups de Erro no Export PDF

## Objetivo

Alterar o tratamento de erros do "Export to PDF" para exibir popups (AlertDialog) ao invés de apenas logar no console, garantindo feedback visual claro para o usuário.

---

## 1. Cenários de Erro

| Cenário | Mensagem do Popup |
|---------|-------------------|
| **Business Plan vazio** | "Business Plan is not available. Please ensure the report has been fully generated before exporting." |
| **Erro no jsPDF** | "An error occurred while generating the PDF. Please try again or contact support if the problem persists." |

---

## 2. Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/lib/businessPlanPdfExport.ts` | Adicionar try/catch e retornar objeto de resultado |
| `src/pages/PmsDashboard.tsx` | Adicionar estado de erro + AlertDialog para exibir popup |

---

## 3. Modificar businessPlanPdfExport.ts

### 3.1 Alterar Tipo de Retorno

```typescript
// Novo tipo de retorno
interface PDFExportResult {
  success: boolean;
  error?: string;
}

export const generateBusinessPlanPDF = async (
  businessPlan: BusinessPlanSection,
  projectName: string
): Promise<PDFExportResult> => {
  try {
    // ... lógica existente de geração do PDF ...
    
    pdf.save(filename);
    return { success: true };
  } catch (error) {
    console.error("PDF generation error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};
```

---

## 4. Modificar PmsDashboard.tsx

### 4.1 Adicionar Estado para Popup de Erro

```typescript
const [pdfErrorDialog, setPdfErrorDialog] = useState<{
  open: boolean;
  title: string;
  message: string;
}>({
  open: false,
  title: "",
  message: "",
});
```

### 4.2 Atualizar handleExportPDF

```typescript
const handleExportPDF = async () => {
  const bp = reportData?.business_plan_section as BusinessPlanSection | null;
  
  // Cenário 1: Business Plan vazio
  if (!bp || !bp.markdown_content) {
    setPdfErrorDialog({
      open: true,
      title: "Business Plan Not Available",
      message: "The Business Plan section is empty or not yet generated. Please ensure your report has been fully processed before exporting to PDF.",
    });
    return;
  }
  
  // Cenário 2: Tentar gerar PDF (pode falhar)
  const result = await generateBusinessPlanPDF(bp, projectName);
  
  if (!result.success) {
    setPdfErrorDialog({
      open: true,
      title: "PDF Export Failed",
      message: result.error || "An unexpected error occurred while generating the PDF. Please try again or contact support if the problem persists.",
    });
  }
};
```

### 4.3 Adicionar AlertDialog no JSX

Após os outros dialogs existentes, adicionar:

```typescript
{/* PDF Export Error Dialog */}
<AlertDialog 
  open={pdfErrorDialog.open} 
  onOpenChange={(open) => setPdfErrorDialog(prev => ({ ...prev, open }))}
>
  <AlertDialogContent className="max-w-md">
    <AlertDialogHeader>
      <AlertDialogTitle className="flex items-center gap-2 text-destructive">
        <AlertCircle className="w-5 h-5" />
        {pdfErrorDialog.title}
      </AlertDialogTitle>
      <AlertDialogDescription>
        {pdfErrorDialog.message}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction 
        onClick={() => setPdfErrorDialog(prev => ({ ...prev, open: false }))}
        className="bg-accent hover:bg-accent/90"
      >
        OK
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 4.4 Imports Necessários

```typescript
import { AlertCircle } from "lucide-react"; // Adicionar ao import existente
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
```

---

## 5. Fluxo de Execução Atualizado

```text
[Usuário clica "Export to PDF"]
          │
          ▼
[Validar se Business Plan existe]
          │
          ├─ NÃO → Popup: "Business Plan Not Available"
          │         ┌────────────────────────────────┐
          │         │ ⚠️ Business Plan Not Available │
          │         │                                │
          │         │ The Business Plan section is   │
          │         │ empty or not yet generated...  │
          │         │                                │
          │         │            [ OK ]              │
          │         └────────────────────────────────┘
          │
          └─ SIM ─┬─► [Tentar gerar PDF]
                  │
                  ▼
          [generateBusinessPlanPDF()]
                  │
                  ├─ SUCCESS → Download automático
                  │
                  └─ ERROR → Popup: "PDF Export Failed"
                            ┌────────────────────────────────┐
                            │ ⚠️ PDF Export Failed           │
                            │                                │
                            │ An unexpected error occurred   │
                            │ while generating the PDF...    │
                            │                                │
                            │            [ OK ]              │
                            └────────────────────────────────┘
```

---

## 6. Estilo Visual do Popup

- **Título:** Ícone `AlertCircle` vermelho + texto em `text-destructive`
- **Corpo:** Descrição clara do problema
- **Botão:** "OK" com estilo accent para fechar
- **Tamanho:** `max-w-md` para não ser muito grande

---

## Resumo da Implementação

| Step | Arquivo | Ação |
|------|---------|------|
| 1 | `businessPlanPdfExport.ts` | Adicionar try/catch e retornar `{ success, error }` |
| 2 | `PmsDashboard.tsx` | Adicionar estado `pdfErrorDialog` |
| 3 | `PmsDashboard.tsx` | Atualizar `handleExportPDF` com validação e tratamento de erro |
| 4 | `PmsDashboard.tsx` | Adicionar imports do AlertDialog e AlertCircle |
| 5 | `PmsDashboard.tsx` | Adicionar componente AlertDialog no JSX |
| 6 | Testar | Verificar popup com Business Plan vazio e com erro simulado |
