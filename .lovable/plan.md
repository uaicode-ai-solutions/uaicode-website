

# Adicionar botao de Reprocessar Report com status Failed

## Resumo
Adicionar um icone RefreshCw na coluna Actions da tabela de reports. O icone fica ativo apenas para reports com status "failed". Ao clicar, dispara o reprocessamento via edge function `pms-orchestrate-lp-report` passando o `wizard_id` existente do report (da tabela `tb_pms_reports.wizard_id`), sem criar nenhum registro novo.

## Alteracao

**Arquivo unico:** `src/components/hero/mock/PlanningMySaasOverview.tsx`

### 1. Novo estado e import
- Importar `RefreshCw` do lucide-react
- Adicionar estado `reprocessingIds` como `Set<string>` para rastrear reports em reprocessamento

### 2. Funcao `handleReprocess(card)`
- Recebe o card que ja contem `reportId` e `wizardId` (vindo de `tb_pms_reports.wizard_id`, que referencia o registro existente em `tb_pms_lp_wizard`)
- Adiciona `reportId` ao `reprocessingIds`
- Atualiza o status local para "processing" imediatamente na UI
- Reseta o status no banco: `UPDATE tb_pms_reports SET status = 'processing' WHERE id = reportId`
- Chama `supabase.functions.invoke("pms-orchestrate-lp-report", { body: { wizard_id: card.wizardId } })`
  - O `card.wizardId` ja e o UUID existente na `tb_pms_lp_wizard` -- nao cria registro novo
- Inicia polling a cada 5 segundos: `SELECT status, hero_score_section, summary_section FROM tb_pms_reports WHERE id = reportId`
- Quando status muda para "completed" ou contem "fail":
  - Para o polling
  - Remove do `reprocessingIds`
  - Atualiza o array `reports` local com os novos dados (status, score, summary)
- Timeout de seguranca: para o polling apos 5 minutos

### 3. Coluna Actions - nova renderizacao
- Para status "completed": mostra icone Eye (existente) + RefreshCw desabilitado (opacidade 30%)
- Para status "failed": mostra RefreshCw ativo (cor amber ao hover, clicavel)
- Para status "processing" (em reprocessamento): mostra RefreshCw com `animate-spin` em cor amber
- Para outros status (pending): mostra RefreshCw desabilitado

### 4. Cleanup
- useEffect com cleanup para limpar todos os intervals ativos ao desmontar o componente

## Detalhe importante sobre wizard_id
O `wizard_id` utilizado e sempre o valor ja existente em `tb_pms_reports.wizard_id`, que corresponde ao registro original em `tb_pms_lp_wizard`. A edge function `pms-orchestrate-lp-report` recebe esse mesmo UUID e o n8n reutiliza o registro existente -- nenhum registro duplicado e criado.

## Fluxo visual

```text
[Failed] -> Click RefreshCw -> Status muda para "Processing" + icone gira
   -> n8n processa -> Polling detecta "completed"
   -> Status atualiza + score aparece + Eye fica visivel + RefreshCw desabilitado
```

