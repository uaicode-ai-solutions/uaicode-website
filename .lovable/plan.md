

# Plano: Nova Section "Meet Kyle" (Estilo Premium)

## Análise do Problema

Os banners atuais do Kyle (linhas 728-820 de `NextStepsSection.tsx`):
- Muito compactos e funcionais
- Parecem botões utilitários, não convidativos
- Avatar pequeno (size="sm" = 48px)
- Texto técnico demais ("AI Sales Consultant")
- Muita informação competindo no mesmo espaço

Comparando com "Meet the Founder":
- Layout 2 colunas (texto + foto grande)
- Foto humanizada e destacada
- Subtítulo explicando o papel
- Texto descritivo sobre a pessoa
- CTA único e claro

---

## Solução: Section Dedicada "Meet Kyle"

Criar uma section premium inspirada no "Meet the Founder" que humaniza o Kyle e torna os CTAs muito mais atrativos.

### Design Visual Proposto

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│    Meet Kyle                                              ┌──────────────────┐  │
│    Your AI Sales Consultant                               │                  │  │
│                                                           │   [Kyle Photo]   │  │
│    Kyle is your dedicated AI sales consultant at          │     (Large)      │  │
│    Uaicode.ai. He's here 24/7 to answer your questions,   │                  │  │
│    walk you through pricing options, and help you make    │   Kyle Williams  │  │
│    the best decision for your project.                    │  AI Consultant   │  │
│                                                           └──────────────────┘  │
│    Whether you prefer a quick chat, voice call, or                              │
│    detailed email response, Kyle is always ready                                │
│    to assist.                                                                   │
│                                                                                 │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                            │
│    │ 📧 Email    │  │ 💬 Chat     │  │ 📞 Call     │                            │
│    │  24h reply  │  │  Instant    │  │  24/7       │                            │
│    └─────────────┘  └─────────────┘  └─────────────┘                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Características do Design

1. **Layout 2 Colunas** (igual ao Meet the Founder)
   - Esquerda: Título, descrição humanizada, 3 botões de ação
   - Direita: Foto grande do Kyle com nome/cargo

2. **Foto Destacada**
   - Avatar grande (max-w-md, rounded-2xl)
   - Badge com nome "Kyle Williams" e cargo "AI Sales Consultant"
   - Borda amber com glow sutil

3. **Texto Humanizado**
   - Título: "Meet Kyle" (gradient gold)
   - Subtítulo: "Your AI Sales Consultant"
   - 2 parágrafos explicando o que ele faz

4. **3 Botões de Ação** (lado a lado)
   - Email Kyle (ícone Mail + "24h reply")
   - Chat with Kyle (ícone MessageSquare + "Instant")
   - Call Kyle (ícone Phone + "24/7")
   - Estilo: ghost buttons com hover amber

---

## Estratégia de Implementação

### Opção A: Componente Novo (Recomendado)

Criar um novo componente `MeetKyleSection.tsx` que:
- Importa os mesmos dialogs (KyleConsultantDialog, KyleChatDialog, EmailKyleDialog)
- Usa a foto do Kyle (`kyle-avatar.webp`)
- Gerencia os states dos dialogs internamente
- Recebe `wizardId` como prop

### Opção B: Refatorar NextStepsSection

Substituir os banners atuais (linhas 728-820) pela nova section dentro do mesmo arquivo.

**Escolha:** Opção A - Componente novo é mais seguro e não mexe no NextStepsSection existente.

---

## Alterações Propostas

### 1. Criar novo componente `MeetKyleSection.tsx`

**Arquivo:** `src/components/planningmysaas/dashboard/sections/MeetKyleSection.tsx`

