

# Adicionar Eve à Seção "Still have questions?" da Landing Page

## Visão Geral

Transformar a seção de contato do FAQ em um hub de comunicação completo com 3 opções:
1. **Send Us a Message** - Form de email existente (mantido)
2. **Chat with Eve** - Interface de chat texto com a Eve
3. **Call Eve** - Interface de voz com a Eve

O design seguirá o padrão já estabelecido no `MeetKyleSection`, adaptado para a Eve.

## Arquivos a Criar

### 1. Edge Function: `supabase/functions/eve-conversation-token/index.ts`
Token para conexão de voz WebRTC/WebSocket com a Eve.
- Usa `ELEVENLABS_EVE_AGENT_ID` do Supabase secrets
- Segue o mesmo padrão do `kyle-conversation-token`

### 2. Edge Function: `supabase/functions/eve-chat-token/index.ts`
Token para conexão de chat (text-only) com a Eve.
- Usa `ELEVENLABS_EVE_AGENT_ID_CHAT` do Supabase secrets
- Segue o mesmo padrão do `kyle-chat-token`

### 3. Hook: `src/hooks/useEveElevenLabs.ts`
Hook para gerenciar conexão de VOZ com a Eve.
- Baseado no `useKyleElevenLabs`
- Não requer `wizardId` (é landing page, não há contexto de projeto)
- Chama `eve-conversation-token`

### 4. Hook: `src/hooks/useEveChatElevenLabs.ts`
Hook para gerenciar conexão de CHAT com a Eve.
- Baseado no `useKyleChatElevenLabs`
- Não requer `wizardId`
- Chama `eve-chat-token`
- Modo `textOnly: true`

### 5. Componente: `src/components/chat/EveVoiceDialog.tsx`
Dialog de voz para falar com a Eve.
- Baseado no `KyleConsultantDialog`
- Usa `EveAvatar` já existente
- Visual consistente com tema amber/gold

### 6. Componente: `src/components/chat/EveChatDialog.tsx`
Dialog de chat para conversar com a Eve.
- Baseado no `KyleChatDialog`
- Usa `EveAvatar` já existente
- Input de texto + visualização de mensagens

## Arquivos a Modificar

### 7. `src/components/planningmysaas/PmsFaq.tsx`

Atualizar a seção "Contact CTA" (linhas 97-113) para incluir os 3 cards:

```text
┌──────────────────────────────────────────────────────────────────┐
│                    Still have questions?                          │
│       Our AI assistant and support team are here to help         │
├────────────────────┬────────────────────┬────────────────────────┤
│   📧 Send Us a     │   💬 Chat with     │   📞 Call Eve          │
│     Message        │      Eve           │                        │
│                    │                    │                        │
│   [Eve Avatar]     │   [Eve Avatar]     │   [Eve Avatar]         │
│   Email Support    │   AI Chat          │   Voice AI             │
│                    │                    │                        │
│   "Get a response  │   "Instant answers │   "Talk directly       │
│   within 24h"      │   via text chat"   │   with Eve"            │
│                    │                    │                        │
│   [Send Message]   │   [Start Chat]     │   [Call Now]           │
└────────────────────┴────────────────────┴────────────────────────┘
```

## Detalhes Técnicos

### Edge Functions - Secrets Necessários
Os secrets já existem no Supabase:
- `ELEVENLABS_API_KEY` (já configurado)
- `ELEVENLABS_EVE_AGENT_ID` (voz)
- `ELEVENLABS_EVE_AGENT_ID_CHAT` (chat)

### Hooks da Eve vs Kyle
| Aspecto | Kyle | Eve |
|---------|------|-----|
| Contexto | `wizardId` obrigatório | Nenhum contexto obrigatório |
| Uso | Dashboard (pós-relatório) | Landing Page (pré-conversão) |
| Dynamic Vars | `wizard_id`, `timezone`, `current_date` | `timezone`, `current_date` apenas |

### Componentes Reutilizados
- `EveAvatar` - Já existe em `src/components/chat/EveAvatar.tsx`
- `EmailContactDialog` - Mantido como está (form de email)
- UI Components: `Dialog`, `Button`, `Badge`, `Input`, etc.

## Fluxo de Usuário

1. Usuário rola até o FAQ na landing page `/planningmysaas`
2. Vê 3 cards na seção "Still have questions?"
3. Pode escolher:
   - **Email** → Abre `EmailContactDialog` existente
   - **Chat** → Abre `EveChatDialog` (novo)
   - **Voice** → Abre `EveVoiceDialog` (novo)
4. Eve inicia conversa, qualifica o lead, captura informações via tools

## Estrutura Visual dos Cards

Cada card terá:
- Header com ícone e título
- Avatar da Eve centralizado
- Subtítulo com descrição breve
- Botão de ação

Cores seguirão o tema amber/gold já usado para os outros elementos de AI.

