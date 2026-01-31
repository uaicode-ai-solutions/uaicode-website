
# Plano: Adicionar "Export to PDF" no Menu Share

## Objetivo

Adicionar uma opção "Export to PDF" no dropdown de Share do header que exporta o Business Plan completo para PDF usando a biblioteca jsPDF (já instalada).

---

## 1. Arquivos a Criar/Modificar

| Ação | Arquivo | Descrição |
|------|---------|-----------|
| **Criar** | `src/lib/businessPlanPdfExport.ts` | Função para gerar PDF do Business Plan |
| **Modificar** | `src/pages/PmsDashboard.tsx` | Adicionar opção "Export to PDF" no dropdown |

---

## 2. Novo Arquivo: businessPlanPdfExport.ts

### 2.1 Estrutura da Função

```typescript
export const generateBusinessPlanPDF = async (
  businessPlan: BusinessPlanSection,
  projectName: string
): Promise<void>
```

### 2.2 Layout do PDF (Múltiplas Páginas)

```text
┌─────────────────────────────────────────────────────────────┐
│ PAGE 1: COVER                                               │
├─────────────────────────────────────────────────────────────┤
│  [UAICode Logo]                                             │
│                                                             │
│  BUSINESS PLAN                                              │
│  {title}                                                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Viability Score: 70/100 — Promising                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  {subtitle}                                                 │
│                                                             │
│  Generated: January 31, 2026                                │
│  Word Count: 2,850 words                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PAGES 2+: CONTENT                                           │
├─────────────────────────────────────────────────────────────┤
│  ## Section Heading                                         │
│                                                             │
│  Lorem ipsum dolor sit amet, consectetur adipiscing elit.   │
│  Sed do eiusmod tempor incididunt ut labore et dolore...    │
│                                                             │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  [CHART PLACEHOLDER - Note: Charts rendered as text tables] │
│                                                             │
│  | Market | Value |                                         │
│  |--------|-------|                                         │
│  | TAM    | $102B |                                         │
│  | SAM    | $8.4B |                                         │
│  | SOM    | $3.7M |                                         │
│                                                             │
│                                       Page 2 | uaicode.ai   │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Funcionalidades Principais

| Feature | Descrição |
|---------|-----------|
| **Markdown Parsing** | Converter markdown em texto formatado para PDF |
| **Chart Tables** | Substituir `[CHART:xxx]` por tabelas de dados equivalentes |
| **Multi-Page** | Paginação automática com quebra de página inteligente |
| **Viability Badge** | Destaque colorido baseado no score (verde/amarelo/vermelho) |
| **Brand Footer** | Logo + contato da UAICode em cada página |
| **Filename** | `BusinessPlan_{projectName}_{timestamp}.pdf` |

### 2.4 Tratamento de Charts

Os charts interativos do Recharts não podem ser exportados diretamente para PDF. A estratégia será converter os dados em tabelas formatadas:

| Chart Type | PDF Representation |
|------------|-------------------|
| `market_sizing` | Tabela 3 linhas: TAM, SAM, SOM |
| `financial_projections` | Tabela com MRR/ARR projections |
| `competitor_pricing` | Tabela com min/max por competidor |
| `investment_breakdown` | Tabela com categorias e valores |

---

## 3. Modificar PmsDashboard.tsx

### 3.1 Adicionar Import

```typescript
import { FileDown } from "lucide-react"; // Ícone para Export
import { generateBusinessPlanPDF } from "@/lib/businessPlanPdfExport";
import { BusinessPlanSection } from "@/types/report";
```

### 3.2 Adicionar Handler

```typescript
const handleExportPDF = async () => {
  const bp = reportData?.business_plan_section as BusinessPlanSection | null;
  
  if (!bp || !bp.markdown_content) {
    console.error("Business Plan not available for export");
    return;
  }
  
  await generateBusinessPlanPDF(bp, projectName);
};
```

### 3.3 Adicionar Item no Dropdown

Após "Share via Email", adicionar:

```typescript
<DropdownMenuSeparator className="bg-border/30" />
<DropdownMenuItem 
  onClick={handleExportPDF} 
  className="cursor-pointer"
>
  <FileDown className="h-4 w-4 mr-2" />
  Export to PDF
</DropdownMenuItem>
```

---

## 4. Estrutura Visual do Dropdown Atualizado

```text
┌─────────────────────┐
│ 🔗 Copy Link        │
│ ✉️  Share via Email │
├─────────────────────┤
│ 📄 Export to PDF    │  ← NOVO
└─────────────────────┘
```

---

## 5. Markdown Parser para PDF

### 5.1 Regras de Conversão

| Markdown | PDF Output |
|----------|------------|
| `# Heading 1` | Bold, 24pt, underlined |
| `## Heading 2` | Bold, 18pt, gold color |
| `### Heading 3` | Bold, 14pt |
| `**bold**` | Bold text |
| `*italic*` | Italic text |
| `- item` | • Bullet point |
| `1. item` | 1. Numbered list |
| `> quote` | Indented, gray bar left |
| `---` | Horizontal line |
| Tables | Formatted with borders |
| `[CHART:xxx]` | Data table replacement |

### 5.2 Page Break Logic

```typescript
// Check if adding content would overflow page
if (yPosition + contentHeight > pageHeight - margin - footerHeight) {
  addPageFooter(pageNumber);
  pdf.addPage();
  pageNumber++;
  yPosition = margin;
}
```

---

## 6. PDF Metadata

```typescript
pdf.setProperties({
  title: `Business Plan: ${projectName}`,
  subject: 'SaaS Business Plan Document',
  author: 'UAICode - PlanningMySaaS',
  keywords: 'Business Plan, SaaS, Startup, Market Analysis',
  creator: 'PlanningMySaaS by UAICode',
});
```

---

## 7. Cores e Estilo (Brand UaiCode)

| Elemento | Cor |
|----------|-----|
| Título principal | Gold (#FFB800) |
| Headings H2 | Dark Gray (#232729) |
| Texto normal | Text Light (#3C3C3C) |
| Viability Verde | Green (#22C55E) |
| Viability Amarelo | Yellow (#EAB308) |
| Viability Vermelho | Red (#EF4444) |
| Footer | Muted (#646464) |

---

## 8. Fluxo de Execução

```text
[Usuário clica "Export to PDF"]
          │
          ▼
[Validar se Business Plan existe]
          │
          ├─ NÃO → Toast: "Business Plan not available"
          │
          └─ SIM ─┬─► [Criar jsPDF instance]
                  │
                  ▼
          [Gerar Cover Page]
                  │
                  ▼
          [Parse Markdown]
                  │
                  ▼
          [Substituir [CHART:] por tabelas]
                  │
                  ▼
          [Renderizar texto com paginação]
                  │
                  ▼
          [Adicionar footers]
                  │
                  ▼
          [pdf.save(filename)]
                  │
                  ▼
          [Download automático]
```

---

## 9. Tratamento de Erros

| Cenário | Ação |
|---------|------|
| Business Plan vazio | Mostrar toast de erro |
| Markdown malformado | Fallback para texto plano |
| Charts sem dados | Omitir tabela correspondente |
| Erro no jsPDF | Log + toast de erro |

---

## Resumo da Implementação

| Step | Arquivo | Ação |
|------|---------|------|
| 1 | `src/lib/businessPlanPdfExport.ts` | Criar função de export |
| 2 | `src/pages/PmsDashboard.tsx` | Adicionar import + handler |
| 3 | `src/pages/PmsDashboard.tsx` | Adicionar item no dropdown |
| 4 | Testar | Verificar download do PDF |

Ao aprovar, implementarei todos os arquivos necessários.
