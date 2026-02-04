

# Corrigir Altura do Formulário do Kyle

## Problema Identificado

Comparando os dois formulários, encontrei a diferença no campo de mensagem (Textarea):

| Aspecto | Kyle (atual) | Eve (correto) |
|---------|--------------|---------------|
| Textarea | `rows={4}` | Sem `rows` |
| Height classes | Nenhuma | `min-h-[100px] max-h-[150px]` |
| Resize | `resize-none` | `resize-y` |
| Max chars | 2000 | 1000 |

O `rows={4}` no Kyle cria uma altura fixa maior que o necessário.

---

## Solução

**Arquivo**: `src/components/planningmysaas/dashboard/EmailKyleDialog.tsx`

### Mudança no Textarea (linhas 251-258):

**De:**
```tsx
<Textarea
  placeholder="Tell me about your project and what you're looking for..."
  rows={4}
  {...field}
  disabled={isSubmitting}
  className="bg-background/50 border-border/50 focus:border-amber-500/50 focus:ring-amber-500/20 resize-none"
  maxLength={2000}
/>
```

**Para:**
```tsx
<Textarea
  placeholder="Tell me about your project and what you're looking for..."
  {...field}
  disabled={isSubmitting}
  className="bg-background/50 border-border/50 focus:border-amber-500/50 focus:ring-amber-500/20 min-h-[100px] max-h-[150px] resize-y"
  maxLength={1000}
/>
```

### Atualizar contador de caracteres (linhas 261-266):

**De:**
```tsx
<p className="text-xs text-muted-foreground">{messageCharCount}/2000</p>
{messageCharCount > 1800 && (
  <p className={`text-xs ${messageCharCount > 1950 ? 'text-destructive' : 'text-yellow-500'}`}>
    {messageCharCount > 1950 ? 'Limit reached' : 'Approaching limit'}
  </p>
)}
```

**Para:**
```tsx
<p className="text-xs text-muted-foreground">{messageCharCount}/1000</p>
{messageCharCount > 900 && (
  <p className={`text-xs ${messageCharCount > 980 ? 'text-destructive' : 'text-yellow-500'}`}>
    {messageCharCount > 980 ? 'Limit reached' : 'Approaching limit'}
  </p>
)}
```

### Atualizar schema de validação (linha 51):

**De:**
```tsx
.max(2000, "Message must be less than 2000 characters"),
```

**Para:**
```tsx
.max(1000, "Message must be less than 1000 characters"),
```

---

## Resultado

Após essas mudanças:
- O textarea terá altura controlada (100px-150px) igual à Eve
- Não haverá mais barra de rolagem no dialog
- Os dois formulários terão exatamente a mesma altura

