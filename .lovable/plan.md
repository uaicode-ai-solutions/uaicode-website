
# Corrigir Formulário "Start Your Project Today" - Usar Edge Function Correta

## Problema Identificado

O formulário em `ContactUs.tsx` está chamando a edge function **errada**:

| Atual (Quebrado) | Correto (Funciona) |
|------------------|-------------------|
| `submit-contact-form` | `send-email-contact` |
| Chama webhook n8n externo | Usa Resend API diretamente |
| Campo: `project` | Campo esperado: `message` |

## Interface da Edge Function `send-email-contact`

```typescript
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;    // <-- O formulário envia "project", precisa mapear
  source?: string;    // <-- Precisamos adicionar
}
```

## Correções Necessárias

### Arquivo: `src/components/ContactUs.tsx`

**1. Mudar a edge function chamada (linha 75):**

```tsx
// De:
await supabase.functions.invoke('submit-contact-form', {
  body: sanitizedData,
});

// Para:
await supabase.functions.invoke('send-email-contact', {
  body: {
    name: sanitizedData.name,
    email: sanitizedData.email,
    phone: sanitizedData.phone || '',
    message: sanitizedData.project,  // Mapeia "project" para "message"
    source: 'website_uaicode',       // Identifica a origem
  },
});
```

**2. Adicionar BookingConfirmationDialog (popup de confirmação):**

```tsx
// Adicionar imports:
import BookingConfirmationDialog from "@/components/scheduler/BookingConfirmationDialog";

// Adicionar interface e estados:
interface BookingDetails {
  date?: string;
  time?: string;
  rawDate?: string;
  rawTime?: string;
  email?: string;
}

const [showConfirmation, setShowConfirmation] = useState(false);
const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
```

**3. Atualizar lógica de sucesso no onSubmit:**

```tsx
// De:
toast.success("Message sent! We'll get back to you within 24 hours.");
reset();

// Para:
setBookingDetails({ email: data.email });
setShowConfirmation(true);
reset();
```

**4. Adicionar o componente no JSX:**

```tsx
<BookingConfirmationDialog
  open={showConfirmation}
  onClose={() => setShowConfirmation(false)}
  bookingDetails={bookingDetails}
/>
```

## Resumo das Mudanças

| Item | Antes | Depois |
|------|-------|--------|
| Edge Function | `submit-contact-form` | `send-email-contact` |
| Mapeamento de campos | Direto | `project` → `message` |
| Source identificado | Não | `website_uaicode` |
| Popup de confirmação | Toast simples | `BookingConfirmationDialog` + confetti |

## Resultado Esperado

1. Usuário preenche e envia o formulário
2. Edge function `send-email-contact` é chamada
3. Resend envia email de confirmação para o usuário
4. Resend envia notificação para `hello@uaicode.ai`
5. Popup de confirmação aparece com confetti
6. Formulário é resetado

## Arquivo Afetado

| Arquivo | Ação |
|---------|------|
| `src/components/ContactUs.tsx` | **EDITAR** - Trocar edge function + adicionar popup |
