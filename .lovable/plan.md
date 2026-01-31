
# Plano: Corrigir Problemas no PDF Export

## Problemas Identificados

| Problema | Causa | Solução |
|----------|-------|---------|
| **Tabelas duplicadas** | Markdown contém tabelas + placeholders `[CHART:xxx]`, ambos são renderizados | Detectar e pular linhas de tabela markdown que precedem charts |
| **Caracteres corrompidos** | jsPDF não suporta Unicode/emojis (ex: 📊, ✓, →) | Sanitizar texto removendo/substituindo caracteres não-ASCII |
| **Footer inconsistente** | Footer é adicionado apenas no `checkPageBreak`, não na última página | Garantir footer em todas as páginas incluindo a final |

---

## 1. Sanitização de Caracteres Unicode/Emojis

### 1.1 Nova Função Helper

```typescript
const sanitizeTextForPDF = (text: string): string => {
  return text
    // Remove emojis e símbolos Unicode
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "") // Emojis
    .replace(/[\u{2600}-\u{26FF}]/gu, "")   // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, "")   // Dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")   // Variation selectors
    // Substituir caracteres especiais por equivalentes ASCII
    .replace(/[""]/g, '"')           // Smart quotes
    .replace(/['']/g, "'")           // Smart apostrophes
    .replace(/[–—]/g, "-")           // Dashes
    .replace(/…/g, "...")            // Ellipsis
    .replace(/[•·]/g, "-")           // Bullets (serão re-adicionados como •)
    .replace(/[→←↑↓]/g, "->")        // Arrows
    .replace(/[✓✔]/g, "[x]")         // Checkmarks
    .replace(/[✗✘]/g, "[_]")         // X marks
    .replace(/[★☆]/g, "*")           // Stars
    .replace(/©/g, "(c)")            // Copyright
    .replace(/®/g, "(R)")            // Registered
    .replace(/™/g, "(TM)")           // Trademark
    .replace(/°/g, " deg")           // Degree
    .replace(/[^\x00-\x7F]/g, "");   // Remove any remaining non-ASCII
};
```

### 1.2 Aplicar Sanitização

Aplicar `sanitizeTextForPDF()` em:
- `stripMarkdownFormatting()` - após processar formatação
- Título do projeto na cover
- Subtitle na cover
- viability_label na cover

---

## 2. Remoção de Tabelas Markdown Duplicadas

### 2.1 Estratégia

O markdown contém estruturas como:

```markdown
| Market | Value |
|--------|-------|
| TAM    | $102B |

[CHART:market_sizing]
```

Precisamos detectar e pular essas linhas de tabela que precedem um `[CHART:xxx]`.

### 2.2 Pré-processamento do Markdown

```typescript
const preprocessMarkdown = (markdown: string): string => {
  const lines = markdown.split("\n");
  const result: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this is a table line (starts with |)
    if (trimmed.startsWith("|")) {
      // Look ahead to find if there's a CHART placeholder after this table
      let j = i + 1;
      let isTableBeforeChart = false;
      
      // Skip remaining table lines
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        j++;
      }
      // Skip empty lines between table and chart
      while (j < lines.length && lines[j].trim() === "") {
        j++;
      }
      // Check if next non-empty line is a chart placeholder
      if (j < lines.length && lines[j].trim().match(/\[CHART:\w+\]/)) {
        isTableBeforeChart = true;
      }
      
      if (isTableBeforeChart) {
        // Skip all table lines until we reach non-table content
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          i++;
        }
        i--; // Adjust for loop increment
        continue;
      }
    }
    
    result.push(line);
  }
  
  return result.join("\n");
};
```

### 2.3 Uso no generateBusinessPlanPDF

```typescript
// Antes de processar as linhas
const cleanedMarkdown = preprocessMarkdown(businessPlan.markdown_content || "");
const lines = cleanedMarkdown.split("\n");
```

---

## 3. Footer Consistente em Todas as Páginas

### 3.1 Problema Atual

O footer só é adicionado quando há quebra de página via `checkPageBreak()`. A última página não recebe footer.

### 3.2 Solução

Adicionar footer na última página antes do `pdf.save()`:

```typescript
// Final page footer
addPageFooter(pdf, pageNumber.value);

// Save PDF
const timestamp = new Date().toISOString().split("T")[0];
const filename = `BusinessPlan_${sanitizeFilename(projectName)}_${timestamp}.pdf`;
pdf.save(filename);
```

### 3.3 Padronizar Footer

O footer já está correto, mas vamos garantir uma linha separadora sutil:

```typescript
const addPageFooter = (pdf: jsPDF, pageNumber: number): void => {
  const y = PAGE_HEIGHT - 10;
  
  // Subtle separator line
  pdf.setDrawColor(...COLORS.lightGray);
  pdf.setLineWidth(0.2);
  pdf.line(MARGIN, y - 5, PAGE_WIDTH - MARGIN, y - 5);
  
  // Footer text
  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.muted);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Page ${pageNumber}`, MARGIN, y);
  pdf.text("uaicode.ai | PlanningMySaaS", PAGE_WIDTH - MARGIN, y, { align: "right" });
};
```

---

## 4. Resumo das Alterações em businessPlanPdfExport.ts

| Seção | Alteração |
|-------|-----------|
| **Helpers (linha ~30)** | Adicionar `sanitizeTextForPDF()` |
| **Helpers (linha ~55)** | Adicionar `preprocessMarkdown()` |
| **stripMarkdownFormatting** | Integrar `sanitizeTextForPDF()` |
| **addPageFooter** | Adicionar linha separadora sutil |
| **Cover page texts** | Aplicar sanitização em title, subtitle, viability_label |
| **Content processing** | Usar `preprocessMarkdown()` antes do split |
| **Final page** | Garantir `addPageFooter()` antes do save |

---

## 5. Fluxo Corrigido

```text
[markdown_content]
       │
       ▼
[preprocessMarkdown()] ─► Remove tabelas antes de [CHART:xxx]
       │
       ▼
[split("\n")]
       │
       ▼
[parseMarkdownLine()] 
       │
       ▼
[stripMarkdownFormatting() + sanitizeTextForPDF()] ─► Remove Unicode/emojis
       │
       ▼
[renderizar no PDF]
       │
       ▼
[addPageFooter()] em TODAS as páginas
       │
       ▼
[pdf.save()]
```

---

## 6. Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/lib/businessPlanPdfExport.ts` | Implementar todas as correções acima |

Ao aprovar, implementarei as correções no arquivo.
