
# Plano: Corrigir Link Compartilhável e PDF para Formato Estruturado

## Resumo do Problema

O sistema de Business Plan foi migrado para um formato **estruturado** (sem `markdown_content`), mas dois componentes ainda dependem do formato antigo:

| Componente | Problema |
|------------|----------|
| `useSharedReport.ts` | Retorna `null` se `markdown_content` não existir |
| `businessPlanPdfExport.ts` | Gera PDF parseando `markdown_content` |

## Solução

### 1. Corrigir `useSharedReport.ts`

Trocar a validação de `markdown_content` para aceitar o formato estruturado:

**Antes:**
```typescript
if (!bp || !bp.markdown_content) return null;
```

**Depois:**
```typescript
// Validate: must have AI narratives (structured format)
const hasContent = 
  bp?.ai_executive_narrative || 
  bp?.ai_strategic_verdict || 
  (bp?.ai_key_recommendations && bp.ai_key_recommendations.length > 0);

if (!bp || !hasContent) return null;
```

---

### 2. Reescrever `businessPlanPdfExport.ts` para Formato Estruturado

O PDF atual parseia markdown linha por linha. O novo formato não tem markdown, então precisamos gerar o PDF diretamente a partir dos campos estruturados.

**Estrutura do novo PDF:**

| Página | Conteúdo |
|--------|----------|
| **Capa** | Título, Viability Score, Data |
| **Executive Summary** | `ai_executive_narrative` + insights |
| **Strategic Verdict** | `ai_strategic_verdict` |
| **Next Steps** | Lista numerada de `ai_key_recommendations` |
| **Footer** | "uaicode.ai \| PlanningMySaaS" |

**Mudanças principais:**
- Remover toda a lógica de parsing de markdown (`parseMarkdownLine`, `preprocessMarkdown`)
- Remover lógica de chart placeholders (`[CHART:...]`)
- Criar funções específicas para cada seção estruturada
- Manter a estética visual (cores, fontes, layout A4)

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/hooks/useSharedReport.ts` | Trocar validação de `markdown_content` para campos estruturados |
| `src/lib/businessPlanPdfExport.ts` | Reescrever para gerar PDF a partir de campos AI narratives |

---

## Resultado Esperado

| Funcionalidade | Status |
|----------------|--------|
| Link compartilhável | Carrega e mostra Executive Summary, Strategic Verdict, Next Steps |
| Download PDF | Gera documento com todas as seções estruturadas |
| Viability Score | Exibido no header do link e na capa do PDF |

---

## Notas Técnicas

- O `SharedReportContent.tsx` já está preparado para o formato estruturado (linhas 64-71)
- O PDF será mais simples e focado (~3-4 páginas vs documentos longos)
- O export mantém compatibilidade com jsPDF existente
