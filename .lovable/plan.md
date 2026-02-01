
# Plan: Integrar Kyle ao Sistema (Chat + Voice via ElevenLabs)

## Resumo

Conectar o Kyle (AI Sales Consultant) aos diálogos de Chat e Voice usando ElevenLabs. O sistema usará o Agent ID já cadastrado como secret `ELEVENLABS_KYLE_AGENT_ID`. Não precisamos passar `user_email` pois o Kyle já obtém essa informação via tool `kyle_get_lead_context`.

## Arquitetura

```text
┌─────────────────────────────────────────────────────────────┐
│                     PmsDashboard                             │
│                  (ReportProvider context)                    │
│                       ↓ wizardId                             │
├─────────────────────────────────────────────────────────────┤
│  NextStepsSection                                            │
│    │                                                         │
│    ├── KyleChatDialog ────→ useKyleElevenLabs hook          │
│    │        (wizardId)              ↓                        │
│    │                    kyle-conversation-token              │
│    │                              ↓                          │
│    │                    ElevenLabs WebRTC                    │
│    │                    dynamicVariables:                    │
│    │                      - wizard_id                        │
│    │                      - timezone                         │
│    │                                                         │
│    └── KyleConsultantDialog ─→ useKyleElevenLabs (same)     │
└─────────────────────────────────────────────────────────────┘
```

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/functions/kyle-conversation-token/index.ts` | Criar |
| `supabase/config.toml` | Modificar |
| `src/hooks/useKyleElevenLabs.ts` | Criar |
| `src/components/planningmysaas/dashboard/KyleConsultantDialog.tsx` | Modificar |
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | Modificar |
| `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx` | Modificar |

---

## Fase 1: Edge Function

### Criar `supabase/functions/kyle-conversation-token/index.ts`

Nova edge function que:
- Usa `ELEVENLABS_KYLE_AGENT_ID` (secret já cadastrada)
- Usa `ELEVENLABS_API_KEY` (secret existente)
- Gera token WebRTC ou signed URL WebSocket
- Estrutura idêntica a `elevenlabs-conversation-token`, apenas muda a variável do Agent ID

```typescript
const ELEVENLABS_KYLE_AGENT_ID = Deno.env.get('ELEVENLABS_KYLE_AGENT_ID');
// Rest same as elevenlabs-conversation-token
```

### Modificar `supabase/config.toml`

Adicionar:
```toml
[functions.kyle-conversation-token]
verify_jwt = false
```

---

## Fase 2: Hook useKyleElevenLabs

### Criar `src/hooks/useKyleElevenLabs.ts`

Hook customizado baseado em `useElevenLabs.ts`:

**Props:**
```typescript
interface UseKyleElevenLabsOptions {
  wizardId: string | undefined;
  onMessage?: (message: Message) => void;
}
```

**Diferenças do hook existente:**
1. Chama `kyle-conversation-token` ao invés de `elevenlabs-conversation-token`
2. Passa `dynamicVariables` no `startSession`:
   - `wizard_id`: UUID do relatório (para MCP tools chamarem `kyle_get_lead_context`)
   - `timezone`: Timezone do usuário
3. Expõe `messages` array para modo texto
4. Bloqueia `startCall` se `wizardId` não existir

**Return:**
```typescript
{
  isCallActive: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  error: string | null;
  messages: Message[];
  toggleCall: () => Promise<void>;
  startCall: () => Promise<void>;
  endCall: () => Promise<void>;
  getInputVolume: () => number;
  getOutputVolume: () => number;
}
```

---

## Fase 3: Atualizar KyleConsultantDialog (Voice)

### Modificar `src/components/planningmysaas/dashboard/KyleConsultantDialog.tsx`

**Mudanças:**

1. Adicionar prop `wizardId`:
```typescript
interface KyleConsultantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageName?: string;
  wizardId?: string;  // NOVO
}
```

2. Substituir estados mock pelo hook real:
```typescript
// ANTES (mock)
const [isConnecting, setIsConnecting] = useState(false);
const [isCallActive, setIsCallActive] = useState(false);
const [isSpeaking, setIsSpeaking] = useState(false);

