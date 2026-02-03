

# Plano: Adicionar Linha de Valor Comparativo com InfoTooltip

## Objetivo

Adicionar a linha **"Worth $10,000+ in traditional consulting"** na seção de pricing, com um InfoTooltip que mostra as fontes de pesquisa quando o usuário passa o mouse.

---

## Localização no Card

A linha será adicionada logo abaixo do preço "Free", antes do separador:

```text
                   Free
        Start validating your idea today
        
   Worth $10,000+ in traditional consulting ⓘ
           Yours free
```

---

## Alterações Técnicas

### Arquivo: `src/components/planningmysaas/PmsPricing.tsx`

**1. Adicionar Import**
```typescript
import { InfoTooltip } from "@/components/ui/info-tooltip";
```

**2. Atualizar Seção de Preço (linhas 91-99)**

De:
```tsx
<div className="text-center mb-10 pt-4">
  <div className="flex items-baseline justify-center gap-3 mb-3">
    <span className="text-6xl md:text-7xl font-bold text-gradient-gold">
      Free
    </span>
  </div>
  <p className="text-lg text-muted-foreground">
    Start validating your idea today
  </p>
</div>
```

Para:
```tsx
<div className="text-center mb-10 pt-4">
  <div className="flex items-baseline justify-center gap-3 mb-3">
    <span className="text-6xl md:text-7xl font-bold text-gradient-gold">
      Free
    </span>
  </div>
  <p className="text-lg text-muted-foreground mb-3">
    Start validating your idea today
  </p>
  <div className="flex items-center justify-center gap-1 text-sm">
    <span className="text-muted-foreground">Worth</span>
    <span className="font-semibold text-foreground">$10,000+</span>
    <span className="text-muted-foreground">in traditional consulting</span>
    <InfoTooltip term="How we calculated this" side="bottom">
      Based on market research from professional business plan services.
      Growthink and Wise Business Plans charge $1,500-$15,000 for investor-ready plans.
      MBA-level validation packages range $15,000-$50,000+.
      Our estimate reflects the combined value of market validation, 
      financial projections, and strategic analysis.
    </InfoTooltip>
  </div>
  <p className="text-sm font-medium text-accent mt-1">
    Yours free
  </p>
</div>
```

---

## Preview Visual

```text
┌─────────────────────────────────────────────────────┐
│              [✨ 100% FREE]                         │
│                                                     │
│                   Free                              │
│        Start validating your idea today             │
│                                                     │
│   Worth $10,000+ in traditional consulting ⓘ       │
│              Yours free                             │
│                                                     │
├─────────────────────────────────────────────────────┤
```

---

## Conteúdo do Tooltip (ao passar o mouse)

```text
┌──────────────────────────────────────────┐
│ How we calculated this                   │
├──────────────────────────────────────────┤
│ Based on market research from            │
│ professional business plan services.     │
│                                          │
│ Growthink and Wise Business Plans        │
│ charge $1,500-$15,000 for investor-      │
│ ready plans. MBA-level validation        │
│ packages range $15,000-$50,000+.         │
│                                          │
│ Our estimate reflects the combined       │
│ value of market validation, financial    │
│ projections, and strategic analysis.     │
└──────────────────────────────────────────┘
```

---

## Arquivo Alterado

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/PmsPricing.tsx` | Adicionar import + linha de valor com InfoTooltip |

---

## Impacto

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Proposta de Valor** | Apenas "Free" | Free + valor comparativo $10,000+ |
| **Credibilidade** | Sem referência | Fontes no tooltip |
| **Conversão** | Boa | Melhor (percepção de valor) |

