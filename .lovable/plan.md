

# Plano: Simplificar Edge Function Orquestradora

## Problema
A Edge Function está tentando:
1. Parsear resposta JSON do n8n esperando `{ success: true, data: {...} }`
2. Salvar dados nos campos JSONB do banco
3. Numerar steps começando em 0

Mas o n8n já faz todo o trabalho de salvar dados. A Edge Function só precisa orquestrar o fluxo.

## Alterações

### Arquivo: `supabase/functions/pms-orchestrate-report/index.ts`

#### 1. Remover campos `field` da TOOLS_SEQUENCE (linhas 22-89)
Os campos `field` são desnecessários porque o n8n salva os dados.

```typescript
const TOOLS_SEQUENCE = [
  { id: 1, tool_name: "Create_Report_Row", label: "Initialize Report" },
  { id: 2, tool_name: "Call_Get_Investment_Tool_", label: "Investment Analysis" },
  { id: 3, tool_name: "Call_Get_Benchmark_Tool_", label: "Market Benchmarks" },
  { id: 4, tool_name: "Call_Get_Competitors_Tool_", label: "Competitor Research" },
  { id: 5, tool_name: "Call_Get_Opportunity_Tool_", label: "Market Opportunity" },
  { id: 6, tool_name: "Call_Get_ICP_Tool_", label: "Customer Profiling" },
  { id: 7, tool_name: "Call_Get_Price_Tool_", label: "Pricing Strategy" },
  { id: 8, tool_name: "Call_Get_PaidMedia_Tool_", label: "Paid Media Analysis" },
  { id: 9, tool_name: "Call_Get_Growth_Tool_", label: "Growth Projections" },
  { id: 10, tool_name: "Call_Get_Summary_Tool_", label: "Executive Summary" },
  { id: 11, tool_name: "Call_Get_Hero_Score_Tool_", label: "Final Scoring" },
];
```

#### 2. Usar `tool.id` diretamente (linha 116)
Já que os IDs agora começam em 1:
```typescript
const stepNum = tool.id;  // Agora já começa em 1
```

#### 3. Simplificar lógica de sucesso (linhas 140-167)

**REMOVER** toda a lógica de parsing e salvamento:
```typescript
// REMOVER ESTAS LINHAS (145-167):
const result = await response.json();
if (!result.success) { ... }
if (tool.field && result.data) { ... }
```

**SUBSTITUIR POR** verificação simples de HTTP:
```typescript
// Verificar apenas se HTTP retornou OK
if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`HTTP ${response.status}: ${errorText}`);
}

// n8n já salvou os dados, apenas atualizamos o status
await supabase
  .from("tb_pms_reports")
  .update({ status: statusCompleted })
  .eq("wizard_id", wizard_id);

console.log(`✅ ${statusCompleted}`);
```

## Lógica Final Simplificada

```
Para cada tool na sequência:
  1. Atualiza status para "Step X - In Progress"
  2. Chama n8n com { tool_name, wizard_id }
  3. Se HTTP OK → Atualiza status para "Step X - Completed"
  4. Se HTTP falhou → Atualiza status para "Step X - Fail" e para
```

## Resultado

- Steps numerados de 1 a 11
- Edge Function apenas orquestra (não salva dados)
- n8n continua responsável por salvar dados nos campos JSONB
- Sucesso = HTTP 200, Falha = HTTP não-200

