

# Plano: Corrigir Status com Caracteres de Nova Linha

## Diagnóstico

O campo `status` no banco de dados contém caracteres extras no final:
- Valor salvo: `"completed\r\n"` (11 caracteres)
- Valor esperado: `"completed"` (9 caracteres)

O dashboard verifica `reportData?.status !== "completed"`, que retorna `true` porque `"completed\r\n" !== "completed"`, mantendo a tela no skeleton infinitamente.

## Causa Raiz

O n8n está enviando o status com caracteres de nova linha (possivelmente do output de um node de texto ou resposta HTTP), e a Edge Function está salvando sem fazer sanitização.

## Alterações Necessárias

### 1. Corrigir Dados Existentes no Banco

Executar SQL para limpar os status corrompidos:

```sql
UPDATE tb_pms_reports 
SET status = TRIM(BOTH E'\r\n' FROM status)
WHERE status LIKE E'%\r\n' 
   OR status LIKE E'%\n' 
   OR status LIKE E'%\r';
```

### 2. Corrigir Edge Function para Sanitizar Status

**Arquivo:** `supabase/functions/pms-orchestrate-report/index.ts`

Adicionar `.trim()` ao salvar o status:

```typescript
// Antes de atualizar o status, garantir que está limpo
const cleanStatus = statusCompleted.trim();

await supabase
  .from("tb_pms_reports")
  .update({ status: cleanStatus })
  .eq("wizard_id", wizard_id);
```

Também aplicar na mensagem de erro:

```typescript
const cleanFailStatus = statusFailed.trim();

await supabase
  .from("tb_pms_reports")
  .update({ status: cleanFailStatus })
  .eq("wizard_id", wizard_id);
```

## Fluxo de Correção

```text
1. Executar UPDATE no banco para limpar status existentes
2. Atualizar Edge Function com .trim()
3. Deploy da função
4. Recarregar dashboard - dados aparecerão corretamente
```

## Resultado Esperado

- Status no banco: `"completed"` (9 caracteres, sem \r\n)
- Dashboard reconhece status e renderiza os dados normalmente

