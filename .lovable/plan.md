
# Unificar Visual dos Formulários de Email (Kyle e Eve)

## Visão Geral

Alinhar os dois formulários de contato:
1. **Kyle**: Atualizar visual para o padrão premium (como a Eve)
2. **Eve**: Adicionar popup de sucesso (como o Kyle já tem)

---

## 1. Atualizar EmailKyleDialog

**Arquivo**: `src/components/planningmysaas/dashboard/EmailKyleDialog.tsx`

### Mudanças de Import
- Remover: `Mail`, `Avatar`, `AvatarImage`, `AvatarFallback`, `kyleAvatarImg`
- Adicionar: `Sparkles` do lucide-react
- Adicionar: `KyleAvatar` de `@/components/chat/KyleAvatar`
- Adicionar: `PhoneInput` de `@/components/ui/phone-input`
- Adicionar: `sanitizeFormData` de `@/lib/inputSanitization`

### Atualizar Schema de Validação
```typescript
const emailKyleSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Please enter your full name (at least 2 characters)")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'\-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),
  phone: z.string()
    .refine((val) => val.replace(/\D/g, '').length >= 10, "Phone number must be at least 10 digits"),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});
```

### Atualizar DialogContent
- Container: `sm:max-w-lg glass-card border-amber-500/20 shadow-2xl max-h-[90vh] overflow-y-auto`

### Atualizar Header/Avatar
```tsx
<div className="flex justify-center mb-4">
  <div className="relative">
    <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full scale-110" />
    <KyleAvatar size="lg" />
    <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-pulse" />
    <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
  </div>
</div>

<DialogTitle className="text-2xl font-bold text-center">
  Email <span className="text-gradient-gold">Kyle</span>
</DialogTitle>
```

### Atualizar Campos do Formulário
- Adicionar divider decorativo
- Todos os inputs: `bg-background/50 border-border/50 focus:border-amber-500/50`
- Phone: Usar `PhoneInput` com `defaultCountry="us"`
- Message: Adicionar contador de caracteres
- Labels com `*` vermelho para campos obrigatórios

### Atualizar Botão Submit
```tsx
<Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600 font-semibold py-5 shadow-lg shadow-amber-500/30">
```

### Adicionar Privacy Note
```tsx
<p className="text-xs text-muted-foreground text-center">
  By submitting, you agree to our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Service</a>.
</p>
```

### Manter Popup de Sucesso Existente
O Kyle já tem `submitSuccess` state - apenas atualizar visual para combinar com o novo estilo:
```tsx
{submitSuccess ? (
  <div className="py-8 text-center space-y-4">
    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
      <Send className="h-8 w-8 text-amber-400" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-foreground">
        Message <span className="text-gradient-gold">Sent!</span>
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        I'll be in touch soon. Check your inbox for a confirmation.
      </p>
    </div>
  </div>
) : (
  // form content
)}
```

---

## 2. Adicionar Popup de Sucesso na Eve

**Arquivo**: `src/components/chat/EmailContactDialog.tsx`

### Adicionar State
```typescript
const [submitSuccess, setSubmitSuccess] = useState(false);
```

### Atualizar onSubmit
```typescript
const onSubmit = async (data: EmailContactFormData) => {
  setIsSubmitting(true);
  try {
    // ... existing code ...
    
    setSubmitSuccess(true);
    reset();
    
    // Close dialog after showing success
    setTimeout(() => {
      setSubmitSuccess(false);
      onOpenChange(false);
    }, 2500);
  } catch (error) {
    console.error("Email contact form error:", error);
  } finally {
    setIsSubmitting(false);
  }
};
```

### Atualizar handleClose
```typescript
const handleClose = () => {
  if (!isSubmitting) {
    setSubmitSuccess(false);
    reset();
    onOpenChange(false);
  }
};
```

### Adicionar Bloco de Sucesso (antes do form)
```tsx
{submitSuccess ? (
  <div className="py-8 text-center space-y-4">
    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
      <Send className="h-8 w-8 text-amber-400" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-foreground">
        Message <span className="text-gradient-gold">Sent!</span>
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        We'll be in touch soon. Check your inbox for a confirmation.
      </p>
    </div>
  </div>
) : (
  <>
    {/* Decorative divider */}
    <div className="flex items-center gap-4 py-2">...</div>
    <form>...</form>
  </>
)}
```

---

## Resultado Final

| Aspecto | Kyle | Eve |
|---------|------|-----|
| Avatar | KyleAvatar com glow + sparkles | EveAvatar com glow + sparkles |
| Container | glass-card border-amber-500/20 | glass-card border-amber-500/20 |
| Phone | PhoneInput com country selector | PhoneInput com country selector |
| Botão | Gradient amber/yellow | Gradient amber/yellow |
| Sucesso | Popup com "Message Sent!" | Popup com "Message Sent!" |
| Privacy | Link para privacy/terms | Link para privacy/terms |

Ambos os formulários terão visual idêntico, apenas diferindo no avatar e no texto do título.
