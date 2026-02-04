
# Redesign da Seção "Still have questions?" + Frase de Entrada da Eve

## Frase de Entrada Sugerida para Eve (ElevenLabs)

**Inglês - Frase de entrada:**
> "Hey! I'm Eve, your AI assistant at PlanningMySaaS. I'm here to help you validate your SaaS idea or answer any questions about our platform. What brings you here today?"

**Alternativas mais curtas (para voice mode):**
- "Hi there! I'm Eve from PlanningMySaaS. How can I help you today?"
- "Hey! Eve here. Ready to help you validate your next big idea. What's on your mind?"

---

## Problema Visual Atual

A seção atual tem 3 cards repetitivos com o avatar da Eve em cada um, criando redundância visual. O layout está desconectado do estilo elegante da landing page.

---

## Solução: Design Inspirado no MeetKyleSection

Transformar os 3 cards em um **layout horizontal compacto** com uma única Eve:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     Still have questions?                                │
│              Our AI assistant Eve is here to help                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   [Eve Avatar]   "Need help? I'm Eve, your AI     [Email] [Chat] [Call] │
│                   assistant — available 24/7"                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Estrutura do Novo Design

### 1. Container Principal
- Mantém `glass-premium` com borda `border-accent/20`
- Padding interno confortável

### 2. Layout Horizontal (uma linha)
- **Avatar da Eve** (tamanho `lg`) - à esquerda
- **Texto Central**:
  - Título: "Need help? **Talk to Eve**"
  - Subtítulo: "Your AI assistant, available 24/7"
- **Botões à direita** (3 botões inline):
  - Email (outline)
  - Chat (outline)  
  - Call (gradient amber - CTA principal)

### 3. Responsividade
- **Desktop**: Layout horizontal em uma linha
- **Mobile**: Stack vertical centralizado

---

## Arquivo a Modificar

**`src/components/planningmysaas/PmsFaq.tsx`**

### Mudanças:
1. Remover os 3 cards separados (linhas 114-183)
2. Implementar layout horizontal compacto inspirado no `MeetKyleSection`
3. Usar apenas UM avatar da Eve (não repetir)
4. Botões inline com estilo consistente

---

## Código Visual Proposto

```tsx
{/* Contact CTA - Meet Eve */}
<div className="mt-16 glass-premium rounded-2xl border border-accent/20 p-6">
  <div className="flex flex-col sm:flex-row items-center gap-6">
    {/* Eve Avatar */}
    <div className="flex-shrink-0">
      <EveAvatar size="lg" />
    </div>
    
    {/* Text Content */}
    <div className="flex-1 text-center sm:text-left">
      <h3 className="text-lg font-semibold text-foreground">
        Need help? <span className="text-gradient-gold">Talk to Eve</span>
      </h3>
      <p className="text-sm text-muted-foreground">
        Your AI assistant, available 24/7
      </p>
    </div>
    
    {/* Action Buttons */}
    <div className="flex gap-2">
      <Button onClick={() => setShowEmailDialog(true)} variant="outline" size="sm" 
        className="gap-2 border-accent/30 hover:bg-accent/10">
        <Mail className="h-4 w-4" />
        <span className="hidden sm:inline">Email</span>
      </Button>
      <Button onClick={() => setShowChatDialog(true)} variant="outline" size="sm"
        className="gap-2 border-accent/30 hover:bg-accent/10">
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Chat</span>
      </Button>
      <Button onClick={() => setShowVoiceDialog(true)} size="sm"
        className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400">
        <Phone className="h-4 w-4" />
        <span className="hidden sm:inline">Call</span>
      </Button>
    </div>
  </div>
</div>
```

---

## Comparação Visual

| Antes | Depois |
|-------|--------|
| 3 cards verticais repetitivos | 1 linha horizontal limpa |
| Eve aparece 3 vezes | Eve aparece 1 vez (destaque) |
| Texto redundante em cada card | Mensagem única e direta |
| Visual pesado e repetitivo | Visual leve e elegante |

---

## Resultado Esperado

- Design consistente com o resto da landing page
- Eve como personagem central (não repetida)
- Ações claras e acessíveis (Email, Chat, Call)
- Layout responsivo que funciona bem em mobile e desktop
- Segue o padrão visual já estabelecido no MeetKyleSection do dashboard

