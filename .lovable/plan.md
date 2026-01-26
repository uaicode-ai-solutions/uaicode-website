
# Plano: Garantir Loading Completo Antes de Exibir Dashboard

## Problema Identificado

A condição de loading no `PmsDashboard.tsx` está incorreta. Quando a query do `useReportData` completa mas não encontra registros, ela retorna `null` em vez de `undefined`.

**Código problemático (linha 219):**
```typescript
if (isLoading || reportData === undefined) {
```

**Fluxo do bug:**
1. Dashboard monta
2. `useReport` inicia fetch do wizard
3. `useReportData` inicia fetch do report
4. `isLoading = true` → skeleton exibido ✓
5. Ambas queries completam
6. `isLoading = false`
7. `reportData = null` (não encontrou registro OU campos vazios)
8. Condição `reportData === undefined` = **FALSE**
9. Dashboard renderiza com dados incompletos ✗

## Causa Raiz

O `useReportData` usa `.maybeSingle()` que retorna:
- `undefined` durante carregamento (via react-query)
- `null` quando não encontra registro
- `ReportData` quando encontra

O problema duplo:
1. A comparação `=== undefined` não captura `null`
2. Mesmo com `reportData` existindo, os campos JSONB internos podem ainda estar vazios durante a geração

## Solução

Alterar a condição de loading para verificar se:
1. Query ainda está carregando (`isLoading`)
2. Dados do report não existem (`!reportData`)
3. O status indica que ainda está em processamento (não é "Created")

## Alteração

### Arquivo: `src/pages/PmsDashboard.tsx`

**Linha 217-256 - Antes:**
```typescript
// Show loading skeleton while fetching - wait for BOTH wizard AND reportData
// This prevents race condition where Data Quality errors appear before data loads
if (isLoading || reportData === undefined) {
```

**Depois:**
```typescript
// Show loading skeleton while fetching - wait for BOTH wizard AND reportData
// This prevents race condition where Data Quality errors appear before data loads
// Check: isLoading OR no reportData OR report still being generated
const isReportReady = reportData?.status === "Created" || reportData?.status === "completed";
if (isLoading || !reportData || !isReportReady) {
```

## Detalhes Técnicos

### Estados Possíveis de `reportData`

| Estado | `isLoading` | `reportData` | `status` | Ação |
|--------|-------------|--------------|----------|------|
| Carregando | `true` | `undefined` | - | Skeleton |
| Não encontrado | `false` | `null` | - | Skeleton (aguardar) |
| Em geração | `false` | `object` | "Step 1..." | Skeleton |
| Completo | `false` | `object` | "Created" | Dashboard |
| Falhou | `false` | `object` | "...Fail..." | Dashboard + erro |

### Fluxo Corrigido

```text
1. Dashboard monta
2. isLoading = true → Skeleton ✓
3. Queries completam
4. isLoading = false
5. reportData = null → !reportData = true → Skeleton ✓
6. (polling continua)
7. reportData = { status: "Step 1..." } → !isReportReady = true → Skeleton ✓
8. reportData = { status: "Created" } → isReportReady = true → Dashboard ✓
```

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/PmsDashboard.tsx` | Linhas 217-219: Adicionar verificação de status terminal |

## Resultado Esperado

- Skeleton permanece visível até o status ser "Created" ou "completed"
- Não há flash de dashboard vazio ou com dados incompletos
- Polling continua automaticamente via `useReportData`
