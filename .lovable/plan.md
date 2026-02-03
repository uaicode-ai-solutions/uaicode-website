# Plano: Reutilizar BusinessPlanTab na Página Pública

## ✅ IMPLEMENTADO

### Resumo
A página pública `/planningmysaas/shared/:token` agora renderiza o **mesmo** `BusinessPlanTab` do dashboard autenticado, garantindo 100% de paridade visual com gráficos interativos Recharts.

### Arquitetura Final

```text
DASHBOARD (autenticado)              PÁGINA PÚBLICA
────────────────────────             ──────────────────────────
                                     
    ReportProvider                      SharedReportProvider
    ├─ useReport(wizardId)              └─ useSharedReport(token)
    └─ useReportData(wizardId)              │
         │                                  ▼
         ▼                              SELECT * FROM tb_pms_reports
    tb_pms_wizard +                     WHERE share_token = :token
    tb_pms_reports                      AND share_enabled = true
         │                                  │
         ▼                                  ▼
    ReportContext.Provider              SharedReportContext.Provider
         │                                  │
         ▼                                  ▼
    BusinessPlanTab ◄───────────────► BusinessPlanTab (MESMO!)
```

### Mudanças Realizadas

| Arquivo | Ação |
|---------|------|
| Migração SQL | ✅ Criado - colunas `wizard_snapshot` e `marketing_snapshot` |
| `src/contexts/SharedReportContext.tsx` | ✅ Criado - provider para página pública |
| `src/contexts/ReportContext.tsx` | ✅ Modificado - fallback para SharedReportContext |
| `src/hooks/useSharedReport.ts` | ✅ Modificado - retorna dados completos JSONB |
| `src/pages/PmsSharedReport.tsx` | ✅ Modificado - usa Provider + BusinessPlanTab |
| `pms-orchestrate-report` | ✅ Modificado - salva snapshots, removido HTML estático |

### Próximos Passos para Testar

1. Regenerar um relatório (ou criar novo) para popular `wizard_snapshot` e `marketing_snapshot`
2. Acessar a URL de compartilhamento: `/planningmysaas/shared/:token`
3. Verificar que o Business Plan renderiza com gráficos interativos
