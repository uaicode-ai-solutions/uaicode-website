

# Filtrar Reports: Mostrar Apenas Status "Completed"

## Problema Identificado

A tela `/planningmysaas/reports` exibe todos os wizards que têm relatórios associados, independente do status. Isso inclui relatórios em andamento ("Step X...") e com erro ("...Fail").

## Solução

Filtrar a lista de reports para incluir **apenas** aqueles com `status === "completed"`, tanto na exibição quanto no cálculo das estatísticas.

## Alterações Necessárias

### Arquivo: `src/hooks/useReports.ts`

**Mudança:** Adicionar filtro no merge final para retornar apenas wizards cujo report tenha status "completed".

```typescript
// Linha ~56-62 - Alterar o merge para filtrar por status completed

// ANTES:
const mergedData: ReportRow[] = wizardData.map(wizard => ({
  ...wizard,
  tb_pms_reports: reportsMap.has(wizard.id) ? [reportsMap.get(wizard.id)!] : undefined,
}));

return mergedData;

// DEPOIS:
const mergedData: ReportRow[] = wizardData
  .filter(wizard => {
    const report = reportsMap.get(wizard.id);
    // Só incluir se o report existe e tem status "completed"
    return report && report.status?.trim().toLowerCase() === "completed";
  })
  .map(wizard => ({
    ...wizard,
    tb_pms_reports: [reportsMap.get(wizard.id)!],
  }));

return mergedData;
```

## Resultado Esperado

| Antes | Depois |
|-------|--------|
| Cards de reports "generating" | ❌ Não aparece |
| Cards de reports "failed" | ❌ Não aparece |
| Cards de reports "completed" | ✅ Aparece normalmente |
| Stats contabilizam todos | Stats contabilizam só completed |

## Impacto

- **Cards exibidos:** Apenas reports completos
- **Total Reports (stats):** Conta apenas completed
- **Avg. Viability (stats):** Média apenas de completed
- **Last Created (stats):** Data do último completed
- **EmptyReports:** Aparece se nenhum report completed existir

Nenhuma outra alteração é necessária pois a filtragem acontece na fonte de dados.

