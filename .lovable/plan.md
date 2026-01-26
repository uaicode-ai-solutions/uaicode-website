

# Plano: Corrigir Step-by-Step Travado na Tela de Loading

## Problema Identificado

O indicador step-by-step na tela de regeneração está travado no primeiro item porque o `currentStatus` está **hardcoded como "Started"**, ignorando o status real vindo do polling.

**Código problemático em `PmsDashboard.tsx` (linhas 260-269):**
```typescript
if (isRegenerating) {
  return (
    <div className="fixed inset-0 z-[100] bg-background">
      <GeneratingReportSkeleton 
        projectName={projectName} 
        currentStatus="Started"  // ← BUG: Hardcoded, não usa o polling!
      />
    </div>
  );
}
```

**O que acontece:**
1. Usuário clica em "Regenerate"
2. `isRegenerating = true` → mostra `GeneratingReportSkeleton`
3. O `useReportData` faz polling a cada 5 segundos e atualiza `reportData.status`
4. O `useEffect` na linha 87 monitora as mudanças de status corretamente
5. **MAS** o skeleton recebe `"Started"` fixo, nunca atualiza visualmente

## Solução

Passar o `reportData?.status` real para o `GeneratingReportSkeleton` ao invés do valor hardcoded.

## Alteração

### Arquivo: `src/pages/PmsDashboard.tsx`

**Linha 260-269 - Antes:**
```typescript
if (isRegenerating) {
  return (
    <div className="fixed inset-0 z-[100] bg-background">
      <GeneratingReportSkeleton 
        projectName={projectName} 
        currentStatus="Started"
      />
    </div>
  );
}
```

**Depois:**
```typescript
if (isRegenerating) {
  return (
    <div className="fixed inset-0 z-[100] bg-background">
      <GeneratingReportSkeleton 
        projectName={projectName} 
        currentStatus={reportData?.status}
      />
    </div>
  );
}
```

## Detalhes Técnicos

### Fluxo Corrigido

```text
1. Usuário clica "Regenerate"
2. isRegenerating = true
3. Edge function dispara n8n
4. n8n atualiza status no banco: "Step 1 Investment - Completed"
5. useReportData polling detecta novo status
6. reportData.status atualiza para "Step 1..."
7. GeneratingReportSkeleton re-renderiza com novo status
8. parseCurrentStep("Step 1...") retorna 1
9. UI mostra Step 1 completo, Step 2 em progresso
10. Ciclo continua até status = "Created"
```

### Verificação do parseCurrentStep

A função `parseCurrentStep` no `GeneratingReportSkeleton.tsx` já está correta:

```typescript
const parseCurrentStep = (status: string | undefined): number => {
  if (!status) return 0;
  if (status === "Started") return 0;
  if (status === "Created") return TOTAL_STEPS;
  
  const match = status.match(/Step (\d+)/i);
  return match ? parseInt(match[1]) : 0;
};
```

Ela corretamente:
- Retorna 0 para `undefined` ou `"Started"`
- Retorna 10 (TOTAL_STEPS) para `"Created"`
- Extrai o número do step de strings como `"Step 5 Pricing - Completed"`

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/PmsDashboard.tsx` | Linha 265: trocar `"Started"` por `reportData?.status` |

## Resultado Esperado

- O step-by-step atualiza em tempo real durante regeneração
- Cada step mostra spinner quando ativo
- Steps completados mostram check verde
- Barra de progresso avança conforme os steps

