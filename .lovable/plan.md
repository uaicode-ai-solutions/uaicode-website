
# Plano: Sincronizar Newsletter Form do PmsFooter com Footer da Home

## Objetivo

Ajustar o formulário de newsletter no `PmsFooter.tsx` para ter as mesmas funcionalidades de segurança e UX do `Footer.tsx` da home.

---

## Diferenças Identificadas

| Feature | Footer.tsx (Home) | PmsFooter.tsx (Atual) | Ação |
|---------|-------------------|----------------------|------|
| **Rate limiting** | ✅ 3s cooldown | ❌ Não tem | Adicionar |
| **Sanitização** | ✅ `sanitizeInput()` | ❌ Manual | Corrigir |
| **Contador de caracteres** | ✅ `{n}/255` | ❌ Não tem | Adicionar |

---

## Alterações Técnicas

### Arquivo: `src/components/planningmysaas/PmsFooter.tsx`

**1. Adicionar Import**
```typescript
import { sanitizeInput } from "@/lib/inputSanitization";
```

**2. Adicionar State para Rate Limiting (linha ~29)**
```typescript
const [lastSubmitTime, setLastSubmitTime] = useState(0);
```

**3. Adicionar watch para contador de caracteres (após useForm)**
```typescript
const emailValue = watch("email");
const emailCharCount = emailValue?.length || 0;
```

Também adicionar `watch` no destructuring do useForm.

**4. Atualizar função onNewsletterSubmit**
- Adicionar verificação de rate limiting no início
- Usar `sanitizeInput()` em vez de `trim().toLowerCase()`
- Atualizar `lastSubmitTime` após sucesso

**5. Adicionar contador de caracteres no form**
```tsx
<p className="text-xs text-muted-foreground mt-1 text-left">{emailCharCount}/255 characters</p>
```

---

## Código Final da Função onNewsletterSubmit

```typescript
const onNewsletterSubmit = async (data: NewsletterFormData) => {
  // Prevent double submissions (3 second cooldown)
  const now = Date.now();
  if (now - lastSubmitTime < 3000) {
    console.log("Please wait before submitting again");
    return;
  }
  
  try {
    // Sanitize email input
    const sanitizedEmail = sanitizeInput(data.email).toLowerCase();

    // Insert into Supabase
    const { error: dbError } = await supabase
      .from('tb_web_newsletter')
      .insert({ 
        email: sanitizedEmail, 
        source: 'pms_footer'
      });

    // Handle duplicate email
    if (dbError?.code === '23505') {
      console.log("Email already subscribed");
      return;
    }

    if (dbError) throw dbError;
    
    // Send welcome email (best-effort)
    supabase.functions.invoke('send-newsletter-welcome', {
      body: { email: sanitizedEmail, source: 'pms_footer' }
    }).catch(err => console.error('Welcome email error:', err));

    // Call webhook
    fetch(
      "https://uaicode-n8n.ax5vln.easypanel.host/webhook/a95bfd22-a4e0-48b2-b88d-bec4bfe84be4",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sanitizedEmail,
          timestamp: new Date().toISOString(),
          source: "pms_footer",
        }),
      }
    ).catch(err => console.error('Webhook error:', err));

    // Show success dialog
    reset();
    setLastSubmitTime(now);
    setShowSuccessDialog(true);
  } catch (error) {
    console.error("Newsletter subscription error:", error);
  }
};
```

---

## Código Final do Form

```tsx
<form onSubmit={handleSubmit(onNewsletterSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
  <div className="flex-1">
    <Input
      type="email"
      {...register("email")}
      placeholder="your.email@company.com"
      className="w-full bg-background/50 border-white/20 text-foreground placeholder:text-muted-foreground focus:border-accent/50"
      disabled={isSubmitting}
      maxLength={255}
    />
    <p className="text-xs text-muted-foreground mt-1 text-left">{emailCharCount}/255 characters</p>
    {errors.email && (
      <p className="text-red-500 text-xs mt-1 text-left">{errors.email.message}</p>
    )}
  </div>
  <Button 
    type="submit"
    disabled={isSubmitting}
    className="bg-gradient-to-r from-[hsl(45,100%,55%)] to-[hsl(38,100%,50%)] hover:from-[hsl(45,100%,50%)] hover:to-[hsl(38,100%,45%)] text-background font-bold px-6 whitespace-nowrap"
  >
    {isSubmitting ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : (
      "Subscribe"
    )}
  </Button>
</form>
```

---

## Resumo das Alterações

| Linha | Alteração |
|-------|-----------|
| 9 | Adicionar import `sanitizeInput` |
| 29 | Adicionar state `lastSubmitTime` |
| 37 | Adicionar `watch` no destructuring |
| 40-41 | Adicionar `emailValue` e `emailCharCount` |
| 42-86 | Atualizar `onNewsletterSubmit` com rate limiting e sanitização |
| 119-122 | Adicionar contador de caracteres após Input |

---

## Impacto

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Rate Limiting** | ❌ Vulnerável a spam | ✅ 3s cooldown |
| **Sanitização** | ⚠️ Básica | ✅ Completa com `sanitizeInput()` |
| **UX** | ❌ Sem feedback de limite | ✅ Contador visível |
| **Consistência** | ❌ Diferente da home | ✅ Idêntico à home |
