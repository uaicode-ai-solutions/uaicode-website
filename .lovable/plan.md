

# Plano: Adicionar Timeout de 150s no Fetch (Mudança Cirúrgica)

## Resumo Executivo

**Problema**: Quando o n8n demora mais de 60s, a Edge Function faz shutdown e o status fica travado em "In Progress".

**Solução**: Adicionar timeout de 150 segundos no fetch. Se o tempo exceder, o código vai para o catch que JÁ existe e grava "Fail" no banco.

---

## Auditoria de Risco ✅

| Componente | Status | Será modificado? |
|------------|--------|------------------|
| `pms-orchestrate-report/index.ts` | Funcionando | ✅ SIM (apenas 1 bloco) |
| `PmsLoading.tsx` | Funcionando | ❌ NÃO |
| `useReportData.ts` | Funcionando | ❌ NÃO |
| `GeneratingReportSkeleton.tsx` | Funcionando | ❌ NÃO |
| `PmsDashboard.tsx` | Funcionando | ❌ NÃO |
| Share URL generation | Funcionando | ❌ NÃO |
| CORS headers | Funcionando | ❌ NÃO |

---

## Modificação Única

**Arquivo**: `supabase/functions/pms-orchestrate-report/index.ts`  
**Linhas afetadas**: 89-135 (bloco try/catch dentro do loop)

### Código Atual (linhas 89-135)

```typescript
try {
  // 2. Call n8n webhook with tool_name and wizard_id
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tool_name: tool.tool_name,
      wizard_id: wizard_id
    }),
  });

  // 3. Check HTTP response
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  // Consume response body
  await response.text();

  // 4. Update status to "Completed"
  await supabase
    .from("tb_pms_reports")
    .update({ status: statusCompleted.trim() })
    .eq("wizard_id", wizard_id);

  console.log(`✅ ${statusCompleted}`);

} catch (error) {
  // 5. On failure, update status and stop execution
  console.error(`❌ ${statusFailed}:`, error);
  
  await supabase
    .from("tb_pms_reports")
    .update({ status: statusFailed.trim() })
    .eq("wizard_id", wizard_id);

  return new Response(
    JSON.stringify({
      success: false,
      failedAt: tool.step,
      tool_name: tool.tool_name,
      error: String(error)
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
```

### Código Novo (mesmas linhas, com timeout)

```typescript
try {
  // Create abort controller with 150 second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 150000);

  // 2. Call n8n webhook with tool_name and wizard_id
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tool_name: tool.tool_name,
      wizard_id: wizard_id
    }),
    signal: controller.signal,
  });

  // Clear timeout on successful response
  clearTimeout(timeoutId);

  // 3. Check HTTP response
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  // Consume response body
  await response.text();

  // 4. Update status to "Completed"
  await supabase
    .from("tb_pms_reports")
    .update({ status: statusCompleted.trim() })
    .eq("wizard_id", wizard_id);

  console.log(`✅ ${statusCompleted}`);

} catch (error) {
  // 5. On failure (including timeout), update status and stop execution
  const isTimeout = error.name === 'AbortError';
  const errorMessage = isTimeout 
    ? 'Request timeout (150s exceeded)' 
    : String(error);
  
  console.error(`❌ ${statusFailed}:`, errorMessage);
  
  await supabase
    .from("tb_pms_reports")
    .update({ status: statusFailed.trim() })
    .eq("wizard_id", wizard_id);

  return new Response(
    JSON.stringify({
      success: false,
      failedAt: tool.step,
      tool_name: tool.tool_name,
      error: errorMessage
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
```

---

## Diferenças Exatas

| Linha | Antes | Depois |
|-------|-------|--------|
| +2 linhas | - | `const controller = new AbortController();` |
| +1 linha | - | `const timeoutId = setTimeout(() => controller.abort(), 150000);` |
| Fetch | Sem signal | `signal: controller.signal` |
| +1 linha | - | `clearTimeout(timeoutId);` |
| Catch | `error` | Detecta `AbortError` para mensagem clara |

---

## Por Que Isso Funciona

```text
[Cenário 1: n8n responde em 30s]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
fetch inicia → n8n processa → resposta em 30s
              → clearTimeout()
              → status = "Completed"
              → próximo step

[Cenário 2: n8n demora 90s]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
fetch inicia → n8n processa...
              → 90s depois, resposta chega
              → clearTimeout()
              → status = "Completed"
              → próximo step

[Cenário 3: n8n demora 160s (TIMEOUT)]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
fetch inicia → n8n processa...
              → 150s, AbortController dispara
              → fetch lança AbortError
              → catch executa
              → status = "Fail" gravado no banco
              → frontend detecta → tela de erro
```

---

## O Que NÃO Muda

- Fluxo de 12 steps (TOOLS_SEQUENCE)
- Geração de share_token/share_url
- CORS headers
- Lógica de resume_from_step
- Todo o código do frontend
- Polling do useReportData
- Detecção de Fail no PmsLoading
- UI do GeneratingReportSkeleton

---

## Teste Pós-Implementação

1. Gerar um relatório novo → verificar que funciona normalmente
2. Se Step 12 demorar mais de 150s → verificar que grava "Fail"
3. Verificar que a tela de erro aparece quando há "Fail"
4. Verificar que o botão "Retry" funciona

