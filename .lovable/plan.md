
# Plano: Corrigir Race Condition no Carregamento do Dashboard

## Problema Identificado

O dashboard exibe erros de Data Quality antes dos dados estarem prontos porque a verificação de loading está incompleta.

**Fluxo atual com bug:**
1. `useReport(wizardId)` carrega os dados do wizard rapidamente
2. `isLoading` muda para `false`, skeleton desaparece
3. `useReportData(wizardId)` ainda está carregando em paralelo
4. Dashboard renderiza com `reportData = undefined`
5. `checkDataQuality()` reporta campos ausentes
6. Segundos depois, `reportData` chega e os erros somem

**Código problemático em `PmsDashboard.tsx`:**
```typescript
// Linha 162 - só busca loading do wizard
const { data: report, isLoading, error } = useReport(wizardId);

// Linha 220 - verifica APENAS isLoading do wizard
if (isLoading) {
  return <DashboardSkeleton />;
}
```

O `reportData` vem do `ReportContext` (linha 80), mas seu estado de loading não é verificado.

## Solução

Unificar a verificação de loading para incluir AMBOS os estados:
- `isLoading` do wizard (`useReport`)
- `isLoading` do reportData (`useReportData`)

## Alterações

### 1. Usar `isLoading` do ReportContext

O `ReportContext` já combina ambos os loadings (linha 84):
```typescript
isLoading: isLoadingWizard || isLoadingReport,
```

Porém, `PmsDashboardContent` busca `isLoading` diretamente de `useReport` novamente, ignorando o contexto.

### 2. Modificar `PmsDashboardContent`

**Arquivo**: `src/pages/PmsDashboard.tsx`

Alterar para usar o loading unificado do context:

```typescript
// ANTES (linhas 79-85):
const { reportData, pmsReportId } = useReportContext();
// ...
const { data: report, isLoading, error } = useReport(wizardId);

// DEPOIS:
const { report, reportData, pmsReportId, isLoading } = useReportContext();
```

Remover a chamada duplicada de `useReport(wizardId)` na linha 162.

### 3. Verificação Adicional de Segurança

Adicionar verificação extra antes de renderizar o dashboard:

```typescript
// Garantir que reportData existe antes de exibir conteúdo
if (isLoading || !reportData) {
  return <DashboardSkeleton />;
}
```

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/PmsDashboard.tsx` | Remover `useReport` duplicado; usar `isLoading` e `report` do ReportContext |

## Detalhes Técnicos

### Mudanças na Linha 79-85

```typescript
// ANTES:
const { reportData, pmsReportId } = useReportContext();
// ... 
const { data: report, isLoading, error } = useReport(wizardId);

// DEPOIS:
const { report, reportData, pmsReportId, isLoading, error } = useReportContext();
```

### Mudança na Linha 220

```typescript
// ANTES:
if (isLoading) {

// DEPOIS (incluir verificação de reportData para reports em status terminal):
const isReady = !isLoading && reportData !== undefined;
if (!isReady) {
```

### Fluxo Corrigido

```text
1. Dashboard monta
2. ReportContext inicia ambas as queries
3. isLoading = true (wizard OU reportData carregando)
4. DashboardSkeleton é exibido
5. Ambas queries completam
6. isLoading = false, reportData tem valor
7. Dashboard renderiza com dados completos
8. checkDataQuality() valida dados reais
```

## Resultado Esperado

- O skeleton permanece visível até que TODOS os dados estejam carregados
- Não haverá erros transitórios de Data Quality
- Os componentes sempre receberão dados completos (ou vazios, mas não undefined)
