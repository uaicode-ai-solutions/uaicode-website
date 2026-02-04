
# Atualização do Header da Seção de Pricing

## Mudança Solicitada

Implementar a Opção B no header da seção de pricing:
- **Título**: "100% Free, Forever"  
- **Subtítulo**: "No credit card. No hidden fees. Just value."

## Arquivo a Modificar

**`src/components/planningmysaas/PmsPricing.tsx`** - linhas 65-70

### De:
```tsx
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
  Simple, <span className="text-gradient-gold">Transparent Pricing</span>
</h2>
<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
  No subscriptions. No hidden fees. Pay once, own forever.
</p>
```

### Para:
```tsx
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
  100% Free, <span className="text-gradient-gold">Forever</span>
</h2>
<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
  No credit card. No hidden fees. Just value.
</p>
```

## Por que a Opção B converte melhor

1. **"Forever"** — Transmite permanência e segurança
2. **"No credit card"** — Remove fricção logo no início
3. **"Just value"** — Foco no benefício, não no custo
4. **Consistência** — Alinha com o badge "100% FREE" já existente no card

## Resultado Visual

```text
┌─────────────────────────────────────────┐
│                                         │
│    100% Free, Forever                   │
│    ───────────────────                  │
│    No credit card. No hidden fees.      │
│    Just value.                          │
│                                         │
└─────────────────────────────────────────┘
```
