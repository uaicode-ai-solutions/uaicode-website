

# Reordenação das Seções + Nova Seção "Contact Us"

## Resumo

Aplicar duas mudanças:
1. **Reordenar as seções** conforme a sequência solicitada
2. **Criar nova seção "ContactUs"** com os cards "Get in Touch" e "Start Your Project Today" que foram removidos do Schedule

---

## Nova Ordem das Seções

| # | Seção | Título Display | Background |
|---|-------|----------------|------------|
| 1 | Hero | Got a SaaS Idea? | bg-black |
| 2 | Challenges | The Biggest Mistake? Building Without Validating | bg-card/30 |
| 3 | HowItWorks | Your Journey to Launch: Validate First, Build Smart | bg-black |
| 4 | Deliveries | What Makes Us Different | bg-card/30 |
| 5 | SuccessCases | Validated Ideas, Real Results | bg-black |
| 6 | PMSShowcase | See What Your Validation Report Reveals | bg-card/30 |
| 7 | About | Why Choose Uaicode? | bg-black |
| 8 | Tools | Powered by | bg-card/30 |
| 9 | PricingTransparency | Transparent Solutions for Every Vision | bg-black |
| 10 | FAQ | Got Questions? We Have Answers | bg-card/30 |
| 11 | MeetEve | Meet Eve | bg-black |
| 12 | **ContactUs (NOVA)** | Get in Touch / Start Your Project Today | **bg-card/30** |
| 13 | MeetTheFounder | Meet the Founder | bg-black |

---

## Nova Seção: ContactUs.tsx

### Conteúdo

Extrair do `Schedule.tsx` os dois cards:

**Card 1 - Get in Touch (lado esquerdo):**
- Título: "Get in Touch"
- Descrição: "Schedule a free consultation to discuss your project..."
- Contatos: Email, Phone, Location
- Lista "What to Expect"

**Card 2 - Start Your Project Today (lado direito):**
- Formulário completo com:
  - Name, Email, Phone, Project Description
  - Botão "Get a Free Consultation"
  - Links para Privacy e Terms

### Layout Visual

```text
┌─────────────────────────────────────────────────────────────────┐
│                      bg-card/30 (alternado)                      │
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │     Get in Touch        │  │   Start Your Project Today   │  │
│  │                         │  │                             │  │
│  │  📧 Email Us            │  │  [Name]                     │  │
│  │  📞 Call Us             │  │  [Email]                    │  │
│  │  📍 Location            │  │  [Phone]                    │  │
│  │                         │  │  [Project Description]      │  │
│  │  What to Expect:        │  │                             │  │
│  │  • Response 24h         │  │  [Get a Free Consultation]  │  │
│  │  • Free 45-min          │  │                             │  │
│  │  • No obligation        │  │                             │  │
│  └─────────────────────────┘  └─────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detalhes Técnicos

### 1. Criar: `src/components/ContactUs.tsx`

```tsx
// Novo componente baseado nos cards do Schedule.tsx
// - Importa: useForm, zodResolver, PhoneInput, Mail, Phone, MapPin
// - Mantém a validação Zod existente
// - Background: bg-card/30 (para alternar corretamente)
// - Sem o calendário Cal.com (foi removido da homepage)
// - Mantém PhoneCallDialog e EmailContactDialog para interatividade
```

### 2. Atualizar: `src/pages/Index.tsx`

```tsx
import ContactUs from "@/components/ContactUs";

// Nova ordem:
<Hero />
<Challenges />
<HowItWorks />
<Deliveries />
<SuccessCases />
<PMSShowcase />
<About />
<Tools />
<PricingTransparency />
<FAQ />
<MeetEve />
<ContactUs />        // NOVA SEÇÃO
<MeetTheFounder />
```

---

## Verificação de Alternância de Backgrounds

| Seção | Background | Correto? |
|-------|------------|----------|
| MeetEve | bg-black | ✓ |
| **ContactUs** | **bg-card/30** | ✓ (alterna) |
| MeetTheFounder | bg-black | ✓ (alterna) |

---

## Arquivos Afetados

| Arquivo | Ação |
|---------|------|
| `src/components/ContactUs.tsx` | **CRIAR** - Nova seção com os 2 cards |
| `src/pages/Index.tsx` | **EDITAR** - Reordenar seções + adicionar ContactUs |

