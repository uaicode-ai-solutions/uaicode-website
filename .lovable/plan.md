
# Plano: Teste Rápido do Kyle via API simulate_conversation

## Objetivo
Criar uma edge function temporária que executa 3-4 cenários de teste do Kyle usando a API `simulate_conversation` do ElevenLabs e retorna um relatório JSON com os resultados.

---

## Arquitetura Simplificada

```text
Você (via curl) → kyle-qa-quick-test → ElevenLabs simulate_conversation API
                         ↓
                  Relatório JSON com transcripts e scores
```

---

## Cenários de Teste (4 cenários essenciais)

| ID | Cenário | Objetivo |
|----|---------|----------|
| `PRICE_OBJECTION` | Lead diz "muito caro" | Validar que Kyle foca em valor/ROI |
| `SOURCE_CHECK` | Lead pede fontes dos dados | Validar pivot para enviar email |
| `SCHEDULE_CALL` | Lead quer agendar reunião | Validar chamada de MCP tools |
| `NEED_TO_THINK` | Lead diz "preciso pensar" | Validar técnica de discovery |

---

## Critérios de Avaliação

1. **brevity**: Respostas têm máximo 2 frases curtas?
2. **no_forbidden_phrases**: Evitou "Let me pull up", "According to report"?
3. **one_question**: Fez apenas 1 pergunta por resposta?
4. **value_before_price**: Focou em valor antes de justificar custo?

---

## Implementação

### Arquivo: `supabase/functions/kyle-qa-quick-test/index.ts`

Edge function única que:
1. Define os 4 cenários de teste
2. Para cada cenário, chama `POST /v1/convai/agents/{agent_id}/simulate-conversation`
3. Passa `dynamic_variables` com wizard_id real, timezone e current_date
4. Inclui `mock_tool_calls` para simular respostas das tools MCP
5. Agrega resultados em JSON estruturado

### Parâmetros da chamada ElevenLabs

```typescript
{
  simulation_specification: {
    simulated_user_config: {
      prompt: {
        prompt: "Simule um lead que acha o preço muito caro...",
        llm: "gpt-4o",
        temperature: 0.7
      },
      first_message: "Oi, acabei de ver o preço do projeto"
    },
    max_turns: 8,
    mock_tool_calls: {
      "kyle_n8n_mcp_tools_kyle_get_lead_context": {
        result: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          project: "Metrixa"
        })
      }
    }
  },
  extra_evaluation_criteria: [
    {
      id: "brevity",
      name: "Brevity Check",
      conversation_goal_prompt: "Each agent response has max 2 short sentences?",
      use_knowledge_base: false
    }
  ],
  dynamic_variables: {
    wizard_id: "57a2f729-64ef-47bd-8edf-beac638eeed5",
    timezone: "America/Sao_Paulo",
    current_date: "2026-02-02T21:50:00Z"
  }
}
```

---

## Estrutura do Relatório

```json
{
  "test_run_id": "quick-test-001",
  "timestamp": "2026-02-02T21:50:00Z",
  "agent_id": "agent_0501kgd6mappep0bknyy9vyw945z",
  "wizard_id": "57a2f729-64ef-47bd-8edf-beac638eeed5",
  "total_scenarios": 4,
  "passed": 3,
  "failed": 1,
  "scenarios": [
    {
      "id": "PRICE_OBJECTION",
      "status": "passed",
      "transcript": [...],
      "tool_calls_detected": ["kyle_get_lead_context"],
      "criteria_results": [
        { "id": "brevity", "result": "success", "rationale": "..." }
      ]
    }
  ]
}
```

---

## Como Executar

Após implementar, você executa via:

```bash
curl -X POST https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/kyle-qa-quick-test \
  -H "apikey: [ANON_KEY]" \
  -H "Content-Type: application/json"
```

Ou eu posso executar diretamente usando a ferramenta de curl do Lovable após o deploy.

---

## Arquivos a Criar

| Arquivo | Tamanho |
|---------|---------|
| `supabase/functions/kyle-qa-quick-test/index.ts` | ~150 linhas |
| Atualização em `supabase/config.toml` | +3 linhas |

---

## Após o Teste

1. Reviso os resultados com você
2. Identificamos áreas de melhoria no System Prompt do Kyle
3. Decidimos se vale criar infraestrutura mais robusta futuramente

---

## Tempo Estimado
- Implementação: 5-10 minutos
- Execução do teste: 1-2 minutos
- Análise: 5 minutos
