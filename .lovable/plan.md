

# Plano: Adicionar Informações de Debug ao Data Quality Banner

## Problema Atual

O banner mostra apenas a mensagem genérica:
- "Overall viability score is missing"

Mas não exibe informações úteis para debug:
- **Campo JSON**: `hero_score_section.score`
- **Coluna da tabela**: `tb_pms_reports.hero_score_section`

## Solução

Expandir a interface `DataQualityIssue` e o componente `DataQualityBanner` para exibir:
1. O caminho do campo JSON (já existe no campo `field`)
2. A coluna do banco de dados correspondente
3. O valor atual encontrado (se houver)

## Alterações

### 1. Atualizar Interface `DataQualityIssue`

**Arquivo**: `src/lib/dataQualityUtils.ts`

Adicionar novos campos à interface:

```typescript
export interface DataQualityIssue {
  id: string;
  type: 'parsing' | 'missing' | 'incomplete';
  severity: 'warning' | 'info';
  field: string;           // Caminho no JSON (ex: "score")
  jsonPath: string;        // Caminho completo (ex: "hero_score_section.score")
  dbColumn: string;        // Coluna da tabela (ex: "hero_score_section")
  currentValue?: unknown;  // Valor atual encontrado (para debug)
  message: string;
}
```

### 2. Atualizar Função `checkDataQuality`

Modificar cada issue para incluir as novas informações:

```typescript
// hero_score_section.score
issues.push({
  id: 'hero_score_missing',
  type: 'missing',
  severity: 'warning',
  field: 'score',
  jsonPath: 'hero_score_section.score',
  dbColumn: 'hero_score_section',
  currentValue: heroScore?.score ?? null,
  message: 'Overall viability score is missing'
});
```

### 3. Atualizar `DataQualityBanner`

Modificar o componente para exibir as informações técnicas na seção expandida:

```text
Estrutura Visual:

• Overall viability score is missing
  ├─ JSON Path: hero_score_section.score
  ├─ DB Column: tb_pms_reports.hero_score_section
  └─ Current Value: null
```

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/lib/dataQualityUtils.ts` | Adicionar `jsonPath`, `dbColumn`, `currentValue` à interface e preencher em cada issue |
| `src/components/planningmysaas/dashboard/ui/DataQualityBanner.tsx` | Exibir informações técnicas na seção expandida |

## Seção Técnica

### Mapeamento de Issues para Debug

| Issue ID | JSON Path | DB Column |
|----------|-----------|-----------|
| `hero_score_missing` | `hero_score_section.score` | `hero_score_section` |
| `summary_verdict_missing` | `summary_section.verdict` | `summary_section` |
| `investment_missing` | `section_investment.investment_one_payment_cents` | `section_investment` |
| `monthly_searches_parsing` | `opportunity_section.demand_signals.monthly_searches` | `opportunity_section` |
| `social_mentions_parsing` | `opportunity_section.demand_signals.social_mentions` | `opportunity_section` |
| `macro_trends_strength` | `opportunity_section.macro_trends[].strength` | `opportunity_section` |

### Layout do Banner Expandido

A seção de detalhes usará um layout de código para facilitar copy/paste:

```text
• Overall viability score is missing
  JSON Path:    hero_score_section.score
  DB Column:    tb_pms_reports.hero_score_section  
  Current:      null
```

Cada campo terá um botão de copy para facilitar debug no Supabase.

