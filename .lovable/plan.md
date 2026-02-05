

# Sincronizar Footer com Header e Integrar Funcionalidades da Eve

## Resumo das Alterações

1. **Navigation**: Sincronizar menu com header (remover Solutions, corrigir âncora Investment)
2. **Contact**: Adicionar dialogs da Eve (Chat e Voice) aos itens existentes
3. **Validate My Idea**: Renomear seção e link para navegar à landing page

---

## Detalhes Técnicos

### 1. Seção Navigation (linhas 131-167)

**Antes:**
```tsx
<li><button onClick={() => scrollToSection("investment")}>Investment</button></li>
<li><button onClick={() => scrollToSection("pricing")}>Solutions</button></li>
```

**Depois:**
```tsx
<li><button onClick={() => scrollToSection("pricing")}>Investment</button></li>
{/* Solutions REMOVIDO */}
```

---

### 2. Seção Contact (linhas 201-233)

Adicionar estados para EveChatDialog e EveVoiceDialog, e importar os componentes.

**Importações a adicionar:**
```tsx
import EveChatDialog from "./chat/EveChatDialog";
import EveVoiceDialog from "./chat/EveVoiceDialog";
```

**Estados a adicionar:**
```tsx
const [showChatDialog, setShowChatDialog] = useState(false);
const [showVoiceDialog, setShowVoiceDialog] = useState(false);
```

**Atualizar item "Talk to Eve!":**
```tsx
// Antes:
<button onClick={() => scrollToSection("chat")}>
  <MessageCircle className="w-5 h-5" />
  Talk to Eve!
</button>

// Depois:
<button onClick={() => setShowChatDialog(true)}>
  <MessageCircle className="w-5 h-5" />
  Chat with Eve
</button>
```

**Adicionar item de chamada:**
```tsx
<li>
  <button 
    onClick={() => setShowVoiceDialog(true)}
    className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
  >
    <Phone className="w-5 h-5" />
    Call Eve
  </button>
</li>
```

**Adicionar dialogs no final (antes do PhoneCallDialog):**
```tsx
<EveChatDialog open={showChatDialog} onOpenChange={setShowChatDialog} />
<EveVoiceDialog open={showVoiceDialog} onOpenChange={setShowVoiceDialog} />
```

---

### 3. Seção "Get MVP Pricing" → "Validate My Idea" (linhas 184-198)

**Antes:**
```tsx
<h4 className="text-lg font-semibold mb-4 text-accent">Get MVP Pricing</h4>
<ul className="space-y-3">
  <li>
    <button 
      onClick={() => scrollToSection("schedule")}
      className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
    >
      <Calendar className="w-5 h-5" />
      Schedule a Free Consultation
    </button>
  </li>
</ul>
```

**Depois:**
```tsx
<h4 className="text-lg font-semibold mb-4 text-accent">Validate My Idea</h4>
<ul className="space-y-3">
  <li>
    <button 
      onClick={() => navigate("/planningmysaas")}
      className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
    >
      <Sparkles className="w-5 h-5" />
      Planning My SaaS
    </button>
  </li>
</ul>
```

**Atualizar importações:**
```tsx
// Remover Calendar se não usado em outro lugar
// Adicionar Sparkles
import { Mail, Phone, MapPin, Youtube, Facebook, Instagram, Linkedin, Twitter, MessageCircle, Building2, Sparkles } from "lucide-react";
```

---

## Arquivos Afetados

| Arquivo | Ação |
|---------|------|
| `src/components/Footer.tsx` | **EDITAR** |

---

## Resultado Esperado

### Navigation (Footer vs Header)
| Menu | Footer | Header |
|------|--------|--------|
| Process | `#how-it-works` | `#how-it-works` |
| Investment | `#pricing` | `#pricing` |
| Jobs | `/jobs` | `/jobs` |
| Insights | `/newsletter` | `/newsletter` |

### Contact
| Item | Ação |
|------|------|
| hello@uaicode.ai | Abre EmailContactDialog |
| +1 (737) 225 9254 | Abre PhoneCallDialog |
| Chat with Eve | Abre EveChatDialog |
| Call Eve | Abre EveVoiceDialog |

### Validate My Idea
| Item | Ação |
|------|------|
| Planning My SaaS | Navega para `/planningmysaas` |