// DEPOIS (real)
const { 
  isCallActive, 
  isConnecting, 
  isSpeaking,
  error,
  toggleCall,
  getInputVolume,
  getOutputVolume 
} = useKyleElevenLabs({ wizardId });
```

3. Usar `getInputVolume()` / `getOutputVolume()` para visualização de frequência real

4. Remover:
   - Simulação de speaking periódica
   - Timer de conexão fake
   - Estados mock

5. Mostrar toast de erro se conexão falhar

---

## Fase 4: Atualizar KyleChatDialog (Text Chat)

### Modificar `src/components/planningmysaas/dashboard/KyleChatDialog.tsx`

**Estratégia**: Usar ElevenLabs para voz bidirecionalmente. O usuário fala (microfone) e Kyle responde (áudio + transcrição). As mensagens são capturadas via `onMessage` callback.

**Mudanças:**

1. Adicionar prop `wizardId`:
```typescript
interface KyleChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wizardId?: string;  // NOVO
}
```

2. Integrar hook com callback `onMessage`:
```typescript
const { 
  isCallActive, 
  isConnecting, 
  isSpeaking,
  messages,
  toggleCall,
  endCall,
  error
} = useKyleElevenLabs({ 
  wizardId,
  onMessage: handleNewMessage
});
```

3. Remover completamente:
   - `getMockResponse()` function
   - `INITIAL_MESSAGE` constant
   - `setTimeout` para simular resposta

4. Adicionar botão de microfone para ativar voz
5. Mostrar transcrições em tempo real (user + assistant)
6. Auto-conectar ao abrir o diálogo (ou botão manual)

---

## Fase 5: Atualizar NextStepsSection

### Modificar `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx`

**Mudanças:**

1. Já tem acesso a `wizardId` via `useReportContext()` (linha 112)

2. Passar `wizardId` para os diálogos:

```typescript
// ANTES (linha 823-831)
<KyleConsultantDialog 
  open={kyleDialogOpen} 
  onOpenChange={setKyleDialogOpen}
  packageName={selectedConsultPackage}
/>
<KyleChatDialog 
  open={kyleChatDialogOpen} 
  onOpenChange={setKyleChatDialogOpen}
/>

// DEPOIS
<KyleConsultantDialog 
  open={kyleDialogOpen} 
  onOpenChange={setKyleDialogOpen}
  packageName={selectedConsultPackage}
  wizardId={wizardId}  // NOVO
/>
<KyleChatDialog 
  open={kyleChatDialogOpen} 
  onOpenChange={setKyleChatDialogOpen}
  wizardId={wizardId}  // NOVO
/>
```

---

## Detalhes Técnicos

### Dynamic Variables para MCP Tools

O Kyle precisa do `wizard_id` para suas tools MCP funcionarem:

```typescript
await conversationHook.startSession({
  conversationToken: token,
  connectionType: "webrtc",
  dynamicVariables: {
    wizard_id: wizardId,    // Kyle usa para kyle_get_lead_context
    timezone: userTimezone, // Kyle usa para referências de tempo
  },
});
```

Quando Kyle chama `kyle_get_lead_context`, o n8n recebe o `wizard_id` e retorna:
- Nome do projeto
- Email do usuário (para confirmação antes de enviar)
- Dados de mercado e pesquisa

### Secrets Necessárias

| Secret | Status | Uso |
|--------|--------|-----|
| `ELEVENLABS_API_KEY` | Existe | Autenticação ElevenLabs API |
| `ELEVENLABS_KYLE_AGENT_ID` | Existe | Agent ID do Kyle |

---

## Ordem de Implementação

1. Criar edge function `kyle-conversation-token`
2. Atualizar `supabase/config.toml`
3. Criar hook `useKyleElevenLabs`
4. Atualizar `NextStepsSection` (passar wizardId)
5. Atualizar `KyleConsultantDialog` (Voice)
6. Atualizar `KyleChatDialog` (Chat)
7. Deploy e testar
