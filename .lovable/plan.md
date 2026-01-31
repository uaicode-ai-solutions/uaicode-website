
# Plano: Resolver Timeout da Edge Function com Background Tasks

## 🔍 Diagnóstico Completo

### Problema Real Identificado
Após análise dos logs e documentação da Supabase, o problema **NÃO é o timeout do fetch**, mas sim os **limites da plataforma Supabase**:

| Limite | Free Plan | Paid Plan |
|--------|-----------|-----------|
| **Wall Clock Time** | 150s | 400s |
| **CPU Time por Request** | 2s | 2s |
| **Memory** | 256MB | 256MB |

**O que acontece hoje:**
1. `pms-orchestrate-report` faz fetch para n8n (Step 12 Business Plan)
2. O n8n demora ~60-90 segundos processando
3. A Edge Function fica **idle esperando** (consome wall clock, não CPU)
4. Aos **~60 segundos**, a plataforma Supabase **força shutdown** do worker
5. O status fica travado em "Step 12 Business Plan - In Progress"
6. A tela de loading fica infinitamente polling

### Por Que o Timeout de 150s Não Funcionou
O código implementado (`AbortController` com 150s) estava correto, mas:
- A Edge Function já fez shutdown aos 60s (forçado pela plataforma)
- O código do catch **nunca executa** porque o worker morre antes
- Não é um timeout do fetch, é um **shutdown forçado do worker**

---

## ✅ Solução: Background Tasks + Callback Pattern

A arquitetura precisa mudar de **sync (request-response)** para **async (fire-and-forget + callback)**.

### Nova Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│ FASE 1: Iniciar Workflow (Resposta Imediata)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
    Frontend → pms-orchestrate-report → Resposta 200 OK (1s)
                     ↓
              EdgeRuntime.waitUntil(processSteps())
                     ↓
              [Worker continua executando em background]

┌─────────────────────────────────────────────────────────────────┐
│ FASE 2: Processar Steps (Background)                           │
└─────────────────────────────────────────────────────────────────┘

    Loop (Step 1 → 12):
      ├─ Update status = "Step N - In Progress"
      ├─ Fetch n8n webhook (com timeout de 150s)
      ├─ Aguarda resposta (pode demorar 90s)
      ├─ Update status = "Step N - Completed"
      └─ Next step

    Se timeout ou erro:
      ├─ Update status = "Step N - Fail"
      └─ STOP

    Se todos completarem:
      ├─ Generate share_token + share_url
      └─ Update status = "completed"

┌─────────────────────────────────────────────────────────────────┐
│ FASE 3: Frontend Polling (Inalterado)                          │
└─────────────────────────────────────────────────────────────────┘

    useReportData:
      ├─ Poll a cada 5s
      ├─ Detecta "completed" → Navega dashboard
      └─ Detecta "Fail" → Mostra tela de erro
```

---

## 📝 Mudanças Técnicas

### 1. Edge Function: `pms-orchestrate-report/index.ts`

#### Antes (Sync Pattern)
```typescript
serve(async (req) => {
  // ... CORS
  const { wizard_id, resume_from_step } = await req.json();
  
  // Loop sequencial que bloqueia a resposta
  for (let i = startIndex; i < TOOLS_SEQUENCE.length; i++) {
    const tool = TOOLS_SEQUENCE[i];
    // ... update "In Progress"
    const response = await fetch(webhookUrl, {...}); // BLOQUEIA AQUI
    // ... update "Completed"
  }
  
  // Só responde quando TUDO termina (nunca chega aqui se houver shutdown)
  return new Response(JSON.stringify({ success: true }), {...});
});
```

**Problema:** O `serve()` fica bloqueado esperando o loop completar. Se o loop demorar >60s, a plataforma mata o worker antes de responder.

#### Depois (Async Pattern com Background Tasks)
```typescript
serve(async (req) => {
  // ... CORS
  const { wizard_id, resume_from_step } = await req.json();
  
  // Marca o processamento como background task
  EdgeRuntime.waitUntil(
    processReportSteps(wizard_id, resume_from_step)
  );
  
  // Responde IMEDIATAMENTE (1s)
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: "Processing started in background" 
    }),
    { status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

// Função auxiliar que roda em background
async function processReportSteps(
  wizard_id: string, 
  resume_from_step?: number
) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const webhookUrl = getWebhookUrl();
  const startIndex = resume_from_step ? resume_from_step - 1 : 0;

  console.log(`🚀 Background task started for wizard: ${wizard_id}, from step: ${startIndex + 1}`);

  try {
    for (let i = startIndex; i < TOOLS_SEQUENCE.length; i++) {
      const tool = TOOLS_SEQUENCE[i];
      const statusInProgress = `Step ${tool.step} ${tool.label} - In Progress`;
      const statusCompleted = `Step ${tool.step} ${tool.label} - Completed`;
      const statusFailed = `Step ${tool.step} ${tool.label} - Fail`;

      // Update to In Progress
      await supabase
        .from("tb_pms_reports")
        .update({ status: statusInProgress.trim() })
        .eq("wizard_id", wizard_id);

      console.log(`📍 ${statusInProgress}`);

      try {
        // AbortController com 150s timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 150000);

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool_name: tool.tool_name,
            wizard_id: wizard_id
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        await response.text();

        // Update to Completed
        await supabase
          .from("tb_pms_reports")
          .update({ status: statusCompleted.trim() })
          .eq("wizard_id", wizard_id);

        console.log(`✅ ${statusCompleted}`);

      } catch (error: unknown) {
        const isTimeout = error instanceof Error && error.name === 'AbortError';
        const errorMessage = isTimeout 
          ? 'Request timeout (150s exceeded)' 
          : String(error);
        
        console.error(`❌ ${statusFailed}:`, errorMessage);
        
        // Update to Fail
        await supabase
          .from("tb_pms_reports")
          .update({ status: statusFailed.trim() })
          .eq("wizard_id", wizard_id);

        // Stop processing on failure
        return;
      }
    }

    // All steps completed - generate share data
    const shareToken = generateShareToken();
    const shareUrl = `${PRODUCTION_URL}/planningmysaas/shared/${shareToken}`;

    await supabase
      .from("tb_pms_reports")
      .update({ 
        status: "completed",
        share_token: shareToken,
        share_url: shareUrl,
        share_enabled: true,
        share_created_at: new Date().toISOString()
      })
      .eq("wizard_id", wizard_id);

    console.log(`🔗 Share URL generated: ${shareUrl}`);
    console.log(`🎉 Report completed for wizard: ${wizard_id}`);

  } catch (error) {
    console.error("❌ Background task error:", error);
    // Update to generic fail status
    await supabase
      .from("tb_pms_reports")
      .update({ status: "Generation Failed" })
      .eq("wizard_id", wizard_id);
  }
}
```

**Benefícios:**
- ✅ Resposta HTTP em <1 segundo (status 202 Accepted)
- ✅ Worker não morre porque não está bloqueado
- ✅ `EdgeRuntime.waitUntil` garante que o background task complete (até 150s no free plan)
- ✅ Mesmo se demorar 90s no Step 12, o worker continua vivo
- ✅ Frontend polling continua funcionando sem mudanças

### 2. Listener de Shutdown (Opcional, mas Recomendado)

Para detectar se o worker vai morrer antes de completar (ex: atingir 150s):

```typescript
// Adicionar no topo do arquivo, antes do serve()
let shutdownRequested = false;

