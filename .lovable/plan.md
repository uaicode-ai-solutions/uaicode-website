

# Harmonização Visual da Homepage - Estilo "Meet Eve"

## Resumo Executivo
Revisar todas as seções da homepage para adotar um visual consistente e premium, inspirado no estilo da seção "Meet Eve" e "Meet the Founder". O objetivo é criar uma experiência visual harmônica com:
- Alternância de fundos escuros (`bg-black`) e semi-transparentes (`bg-card/30`)
- Uso consistente de `text-gradient-gold` para títulos
- Cards com efeito glow amber/gold
- Espaçamento e tipografia uniformes
- Imagens arredondadas com hover effects

---

## Análise do Estilo "Meet Eve" (Referência)

O estilo que queremos replicar possui:
- Fundo sólido escuro (`bg-black`)
- Container limitado a `max-w-6xl`
- Grid 2 colunas (conteúdo + imagem)
- Título com `text-gradient-gold`
- Subtítulo em `text-muted-foreground`
- Descrição em `text-base text-muted-foreground leading-relaxed`
- Botões com borda amber (`border-accent/30 hover:border-accent`)
- Imagem com `rounded-full` ou `rounded-2xl`, `shadow-2xl`, `hover-lift`
- Frase de efeito com ícone `Sparkles` em cor accent

---

## Alterações por Componente

### 1. Hero.tsx
**Arquivo:** `src/components/Hero.tsx`

**Mudanças:**
- Manter fundo atual (transparente com gradiente)
- Adicionar glow effect sutil no container do vídeo
- Melhorar badges de confiança com estilo glass-card
- Container principal com `max-w-6xl`

```text
Linha 13: Adicionar efeito glow no container
Linha 47-66: Trust badges → glass-card com border-accent/20
Linha 69: Container do vídeo → adicionar glow effect amber
```

---

### 2. Challenges.tsx
**Arquivo:** `src/components/Challenges.tsx`

**Mudanças:**
- Container com `max-w-6xl`
- Cards com hover glow effect amber
- Ícones em círculos com border accent

```text
Linha 32: py-20 → py-24 (mais respiro)
Linha 33: Adicionar max-w-6xl
Linha 47-58: Cards com hover:shadow-[0_0_30px_rgba(234,171,8,0.15)]
```

---

### 3. HowItWorks.tsx
**Arquivo:** `src/components/HowItWorks.tsx`

**Mudanças:**
- Fundo alterado para `bg-black` (contraste com seções vizinhas)
- Container com `max-w-6xl`
- Linha de conexão dos steps com cor accent mais intensa
- Cards com glow effect no hover

```text
Linha 42: className="" → className="bg-black"
Linha 43: Adicionar max-w-6xl
Linha 67: glass-card → adicionar hover:shadow-[0_0_30px_rgba(234,171,8,0.2)]
```

---

### 4. Deliveries.tsx
**Arquivo:** `src/components/Deliveries.tsx`

**Mudanças:**
- Manter `bg-card/30` para alternância
- Container com `max-w-6xl`
- Cards com glow effect amber no hover
- Overlay das imagens com gradiente mais suave

```text
Linha 43: Adicionar max-w-6xl
Linha 59: glass-card → adicionar hover:shadow-[0_0_30px_rgba(234,171,8,0.15)] hover:border-accent/30
```

---

### 5. SuccessCases.tsx
**Arquivo:** `src/components/SuccessCases.tsx`

**Mudanças:**
- Fundo alterado para `bg-black`
- Container com `max-w-6xl`
- Card de testimonial com border accent mais visível
- Avatar com border accent

```text
Linha 81: className="py-20 px-4" → className="py-24 px-4 bg-black"
Linha 82: Adicionar max-w-6xl
Linha 91: glass-card → adicionar border border-accent/20
Linha 106: Avatar border → border-2 border-accent/40
```

---

### 6. ROICalculator.tsx
**Arquivo:** `src/components/ROICalculator.tsx`

**Mudanças:**
- Manter `bg-card/30` para alternância
- Container com `max-w-6xl` (já existe max-w-6xl no chart)
- Cards com glow effect
- Sliders com estilo mais premium

```text
Linha 163: Consistir container max-w-6xl
Linha 173: glass-card → adicionar hover:shadow-[0_0_20px_rgba(234,171,8,0.1)]
Linha 300: glass-card → adicionar border border-accent/10
```

