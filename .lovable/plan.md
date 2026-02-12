

## Corrigir pms-webhook-new-leads para lidar com secret contendo JSON do n8n

### Problema identificado

A secret `N8N_PMS_GENERATE_LEADS_WEBHOOK_ID` contém o JSON completo de exportacao do workflow do n8n (com nodes, connections, pinData, etc.) em vez de apenas a URL ou ID do webhook. O codigo tenta usar esse JSON inteiro como parte da URL, resultando em erro de DNS.

Os logs confirmam:
- A function foi chamada corretamente pelo trigger
- O `wizard_id` foi recebido e os dados do wizard foram buscados com sucesso
- O erro ocorre ao montar a URL: `https://n8n.uaicode.dev/webhook/{ "nodes": [...] }`

### Solucao

Tornar a funcao `getWebhookUrl()` mais robusta para detectar e extrair a URL correta mesmo quando a secret contiver um JSON do n8n. A logica sera:

1. Se o valor comeca com `http` -> usa direto (comportamento atual)
2. Se o valor parece ser JSON -> tenta parsear e extrair o campo `webhookUrl` do pinData, ou montar a URL a partir do campo `path` do webhook node
3. Se for um ID simples -> monta a URL como `https://n8n.uaicode.dev/webhook/{id}` (comportamento atual)

### Detalhes tecnicos

#### Arquivo alterado: `supabase/functions/pms-webhook-new-leads/index.ts`

Apenas a funcao `getWebhookUrl()` sera atualizada (linhas 10-18):

```text
const getWebhookUrl = (): string => {
  const webhookId = Deno.env.get("N8N_PMS_GENERATE_LEADS_WEBHOOK_ID");
  if (!webhookId) {
    throw new Error("N8N_PMS_GENERATE_LEADS_WEBHOOK_ID not configured");
  }
  
  // Se ja e uma URL completa, usa direto
  if (webhookId.startsWith("http")) {
    return webhookId;
  }
  
  // Se parece ser JSON (workflow exportado do n8n), tenta extrair a URL
  if (webhookId.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(webhookId);
      
      // Tenta extrair webhookUrl do pinData
      if (parsed.pinData) {
        for (const nodeData of Object.values(parsed.pinData)) {
          if (Array.isArray(nodeData) && nodeData[0]?.webhookUrl) {
            return nodeData[0].webhookUrl;
          }
        }
      }
      
      // Tenta extrair path do webhook node
      if (parsed.nodes) {
        for (const node of parsed.nodes) {
          if (node.type === "n8n-nodes-base.webhook" && node.parameters?.path) {
            return `https://n8n.uaicode.dev/webhook/${node.parameters.path}`;
          }
        }
      }
      
      throw new Error("Could not extract webhook URL from JSON");
    } catch (e) {
      if (e.message === "Could not extract webhook URL from JSON") throw e;
      throw new Error("N8N_PMS_GENERATE_LEADS_WEBHOOK_ID contains invalid JSON");
    }
  }
  
  // Fallback: trata como ID simples
  return `https://n8n.uaicode.dev/webhook/${webhookId}`;
};
```

Baseado no JSON atual da secret, a URL extraida sera:
`https://uaicode-n8n.ax5vln.easypanel.host/webhook/pms-generate-report`
(campo `webhookUrl` encontrado em `pinData.Webhook[0].webhookUrl`)

### Nenhum outro arquivo sera alterado

- Trigger do banco: intacto (ja funciona - chamou a function corretamente)
- `config.toml`: intacto
- Demais edge functions: intactas

