

# Unificar Visual da Seção "Meet the Founder" com "Meet Eve"

## Objetivo

Atualizar o componente `MeetTheFounder.tsx` para ter o mesmo estilo visual premium da seção "Meet Eve", incluindo a foto circular com efeito de glow amber.

---

## Diferenças Identificadas

| Elemento | MeetEve (atual) | MeetTheFounder (atual) |
|----------|-----------------|------------------------|
| Formato da foto | `rounded-full` (circular) | `rounded-2xl` (retangular) |
| Glow effect | Sim (`bg-gradient-to-r from-accent/20 to-accent/5 blur-2xl`) | Não |
| Borda da foto | `border-4 border-accent/20` | Sem borda |
| Container wrapper | `<div className="relative">` | Direto no flex |

---

## Alterações Técnicas

### 1. Copiar nova foto do founder para assets

```bash
lov-copy user-uploads://founder-rafael-luz-00.png src/assets/founder-rafael-luz-circular.webp
```

### 2. Atualizar `src/components/MeetTheFounder.tsx`

**Antes (linhas 47-55):**
```tsx
{/* Right Column - Photo */}
<div className="flex justify-center lg:justify-end">
  <img
    src={founderImage}
    alt="Rafael Luz - Founder and CEO of Uaicode.ai"
    loading="lazy"
    className="w-full h-auto max-w-md lg:max-w-lg rounded-2xl shadow-2xl hover-lift"
  />
</div>
```

**Depois:**
```tsx
{/* Right Column - Photo */}
<div className="flex justify-center lg:justify-end">
  <div className="relative">
    <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-accent/5 rounded-full blur-2xl" />
    <img
      src={founderImage}
      alt="Rafael Luz - Founder and CEO of Uaicode.ai"
      loading="lazy"
      className="relative w-full h-auto max-w-md lg:max-w-lg rounded-full shadow-2xl hover-lift border-4 border-accent/20"
    />
  </div>
</div>
```

### 3. Atualizar import da foto

```tsx
// De:
import founderImage from "@/assets/founder-rafael-luz-main.webp";

// Para (usando a nova foto):
import founderImage from "@/assets/founder-rafael-luz-circular.webp";
```

---

## Visual Final Esperado

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Meet the Founder                         │
│                   The Vision Behind Uaicode.ai                  │
│                                                                 │
│  ┌─────────────────────────┐      ┌─────────────────────────┐  │
│  │                         │      │   ╭─────────────────╮   │  │
│  │  [Texto do founder]     │      │   │   ░░░░░░░░░░░   │   │  │
│  │                         │      │   │   ░ FOTO EM ░   │   │  │
│  │                         │      │   │   ░ CIRCULAR ░  │   │  │
│  │  [Connect on LinkedIn]  │      │   │   ░  + GLOW  ░  │   │  │
│  │                         │      │   │   ░░░░░░░░░░░   │   │  │
│  │                         │      │   ╰─────────────────╯   │  │
│  └─────────────────────────┘      └─────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Arquivos Afetados

| Arquivo | Acao |
|---------|------|
| `src/assets/founder-rafael-luz-circular.webp` | **CRIAR** - Copiar nova foto do upload |
| `src/components/MeetTheFounder.tsx` | **EDITAR** - Adicionar glow effect e foto circular |

---

## Resultado

Ambas as seções (MeetEve e MeetTheFounder) terao o mesmo estilo visual premium:
- Foto circular com borda amber sutil
- Efeito de glow gradiente ao redor
- Animacao hover-lift mantida
- Consistencia visual entre as duas personas do site