---

### 7. About.tsx
**Arquivo:** `src/components/About.tsx`

**Mudanças:**
- Fundo alterado para `bg-black` (igual ao Meet Eve/Founder)
- Container com `max-w-6xl` (já existe)
- Imagem com glow effect similar ao Meet Eve
- Texto com espaçamento similar

```text
Linha 12: className="py-20 px-4" → className="py-24 px-4 bg-black"
Linha 56-60: Imagem → adicionar wrapper com glow effect
```

---

### 8. Tools.tsx
**Arquivo:** `src/components/Tools.tsx`

**Mudanças:**
- Manter `bg-card/30`
- Cards do scroll com border accent mais visível
- Glow effect no hover

```text
Linha 24: glass-card → adicionar border border-accent/20 hover:border-accent/40
```

---

### 9. PricingTransparency.tsx
**Arquivo:** `src/components/PricingTransparency.tsx`

**Mudanças:**
- Fundo alterado para `bg-black`
- Cards com glow effect amber
- Bordas mais visíveis

```text
Linha 32: className="py-20 px-4 relative" → className="py-24 px-4 bg-black relative"
Linha 46: glass-card → adicionar border border-accent/10
Linha 201: glass-card → adicionar border border-accent/10
```

---

### 10. FAQ.tsx
**Arquivo:** `src/components/FAQ.tsx`

**Mudanças:**
- Manter `bg-card/30` para alternância
- Search input com border accent
- Accordion items com hover glow mais suave

```text
Linha 99: className="py-20 px-4 bg-card/30" → className="py-24 px-4 bg-card/30"
Linha 115: Input → adicionar border-accent/20 focus:border-accent
```

---

### 11. MeetEve.tsx
**Arquivo:** `src/components/MeetEve.tsx`

**Status:** Já no estilo correto (referência)

---

### 12. Schedule.tsx
**Arquivo:** `src/components/Schedule.tsx`

**Mudanças:**
- Fundo para `bg-black` (mais consistente)
- Cards com glow effect
- Cal.com embed com border accent

```text
Linha 178: className="py-20 px-4 bg-card/30" → className="py-24 px-4 bg-black"
Linha 189: glass-card → adicionar border border-accent/20
Linha 214: glass-card → adicionar border border-accent/10 hover:border-accent/30
Linha 294: glass-card → adicionar border border-accent/10
```

---

### 13. MeetTheFounder.tsx
**Arquivo:** `src/components/MeetTheFounder.tsx`

**Status:** Já no estilo correto (junto com Meet Eve)

---

## Padrão Visual Final

| Seção | Fundo | Container |
|-------|-------|-----------|
| Hero | gradient transparente | max-w-6xl |
| Challenges | bg-card/30 | max-w-6xl |
| HowItWorks | **bg-black** | max-w-6xl |
| Deliveries | bg-card/30 | max-w-6xl |
| SuccessCases | **bg-black** | max-w-6xl |
| ROICalculator | bg-card/30 | max-w-6xl |
| About | **bg-black** | max-w-6xl |
| Tools | bg-card/30 | max-w-6xl |
| Pricing | **bg-black** | max-w-6xl |
| FAQ | bg-card/30 | max-w-6xl |
| MeetEve | **bg-black** | max-w-6xl |
| Schedule | **bg-black** | max-w-6xl |
| MeetTheFounder | **bg-black** | max-w-6xl |

---

## Elementos Visuais Consistentes

1. **Títulos**: `text-gradient-gold` para palavras-chave
2. **Cards**: `glass-card` + `border border-accent/20` + hover glow
3. **Botões primários**: `bg-accent text-accent-foreground hover:bg-accent/90`
4. **Botões secundários**: `border-accent/30 hover:border-accent hover:bg-accent/10`
5. **Imagens**: `rounded-2xl shadow-2xl hover-lift` + glow wrapper opcional
6. **Ícones em círculos**: `bg-accent/20` com ícone `text-accent`
7. **Espaçamento**: `py-24 px-4` para seções principais

---

## Impacto

- Visual premium e consistente em toda a homepage
- Alternância harmônica entre seções escuras e semi-transparentes
- Efeitos de hover unificados com glow amber/gold
- Melhor hierarquia visual e legibilidade
- Experiência do usuário mais profissional e coesa

