

# Atualização dos Hooks para Passar Data Atual

## Objetivo
Adicionar `current_date` às `dynamicVariables` nos dois hooks do Kyle para que o agente sempre saiba a data atual ao agendar chamadas.

## Arquivos a Modificar

### 1. `src/hooks/useKyleElevenLabs.ts` (Voz)

**Localização:** Função `startCall`, dentro do bloco que configura `dynamicVariables`

**Mudança:**
```typescript
// Linha ~123 - Após detectar timezone
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// ADICIONAR: Data atual em UTC ISO 8601 (sem milissegundos)
const currentDateUTC = new Date().toISOString().split('.')[0] + 'Z';
console.log("Kyle: Current date (UTC):", currentDateUTC);
```

**Atualizar dynamicVariables em dois lugares:**

WebRTC (linha ~133):
```typescript
dynamicVariables: {
  wizard_id: wizardId,
  timezone: userTimezone,
  current_date: currentDateUTC,  // NOVO
},
```

WebSocket fallback (linha ~150):
```typescript
dynamicVariables: {
  wizard_id: wizardId,
  timezone: userTimezone,
  current_date: currentDateUTC,  // NOVO
},
```

### 2. `src/hooks/useKyleChatElevenLabs.ts` (Chat Texto)

**Localização:** Função `startChat`, dentro do bloco de configuração

**Mudança:**
```typescript
// Linha ~67 - Após detectar timezone
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// ADICIONAR: Data atual em UTC ISO 8601 (sem milissegundos)
const currentDateUTC = new Date().toISOString().split('.')[0] + 'Z';
console.log("Kyle Chat: Current date (UTC):", currentDateUTC);
```

**Atualizar dynamicVariables (linha ~88):**
```typescript
dynamicVariables: {
  wizard_id: wizardId,
  timezone: userTimezone,
  current_date: currentDateUTC,  // NOVO
},
```

## Resumo das Alterações

| Arquivo | Alteração |
|---------|-----------|
| `useKyleElevenLabs.ts` | Adicionar `current_date` em 2 locais (WebRTC + WebSocket) |
| `useKyleChatElevenLabs.ts` | Adicionar `current_date` em 1 local |

## Formato da Data

O formato gerado será:
- Input: `new Date().toISOString()` → `"2026-02-02T18:30:45.123Z"`
- Output: `split('.')[0] + 'Z'` → `"2026-02-02T18:30:45Z"`

Este formato é exatamente o que o Kyle precisa para as tools de agendamento (UTC ISO 8601 sem milissegundos).

## Resultado Esperado

Após esta atualização:
1. Kyle receberá `{{current_date}}` com o valor correto (ex: `"2026-02-02T18:30:45Z"`)
2. Ao agendar, usará esta data como referência para `afterTime`
3. Nunca mais passará datas no passado para as tools