addEventListener('beforeunload', () => {
  shutdownRequested = true;
  console.warn('⚠️ Worker shutdown requested, attempting graceful cleanup...');
});

// Dentro do loop de processReportSteps:
for (let i = startIndex; i < TOOLS_SEQUENCE.length; i++) {
  // Verificar shutdown antes de cada step
  if (shutdownRequested) {
    console.error('❌ Worker shutting down, marking as failed');
    await supabase
      .from("tb_pms_reports")
      .update({ status: "Generation interrupted - Please retry" })
      .eq("wizard_id", wizard_id);
    return;
  }
  
  // ... resto do código
}
```

---

## 🔄 O Que NÃO Muda

### Frontend (Zero Mudanças)
- ✅ `PmsLoading.tsx` continua igual
- ✅ `useReportData.ts` continua polling a cada 5s
- ✅ Detecção de "completed" e "Fail" continua igual
- ✅ UI de erro e retry continua igual
- ✅ `GeneratingReportSkeleton` continua igual

### Backend (Apenas 1 Arquivo)
- ✅ Webhook do n8n continua igual
- ✅ TOOLS_SEQUENCE (12 steps) continua igual
- ✅ Lógica de resume_from_step continua igual
- ✅ Geração de share_token/share_url continua igual

---

## 🧪 Teste Pós-Implementação

### Cenário 1: Steps Rápidos (Normal)
```
POST /pms-orchestrate-report → 202 Accepted (1s)
  ↓
Background task:
  Step 1 (2s) → Completed
  Step 2 (1s) → Completed
  ...
  Step 12 (90s) → Completed
  ↓
Status = "completed" → Frontend navega para dashboard
```

### Cenário 2: Step 12 Timeout (150s)
```
POST /pms-orchestrate-report → 202 Accepted (1s)
  ↓
Background task:
  Step 1-11 → Completed
  Step 12 → Fetch inicia...
           → 150s timeout
           → AbortError
           → Status = "Step 12 Business Plan - Fail"
  ↓
Frontend detecta "Fail" → Mostra tela de erro
```

### Cenário 3: Worker Shutdown (150s wall clock)
```
POST /pms-orchestrate-report → 202 Accepted (1s)
  ↓
Background task:
  Step 1-11 (total: 140s acumulado)
  Step 12 → Fetch inicia...
           → beforeunload dispara aos 150s
           → Status = "Generation interrupted - Please retry"
  ↓
Frontend detecta "Fail" → Mostra tela de erro
```

---

## 📊 Comparação Antes vs Depois

| Aspecto | Antes (Sync) | Depois (Async) |
|---------|-------------|----------------|
| **Tempo de resposta HTTP** | Nunca (timeout) | <1 segundo |
| **Máximo de execução** | ~60s (shutdown forçado) | 150s (free) / 400s (paid) |
| **Step 12 demora 90s** | ❌ Worker morre | ✅ Completa normalmente |
| **Timeout de 150s** | ❌ Código não executa | ✅ Catch detecta e grava Fail |
| **Frontend precisa mudar?** | - | ❌ Não |
| **n8n precisa mudar?** | - | ❌ Não |

---

## 🎯 Resumo Executivo

**Problema:** Edge Function morre aos 60s porque fica bloqueada esperando n8n responder.

**Solução:** Usar `EdgeRuntime.waitUntil()` para processar os 12 steps em background, respondendo imediatamente ao frontend.

**Impacto:**
- ✅ 1 arquivo modificado: `supabase/functions/pms-orchestrate-report/index.ts`
- ✅ Zero mudanças no frontend
- ✅ Zero mudanças no n8n
- ✅ Funciona mesmo com Step 12 demorando 90s
- ✅ Timeout de 150s agora funciona corretamente

**Risco:** Baixíssimo - Background Tasks é uma feature nativa da Supabase, documentada e estável desde dezembro/2024.
