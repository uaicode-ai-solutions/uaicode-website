

# Plano: Substituir Ícone por Avatares no Banner "47 founders booked"

## Alteração

**Arquivo:** `src/components/planningmysaas/dashboard/sections/ScheduleCallSection.tsx`

**Ação:** Substituir o ícone `Users` por fotos de avatares empilhados, como estava no banner de social proof removido.

---

## Código Atual (Linhas 100-104)

```typescript
{/* Social Proof */}
<div className="flex items-center gap-2 text-sm glass-card px-4 py-2 rounded-full border border-amber-500/20">
  <Users className="h-4 w-4 text-amber-400" />
  <span className="text-foreground/80"><strong className="text-foreground">47</strong> founders booked this month</span>
</div>
```

---

## Novo Código

```typescript
{/* Social Proof */}
<div className="flex items-center gap-2 text-sm glass-card px-4 py-2 rounded-full border border-amber-500/20">
  <div className="flex -space-x-2">
    {[sarahJohnsonImg, marcusChenImg, emmaThompsonImg, johnSmithImg, mariaSantosImg].map((img, i) => (
      <img 
        key={i} 
        src={img} 
        alt="Founder" 
        className="w-6 h-6 rounded-full border-2 border-card object-cover"
      />
    ))}
  </div>
  <span className="text-foreground/80"><strong className="text-foreground">47</strong> founders booked this month</span>
</div>
```

---

## Imports Necessários

Adicionar no topo do arquivo:

```typescript
// Avatar imports
import sarahJohnsonImg from "@/assets/testimonial-sarah-johnson.webp";
import emmaThompsonImg from "@/assets/testimonial-emma-thompson.webp";
import johnSmithImg from "@/assets/testimonial-john-smith.webp";
import mariaSantosImg from "@/assets/testimonial-maria-santos.webp";
import marcusChenImg from "@/assets/author-marcus.webp";
```

E remover `Users` dos imports do lucide-react (não será mais utilizado).

---

## Impacto

- **Linhas alteradas:** ~10 linhas
- **Visual:** Avatares empilhados no lugar do ícone genérico
- **Funcionalidade:** Nenhuma alteração