```typescript
import { useState } from "react";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import kyleAvatar from "@/assets/kyle-avatar.webp";
import KyleConsultantDialog from "../KyleConsultantDialog";
import KyleChatDialog from "../KyleChatDialog";
import EmailKyleDialog from "../EmailKyleDialog";

interface MeetKyleSectionProps {
  wizardId: string | undefined;
}

const MeetKyleSection = ({ wizardId }: MeetKyleSectionProps) => {
  const [kyleDialogOpen, setKyleDialogOpen] = useState(false);
  const [kyleChatDialogOpen, setKyleChatDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  return (
    <section className="py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-gold">Meet Kyle</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Your AI Sales Consultant
            </p>
          </div>

          <div className="space-y-4 text-base text-muted-foreground">
            <p>
              Kyle is your dedicated AI sales consultant at Uaicode.ai. 
              He's here 24/7 to answer your questions, walk you through 
              pricing options, and help you make the best decision for your project.
            </p>
            <p>
              Whether you prefer a quick chat, voice call, or detailed email 
              response, Kyle is always ready to assist with expert knowledge 
              about your specific report and our services.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => setEmailDialogOpen(true)}
              variant="outline"
              size="lg"
              className="gap-2 border-amber-500/30 hover:bg-amber-500 hover:text-black"
            >
              <Mail className="h-5 w-5" />
              Email Kyle
              <span className="text-xs opacity-70">24h reply</span>
            </Button>
            
            <Button 
              onClick={() => setKyleChatDialogOpen(true)}
              variant="outline"
              size="lg"
              className="gap-2 border-amber-500/30 hover:bg-amber-500 hover:text-black"
            >
              <MessageSquare className="h-5 w-5" />
              Chat with Kyle
              <span className="text-xs opacity-70">Instant</span>
            </Button>
            
            <Button 
              onClick={() => setKyleDialogOpen(true)}
              size="lg"
              className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400"
            >
              <Phone className="h-5 w-5" />
              Call Kyle
              <span className="text-xs opacity-70">24/7</span>
            </Button>
          </div>
        </div>

        {/* Right Column - Photo */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <img
              src={kyleAvatar}
              alt="Kyle - AI Sales Consultant"
              className="w-full h-auto max-w-md rounded-2xl shadow-2xl border-2 border-amber-500/30"
            />
            {/* Name Badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm px-6 py-3 rounded-xl border border-amber-500/30 shadow-lg">
              <p className="font-bold text-foreground text-center">Kyle Williams</p>
              <p className="text-sm text-amber-400 text-center">AI Sales Consultant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <KyleConsultantDialog 
        open={kyleDialogOpen} 
        onOpenChange={setKyleDialogOpen}
        wizardId={wizardId}
      />
      <KyleChatDialog 
        open={kyleChatDialogOpen} 
        onOpenChange={setKyleChatDialogOpen}
        wizardId={wizardId}
      />
      <EmailKyleDialog 
        open={emailDialogOpen} 
        onOpenChange={setEmailDialogOpen}
      />
    </section>
  );
};

export default MeetKyleSection;
```

---

### 2. Remover banners antigos do NextStepsSection

**Arquivo:** `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx`

Remover linhas 728-820 (o bloco "Have a Question? Kyle Contact Row" e os 3 cards).

Manter apenas os dialogs existentes pois agora serão gerenciados pelo MeetKyleSection.

**Remoção:**
- Linha 729-820: Todo o bloco de contact com Kyle
- Linhas 146-148: States dos dialogs (mover para MeetKyleSection)
- Linhas 822-837: Renderização dos dialogs

---

### 3. Adicionar MeetKyleSection no PmsDashboard

**Arquivo:** `src/pages/PmsDashboard.tsx`

Na tab "nextsteps", adicionar MeetKyleSection entre NextStepsSection e ScheduleCallSection:

```typescript
{activeTab === "nextsteps" && (
  <div className="space-y-16">
    <NextStepsSection onScheduleCall={handleScheduleCall} onNewReport={handleNewReport} />
    <MeetKyleSection wizardId={wizardId} />
    <ScheduleCallSection projectName={projectName} />
  </div>
)}
```

---

## Resumo de Alterações

| Arquivo | Ação | Linhas |
|---------|------|--------|
| `MeetKyleSection.tsx` | Criar novo | +100 |
| `NextStepsSection.tsx` | Remover banners Kyle | -95 |
| `PmsDashboard.tsx` | Adicionar import + componente | +3 |

**Resultado líquido:** +8 linhas

---

## Arquivos Tocados

| Arquivo | Tipo |
|---------|------|
| `src/components/planningmysaas/dashboard/sections/MeetKyleSection.tsx` | Novo |
| `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx` | Modificar |
| `src/pages/PmsDashboard.tsx` | Modificar |

---

## Benefícios

1. **Humanização** - Kyle deixa de ser 3 botões e vira uma "pessoa" com foto grande e bio
2. **Clareza** - Usuário entende imediatamente o que é e o que pode fazer
3. **Conversão** - Layout premium igual ao Founder inspira mais confiança
4. **CTAs Claros** - 3 botões grandes lado a lado, fáceis de clicar
5. **Menos Poluição Visual** - Remove os 3 cards pequenos que competiam espaço

---

## Segurança

- Os dialogs existentes (KyleConsultantDialog, KyleChatDialog, EmailKyleDialog) **não serão tocados**
- Apenas movemos os states e a renderização para o novo componente
- Os hooks (useKyleElevenLabs, useKyleChatElevenLabs) continuam funcionando igual

