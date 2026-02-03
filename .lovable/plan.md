
# Plano: Corrigir Validação no Dashboard e Verificar Link Compartilhável

## Diagnóstico

### Problema 1: PDF Bloqueado no Dashboard
**Arquivo:** `src/pages/PmsDashboard.tsx` (linha 248)

O código atual ainda verifica `markdown_content`:
```typescript
if (!bp || !bp.markdown_content) {  // ❌ BLOQUEIA RELATÓRIOS ESTRUTURADOS
  setPdfErrorDialog({ ... });
  return;
}
```

Isso impede que a função `generateBusinessPlanPDF` (que já foi corrigida) seja chamada.

### Problema 2: Link Compartilhável no Preview
O hook `useSharedReport.ts` já foi corrigido para validar campos estruturados, mas:
- O Preview pode estar com código antigo em cache
- Precisamos verificar se o deploy está atualizado

---

## Solução

### Correção 1: Dashboard - Validação do PDF
**Arquivo:** `src/pages/PmsDashboard.tsx`

Trocar a validação de `markdown_content` para campos estruturados:

```typescript
// ❌ ANTES (linha 248):
if (!bp || !bp.markdown_content) {

// ✅ DEPOIS:
const hasStructuredContent = 
  bp?.ai_executive_narrative || 
  bp?.ai_strategic_verdict || 
  (bp?.ai_key_recommendations && bp.ai_key_recommendations.length > 0);

if (!bp || !hasStructuredContent) {
```

### Correção 2: Remover Legado do BusinessPlanTab
**Arquivo:** `src/components/planningmysaas/dashboard/sections/BusinessPlanTab.tsx`

Remover bloco de fallback para markdown legado (linhas 132-145):
```typescript
// ❌ REMOVER: Legacy markdown support que não será mais usado
{businessPlan?.markdown_content && !businessPlan?.ai_executive_narrative && ( ... )}
```

### Correção 3: Remover Legado do SharedReportContent
**Arquivo:** `src/components/planningmysaas/public/SharedReportContent.tsx`

Remover bloco de fallback para markdown legado (linhas 266-274):
```typescript
// ❌ REMOVER: Legacy Markdown Support que não será mais usado
{!hasStructuredContent && businessPlan.markdown_content && ( ... )}
```

---

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/pages/PmsDashboard.tsx` | Validação estruturada no `handleExportPDF` |
| `src/components/planningmysaas/dashboard/sections/BusinessPlanTab.tsx` | Remover fallback markdown |
| `src/components/planningmysaas/public/SharedReportContent.tsx` | Remover fallback markdown |

---

## Resultado Esperado

| Funcionalidade | Antes | Depois |
|----------------|-------|--------|
| Export PDF no Dashboard | Popup "Not Available" | Gera PDF com narrativas AI |
| Link Compartilhável | "Report Not Found" | Mostra Executive Summary, Verdict, Next Steps |

---

## Teste End-to-End

1. **Dashboard PDF:**
   - Abrir `/planningmysaas/dashboard/c7c6223a-596c-4e38-911b-d1df048e5976`
   - Clicar em Share → Export to PDF
   - Verificar download de arquivo `BusinessPlan_*.pdf`

2. **Link Compartilhável:**
   - Abrir `/planningmysaas/shared/a7ea613da8898c4f43de943742240aa9` no Preview
   - Verificar que mostra o conteúdo estruturado (não "Report Not Found")
