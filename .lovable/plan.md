

# Plano: Adicionar wizard_id no Nível Raiz do Payload

## Problema Identificado

O n8n espera encontrar `wizard_id` no nível raiz do payload, mas o edge function envia os dados numa estrutura aninhada:

```text
Estrutura Atual:
{
  "event": "wizard.created",
  "data": {
    "wizard": {
      "id": "xxx"  ← n8n não consegue encontrar aqui
    }
  }
}

Estrutura Esperada pelo n8n:
{
  "wizard_id": "xxx",  ← n8n espera aqui
  ...
}
```

## Solução

Adicionar o campo `wizard_id` no nível raiz do payload, mantendo a estrutura completa existente para compatibilidade.

## Alteração Necessária

**Arquivo**: `supabase/functions/pms-webhook-new-report/index.ts`

Modificar o `webhookPayload` (linhas 143-180) para incluir `wizard_id` no nível raiz:

```typescript
const webhookPayload = {
  wizard_id: wizardData.id,  // <-- Adicionar esta linha
  event: "wizard.created",
  timestamp: new Date().toISOString(),
  data: {
    wizard: {
      id: wizardData.id,
      // ... resto mantém igual
    },
    user: userData ? { ... } : null,
  },
};
```

## Resultado Esperado

Após a alteração, o payload enviado terá esta estrutura:

```json
{
  "wizard_id": "c9e0f0b2-8d3a-4b41-a1f2-57edaa56f4ea",
  "event": "wizard.created",
  "timestamp": "2026-01-26T...",
  "data": {
    "wizard": { ... },
    "user": { ... }
  }
}
```

O n8n poderá acessar `$json.wizard_id` diretamente, resolvendo o erro.

## Seção Técnica

### Mudança Mínima

A alteração é de apenas uma linha na definição do objeto `webhookPayload`:

| Linha | Alteração |
|-------|-----------|
| 143 | Adicionar `wizard_id: wizardData.id,` como primeira propriedade |

### Compatibilidade

- O campo `data.wizard.id` continua existindo para outros processos que possam depender dele
- Não quebra nenhuma integração existente
- Apenas adiciona um campo extra para facilitar o acesso no n8n

