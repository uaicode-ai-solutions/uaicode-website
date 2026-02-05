
# Nova Seção "Meet Eve" - Substituindo o ChatSection

## Resumo
Substituir o componente `ChatSection` atual (chat embarcado) por uma nova seção "Meet Eve" no estilo visual da seção "Meet the Founder", com:
- Imagem grande da Eve (usando o asset existente `eve-avatar.webp`)
- Descrição da Eve como SDR/Support AI
- Botões de Email, Chat e Voice (abrindo os dialogs ElevenLabs)
- Frase de efeito substituindo "English • Português • Español"

---

## Alterações

### 1. Criar novo componente `MeetEve.tsx`

**Arquivo:** `src/components/MeetEve.tsx`

Design inspirado no MeetTheFounder.tsx:
- Layout em 2 colunas (texto à esquerda, imagem à direita)
- Fundo escuro com `bg-black`
- Título com `text-gradient-gold`
- Imagem grande e arredondada com hover effect
- Botões de ação (Email, Chat, Call)

```text
ESTRUTURA VISUAL:
┌────────────────────────────────────────────────────────────────┐
│                      Meet Eve                                   │
│              Your AI Assistant, Available 24/7                  │
│                                                                 │
│  ┌─────────────────────────┐   ┌──────────────────────────┐   │
│  │ Descrição:              │   │                          │   │
│  │                         │   │   [Foto grande da Eve]   │   │
│  │ Eve Morgan is your      │   │                          │   │
│  │ AI assistant at         │   │                          │   │
│  │ Uaicode...             │   │                          │   │
│  │                         │   │                          │   │
│  │ ┌────────────────────┐  │   └──────────────────────────┘   │
│  │ │ [Email] [Chat] [Call]│ │                                  │
│  │ └────────────────────┘  │                                  │
│  │                         │                                  │
│  │ ✨ Always here to help  │                                  │
│  └─────────────────────────┘                                  │
└────────────────────────────────────────────────────────────────┘
```

### Conteúdo do componente:

**Título:** "Meet Eve"

**Subtítulo:** "Your AI Assistant, Available 24/7"

**Descrição:**
"Eve Morgan is your friendly AI assistant at Uaicode. She's here to answer your questions about our services, help you understand if we're the right fit for your project, and guide you through the process of turning your idea into reality."

"Whether you prefer to chat, talk, or send an email, Eve is ready to help you take the next step toward building your MVP."

**Frase de efeito:** "Always here to help ✨"

**Botões:**
- Email (abre EmailContactDialog)
- Chat (abre EveChatDialog) 
- Call (abre EveVoiceDialog)

---

### 2. Atualizar `Index.tsx`

**Arquivo:** `src/pages/Index.tsx`

| Ação | Detalhes |
|------|----------|
| Remover import | `ChatSection from "@/components/ChatSection"` |
| Adicionar import | `MeetEve from "@/components/MeetEve"` |
| Substituir componente | `<ChatSection />` → `<MeetEve />` |

---

### 3. Remover `ChatSection.tsx` (opcional - pode manter para referência)

O componente antigo pode ser mantido no projeto ou removido, dependendo da preferência.

---

## Detalhes Técnicos

### MeetEve.tsx - Estrutura completa:

```tsx
// Imports necessários:
import { useState } from "react";
import { Mail, MessageSquare, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import eveImage from "@/assets/eve-avatar.webp";
import EmailContactDialog from "@/components/chat/EmailContactDialog";
import EveChatDialog from "@/components/chat/EveChatDialog";
import EveVoiceDialog from "@/components/chat/EveVoiceDialog";

// Estados para controlar os dialogs:
const [showEmailDialog, setShowEmailDialog] = useState(false);
const [showChatDialog, setShowChatDialog] = useState(false);
const [showVoiceDialog, setShowVoiceDialog] = useState(false);

// Layout similar ao MeetTheFounder:
// - section com id="eve" e bg-black
// - Grid 2 colunas em desktop, 1 coluna em mobile
// - Coluna esquerda: conteúdo + botões
// - Coluna direita: imagem grande da Eve
```

### Botões de ação:
```tsx
<div className="flex flex-wrap gap-4">
  <Button onClick={() => setShowEmailDialog(true)} variant="outline" size="lg">
    <Mail /> Email Eve
  </Button>
  <Button onClick={() => setShowChatDialog(true)} variant="outline" size="lg">
    <MessageSquare /> Chat with Eve
  </Button>
  <Button onClick={() => setShowVoiceDialog(true)} size="lg" className="bg-accent">
    <Phone /> Call Eve
  </Button>
</div>
```

---

## Dialogs Reutilizados

Os dialogs já existentes serão reutilizados sem alteração:
- `EmailContactDialog` - Formulário de email
- `EveChatDialog` - Chat ElevenLabs text
- `EveVoiceDialog` - Voice ElevenLabs

---

## Impacto

- Remove o chat embutido da home (UX mais limpa)
- Adiciona seção visual impactante no estilo "Meet the Founder"
- Mantém todas as funcionalidades de contato (Email, Chat, Voice)
- Usa os dialogs ElevenLabs já implementados
- Frase de efeito substituindo informação de idiomas desatualizada
