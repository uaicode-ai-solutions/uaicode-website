

# Plano: Corrigir DataQualityBanner + Identificar TODOS os Campos Faltantes

## Resumo das Alterações

1. **Botão Regenerate do Banner** - Já usa a mesma função `handleRegenerateReport`, mas precisa remover a prop `isRegenerating` e a lógica de `disabled`
2. **Identificação de Campos Faltantes** - Expandir `checkDataQuality` para verificar TODAS as colunas JSONB do relatório

---

## 1. Arquivo: `src/components/planningmysaas/dashboard/ui/DataQualityBanner.tsx`

### Alterações:
- Remover a prop `isRegenerating` (não é mais usada)
- Remover o estado `disabled` do botão
- Remover a animação `animate-spin` do ícone
- O botão simplesmente chama `onRegenerate` que navega para `/loading`

### Antes (linhas 16-28 e 90-99):
```tsx
interface DataQualityBannerProps {
  issues: DataQualityIssue[];
  onRegenerate: () => void;
  onDismiss: () => void;
  isRegenerating?: boolean;  // REMOVER
}

// Botão
<Button
  variant="outline"
  size="sm"
  onClick={onRegenerate}
  disabled={isRegenerating}  // REMOVER
  className="..."
>
  <RefreshCw className={`h-3 w-3 ${isRegenerating ? 'animate-spin' : ''}`} />  // SIMPLIFICAR
  {isRegenerating ? 'Regenerating...' : 'Regenerate Report'}  // SIMPLIFICAR
</Button>
```

### Depois:
```tsx
interface DataQualityBannerProps {
  issues: DataQualityIssue[];
  onRegenerate: () => void;
  onDismiss: () => void;
}

// Botão
<Button
  variant="outline"
  size="sm"
  onClick={onRegenerate}
  className="..."
>
  <RefreshCw className="h-3 w-3" />
  Regenerate Report
</Button>
```

---

## 2. Arquivo: `src/lib/dataQualityUtils.ts`

### Objetivo:
Verificar TODAS as 10 colunas JSONB da tabela `tb_pms_reports` e identificar quais estão vazias/null.

### Colunas a Verificar:

| Coluna | Campos Críticos a Validar |
|--------|---------------------------|
| `hero_score_section` | `score`, `tagline` |
| `summary_section` | `verdict`, `verdict_summary` |
| `section_investment` | `investment_one_payment_cents` |
| `opportunity_section` | `tam_value`, `sam_value`, `som_value` |
| `competitive_analysis_section` | `competitors` (array) |
| `icp_intelligence_section` | `primary_personas` (array) |
| `price_intelligence_section` | `pricing_strategy` |
| `paid_media_intelligence_section` | `channels` |
| `growth_intelligence_section` | `growth_targets` |
| `benchmark_section` | `market_benchmarks` |

### Nova Estrutura da Função:

```typescript
export function checkDataQuality(reportData: ReportData | null | undefined): DataQualityIssue[] {
  if (!reportData) return [];
  
  const issues: DataQualityIssue[] = [];
  
  // ========================================
  // 1. HERO SCORE SECTION
  // ========================================
  const heroScore = reportData.hero_score_section as Record<string, unknown> | null;
  if (!heroScore || Object.keys(heroScore).length === 0) {
    issues.push({
      id: 'hero_score_section_empty',
      type: 'missing',
      severity: 'warning',
      field: 'hero_score_section',
      jsonPath: 'hero_score_section',
      dbColumn: 'hero_score_section',
      currentValue: heroScore,
      message: 'Hero Score section is empty'
    });
  } else {
    // Check specific fields
    if (typeof heroScore.score !== 'number' || heroScore.score === 0) {
      issues.push({...});
    }
  }
  
  // ========================================
  // 2. SUMMARY SECTION
  // ========================================
  const summary = reportData.summary_section as Record<string, unknown> | null;
  if (!summary || Object.keys(summary).length === 0) {
    issues.push({
      id: 'summary_section_empty',
      type: 'missing',
      severity: 'warning',
      field: 'summary_section',
      jsonPath: 'summary_section',
      dbColumn: 'summary_section',
      currentValue: summary,
      message: 'Summary section is empty'
    });
  }
  
  // ... repetir para todas as 10 colunas ...
  
  return issues;
}
```

### Helper Function para Verificar JSONB Vazio:

```typescript
function isEmptyJsonb(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.length === 0;
  return Object.keys(value as object).length === 0;
}
```

---

## 3. Lista Completa de Verificações (10 colunas)

| # | Coluna JSONB | ID do Issue | Mensagem |
|---|--------------|-------------|----------|
| 1 | `hero_score_section` | `hero_score_section_empty` | "Viability score section is missing" |
| 2 | `summary_section` | `summary_section_empty` | "Executive summary is missing" |
| 3 | `section_investment` | `section_investment_empty` | "Investment breakdown is missing" |
| 4 | `opportunity_section` | `opportunity_section_empty` | "Market opportunity data is missing" |
| 5 | `competitive_analysis_section` | `competitive_analysis_empty` | "Competitive analysis is missing" |
| 6 | `icp_intelligence_section` | `icp_intelligence_empty` | "Customer persona data is missing" |
| 7 | `price_intelligence_section` | `price_intelligence_empty` | "Pricing intelligence is missing" |
| 8 | `paid_media_intelligence_section` | `paid_media_empty` | "Paid media analysis is missing" |
| 9 | `growth_intelligence_section` | `growth_intelligence_empty` | "Growth projections are missing" |
| 10 | `benchmark_section` | `benchmark_section_empty` | "Market benchmarks are missing" |

---

## 4. Atualizar Critical Issues

```typescript
export function hasCriticalIssues(issues: DataQualityIssue[]): boolean {
  const criticalIds = [
    // Sections vazias (crítico)
    'hero_score_section_empty',
    'summary_section_empty',
    'section_investment_empty',
    'opportunity_section_empty',
    // Campos específicos faltantes
    'hero_score_missing',
    'summary_verdict_missing',
    'investment_missing'
  ];
  return issues.some(issue => criticalIds.includes(issue.id));
}
```

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/planningmysaas/dashboard/ui/DataQualityBanner.tsx` | Remover `isRegenerating` prop e simplificar botão |
| `src/lib/dataQualityUtils.ts` | Adicionar verificação para todas as 10 colunas JSONB |

---

## Resultado Esperado

1. **Botão Regenerate** funciona igual ao botão principal (navega para `/loading`)
2. **Banner** mostra TODAS as seções/campos que estão faltando no relatório
3. **Nenhuma funcionalidade existente é quebrada**

