

# Plano: Remover Banner "127 founders chose this bundle"

## Alteração

**Arquivo:** `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx`

**Ação:** Remover o bloco de Social Proof (linhas 499-521) do card "Complete Launch Bundle"

## Código a Remover

```typescript
{/* Social Proof */}
<div className="mb-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
  <div className="flex flex-col items-center gap-3">
    <div className="flex -space-x-3">
      {[sarahJohnsonImg, marcusChenImg, emmaThompsonImg, johnSmithImg, mariaSantosImg].map((img, i) => (
        <img 
          key={i} 
          src={img} 
          alt="Founder" 
          className="w-8 h-8 rounded-full border-2 border-card object-cover"
        />
      ))}
    </div>
    <div className="text-center">
      <p className="text-sm font-semibold text-foreground">
        <span className="text-yellow-400">127 founders</span> chose this bundle
      </p>
      <p className="text-[10px] text-muted-foreground mt-1">
        Last month • Average rating: ⭐ 4.9/5
      </p>
    </div>
  </div>
</div>
```

## Impacto

- **Linhas removidas:** ~22 linhas
- **Cálculos:** Nenhum impacto (o bloco é puramente visual)
- **Layout:** O botão CTA ficará mais próximo da lista de bonuses

