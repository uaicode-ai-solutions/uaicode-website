
# Plano: Melhorar Visual dos Cards do Kyle

## Objetivo

Aumentar o tamanho e tornar os cards mais atrativos, aproveitando o espaço disponível agora que temos apenas 2 cards.

## Mudanças Propostas

### Layout Antes (compacto)

```
┌────────────────────────────┐  ┌────────────────────────────┐
│ [Avatar] Email Kyle  ⏰24h │  │ [Avatar] Call/Chat 🟢Avail │
│          Get detailed...   │  │          24/7 Chat and...  │
└────────────────────────────┘  └────────────────────────────┘
```

### Layout Depois (expandido e atrativo)

```
┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│                                     │  │                                     │
│  [Avatar Grande]                    │  │  [Avatar Grande]                    │
│                                     │  │                                     │
│  ✉️ Email Kyle           ⏰ 24h    │  │  💬🎤 Call or Chat Kyle  🟢 Avail  │
│                                     │  │                                     │
│  Get a detailed, personalized       │  │  Get instant answers via chat or    │
│  response to your questions         │  │  voice - available 24/7             │
│                                     │  │                                     │
│  [→ Send Email]                     │  │  [→ Start Conversation]             │
└─────────────────────────────────────┘  └─────────────────────────────────────┘
```

## Detalhes das Mudanças

### 1. Aumentar Padding do CardContent

| Antes | Depois |
|-------|--------|
| `p-4` | `p-6` |

### 2. Aumentar Avatar

| Antes | Depois |
|-------|--------|
| `size="sm"` | `size="md"` |
| Ícone `h-3 w-3` | Ícone `h-4 w-4` |

### 3. Melhorar Tipografia

| Elemento | Antes | Depois |
|----------|-------|--------|
| Título | `font-semibold` | `text-lg font-semibold` |
| Subtítulo | `text-sm` | `text-sm` (mas com texto mais descritivo) |

### 4. Adicionar Descrição Expandida

**Email Card:**
- Antes: "Get a detailed response"
- Depois: "Get a detailed, personalized response to your questions"

**Chat/Voice Card:**
- Antes: "24/7 Chat and Voice Consultant"
- Depois: "Get instant answers via chat or voice - available 24/7"

### 5. Adicionar CTA Visual (Botão Sutil)

Adicionar um indicador de ação no final de cada card:

```tsx
<div className="flex items-center gap-1 text-amber-400 text-sm font-medium mt-2">
  <ArrowRight className="h-4 w-4" />
  <span>Send Email</span>
</div>
```

### 6. Adicionar Ícones Duplos no Card Híbrido

Para deixar claro que suporta chat E voz:

```tsx
<div className="absolute -bottom-1 -right-1 flex gap-0.5">
  <div className="p-1 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500">
    <MessageSquare className="h-3 w-3 text-black" />
  </div>
  <div className="p-1 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500">
    <Mic className="h-3 w-3 text-black" />
  </div>
</div>
```

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx` | Modificar linhas 739-790 |

## Código Final Proposto

```tsx
{/* Kyle Contact Buttons - 2 cards grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Email Kyle Card */}
  <Card 
    onClick={() => setEmailDialogOpen(true)}
    className="cursor-pointer glass-card border-border/30 hover:border-amber-500/30 transition-all duration-300 hover-lift group"
  >
    <CardContent className="p-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <KyleAvatar size="md" isActive={true} />
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg border-2 border-background">
            <Mail className="h-4 w-4 text-black" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-lg font-semibold text-foreground">Email Kyle</p>
            <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
              <Clock className="h-3 w-3" />
              24h reply
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Get a detailed, personalized response to your questions
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
        <ArrowRight className="h-4 w-4" />
        <span>Send Email</span>
      </div>
    </CardContent>
  </Card>

  {/* Call or Chat Kyle Card (hybrid) */}
  <Card 
    onClick={() => setKyleChatDialogOpen(true)}
    className="cursor-pointer glass-card border-border/30 hover:border-amber-500/30 transition-all duration-300 hover-lift group"
  >
    <CardContent className="p-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <KyleAvatar size="md" isActive={true} />
          <div className="absolute -bottom-1 -right-1 flex">
            <div className="p-1.5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg border-2 border-background -mr-1">
              <MessageSquare className="h-3.5 w-3.5 text-black" />
            </div>
            <div className="p-1.5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg border-2 border-background">
              <Mic className="h-3.5 w-3.5 text-black" />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-lg font-semibold text-foreground">Call or Chat Kyle</p>
            <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Available
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Get instant answers via chat or voice - available 24/7
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
        <ArrowRight className="h-4 w-4" />
        <span>Start Conversation</span>
      </div>
    </CardContent>
  </Card>
</div>
```

## Imports Necessários

Adicionar `Mic` e `ArrowRight` aos imports do Lucide:

```tsx
import { ..., Mic, ArrowRight } from "lucide-react";
```

## Resultado Visual

Cards mais espaçosos com:
- Avatar maior (md ao invés de sm)
- Título maior (text-lg)
- Descrição mais completa
- CTA claro com seta animada no hover
- Ícones duplos (chat + mic) no card híbrido
