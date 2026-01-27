

# Plano: Corrigir Chamadas Duplicadas e Desabilitar Trigger Legado

## Diagnóstico

### Por que ocorreram 4 execuções?
1. **Frontend** chama `pms-orchestrate-report` (correto)
2. **Trigger do banco** (`on_pms_wizard_created`) chama `pms-webhook-new-report` (legado)
3. Ambos enviando para o mesmo webhook n8n = 2 chamadas
4. Possível retry ou double-render do React causando mais 2

### Por que todas falharam?
O workflow n8n "PMS Server Tools" tem configuração incorreta:
- Webhook node configurado para "Using Respond to Webhook Node"
- Mas existe um "Respond to Webhook" node que não está sendo atingido em algum branch

---

## Correções Necessárias

### Parte 1: Desabilitar Trigger do Banco (Migration SQL)

Criar uma migration para remover o trigger legado que está causando chamadas duplicadas:

```sql
-- Remover trigger que chama pms-webhook-new-report automaticamente
DROP TRIGGER IF EXISTS on_pms_wizard_created ON public.tb_pms_wizard;

-- Opcional: Remover a função do webhook também
DROP FUNCTION IF EXISTS public.notify_pms_wizard_created_webhook();
```

### Parte 2: Correção Manual no n8n (Usuário)

O workflow "PMS Server Tools" precisa de uma correção:

**Opção A (Recomendada - Mais Simples):**
1. Abrir o node **Webhook** (trigger principal)
2. Alterar **Respond** de "Using 'Respond to Webhook' node" para **"When Last Node Finishes"**
3. **Deletar** todos os nodes "Respond to Webhook" do workflow
4. Salvar e ativar

**Opção B (Se precisar controlar a resposta):**
1. Manter "Using 'Respond to Webhook' node"
2. Garantir que **TODOS os branches** do Switch node terminem em um "Respond to Webhook" node
3. Verificar se o Error Trigger também não está ligado a um Respond to Webhook (ele não deveria estar)

### Parte 3: Adicionar `await` na Chamada do Wizard (Código Frontend)

Atualmente a chamada `supabase.functions.invoke()` não tem `await`, o que pode causar comportamento inesperado. Vamos garantir que a navegação só ocorra após a chamada ser enviada.

**Arquivo:** `src/pages/PmsWizard.tsx`

```typescript
// Linha 315-318 atual:
supabase.functions.invoke('pms-orchestrate-report', {
  body: { wizard_id: reportId }
});

// Alterar para (fire-and-forget mas com log):
supabase.functions.invoke('pms-orchestrate-report', {
  body: { wizard_id: reportId }
}).then(result => {
  console.log('[Wizard] Orchestrator invoked:', result);
}).catch(err => {
  console.error('[Wizard] Orchestrator error:', err);
});
```

---

## Sequência de Implementação

| Ordem | Ação | Responsável |
|-------|------|-------------|
| 1 | Corrigir Webhook node no n8n (Opção A) | Usuário |
| 2 | Executar migration para remover trigger | Lovable |
| 3 | Testar fluxo completo | Usuário |

---

## Resultado Esperado

Após implementação:

1. **INSERT em tb_pms_wizard** → Apenas dados salvos (sem trigger)
2. **Frontend** → Chama `pms-orchestrate-report` (única chamada)
3. **n8n** → Recebe chamada e processa sem erro de "Unused Respond to Webhook"
4. **Status** → Atualizado step-by-step conforme orquestrador

---

## Seção Técnica

### Estado Atual do Trigger

```sql
-- Trigger ativo na tabela tb_pms_wizard:
CREATE TRIGGER on_pms_wizard_created
  AFTER INSERT ON public.tb_pms_wizard
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_pms_wizard_created_webhook();

-- Função que o trigger chama:
notify_pms_wizard_created_webhook() 
  → net.http_post() 
  → pms-webhook-new-report Edge Function
  → n8n webhook
```

### Estado Desejado

```sql
-- Sem trigger (removido pela migration)
-- Frontend é o único ponto de entrada para chamar o orquestrador
```

### Fluxo Unificado Final

```text
Wizard Submit
    │
    ├──► INSERT tb_pms_wizard (dados apenas)
    │
    └──► supabase.functions.invoke('pms-orchestrate-report')
              │
              └──► n8n webhook (uma única chamada)
                      │
                      └──► Steps 0-10 processados em sequência
```

