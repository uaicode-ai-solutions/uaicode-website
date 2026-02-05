

# Ajustes de UI e Responsividade da Homepage

## Resumo das Alteracoes

1. Remover "Always here to help" da secao Eve
2. Alterar botao do header de "Get MVP Pricing" para "Validate My Idea"
3. Ancorar menu "Investment" na secao "Transparent Solutions for Every Vision" (id="pricing")
4. Remover menu "Solutions" do header
5. Remover retangulos duplos da Hero (wrapper do YouTubeEmbed)
6. Reduzir texto dos botoes para melhor responsividade mobile
7. Ajustar elementos para serem responsivos em todos os modos

---

## Detalhes Tecnicos

### 1. MeetEve.tsx - Remover tagline

**Linhas 85-89** - Remover bloco completo:
```tsx
// REMOVER:
<div className="flex items-center gap-2 text-accent">
  <Sparkles className="h-5 w-5" />
  <span className="text-lg font-medium">Always here to help</span>
</div>
```

---

### 2. Header.tsx - Alterar botao e remover menu

**Linha 89-91** - Trocar texto do botao:
```tsx
// De:
<Calculator className="w-4 h-4 mr-2" />Get MVP Pricing

// Para:
<Sparkles className="w-4 h-4 mr-2" />Validate My Idea
```

**Linha 61** - Atualizar ancora do menu Investment:
```tsx
// De:
scrollToSection("investment")

// Para:
scrollToSection("pricing")
```

**Linha 62** - Remover menu Solutions (desktop):
```tsx
// REMOVER:
<button onClick={() => scrollToSection("pricing")} className="...">Solutions</button>
```

**Linha 104-105** - Atualizar ancora mobile e remover Solutions:
```tsx
// Linha 104: scrollToSection("investment") -> scrollToSection("pricing")
// Linha 105: REMOVER botao Solutions
```

**Linha 131** - Botao mobile:
```tsx
// De:
<Calculator className="w-4 h-4 mr-2" />Get MVP Pricing

// Para:
<Sparkles className="w-4 h-4 mr-2" />Validate My Idea
```

**Importacao** - Trocar Calculator por Sparkles:
```tsx
// De:
import { Menu, X, Calculator, Youtube, ... }

// Para:
import { Menu, X, Sparkles, Youtube, ... }
```

---

### 3. Hero.tsx - Simplificar video e botoes

**Linhas 71-81** - Remover wrapper duplo, manter apenas imagem com thumbnail:
```tsx
// De:
<div className="max-w-4xl mx-auto relative">
  <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-3xl -z-10"></div>
  <div className="border border-accent/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(234,171,8,0.15)]">
    <YouTubeEmbed ... />
  </div>
</div>

// Para:
<div className="max-w-4xl mx-auto relative">
  <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-3xl -z-10"></div>
  <YouTubeEmbed ... />
</div>
```

**Linha 36** - Encurtar texto do botao primario:
```tsx
// De:
Validate My Idea Free

// Para:
Validate Free
```

**Linha 45** - Encurtar texto do botao secundario:
```tsx
// De:
See How It Works

// Para:
How It Works
```

**Linhas 29-46** - Melhorar responsividade dos botoes:
```tsx
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
  <Button
    size="lg"
    onClick={() => navigate("/planningmysaas")}
    className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 glow-white"
  >
    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
    Validate Free
  </Button>
  <Button
    size="lg"
    variant="outline"
    onClick={() => scrollToSection("how-it-works")}
    className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 transition-all duration-300"
  >
    <Compass className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
    How It Works
  </Button>
</div>
```

---

### 4. YouTubeEmbed.tsx - Remover bordas internas duplicadas

**Linha 46** - Simplificar wrapper:
```tsx
// De:
<div className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-accent/30 hover:shadow-accent/20 transition-shadow duration-300" style={{ paddingBottom: '65%' }}>

// Para:
<div className="relative w-full rounded-2xl overflow-hidden border border-accent/20 shadow-[0_0_40px_rgba(234,171,8,0.15)] hover:shadow-accent/20 transition-shadow duration-300" style={{ paddingBottom: '56.25%' }}>
```

**Linha 45** - Remover margin vertical do container:
```tsx
// De:
<div ref={containerRef} className="my-16">

// Para:
<div ref={containerRef}>
```

---

## Arquivos Afetados

| Arquivo | Acao |
|---------|------|
| `src/components/MeetEve.tsx` | **EDITAR** - Remover tagline "Always here to help" |
| `src/components/Header.tsx` | **EDITAR** - Trocar botao, remover menu Solutions, ajustar ancora |
| `src/components/Hero.tsx` | **EDITAR** - Simplificar video wrapper, encurtar botoes |
| `src/components/blog/YouTubeEmbed.tsx` | **EDITAR** - Remover bordas duplicadas |

---

## Resultado Visual Esperado

**Header Desktop:**
```
[Logo] [uaicode.ai]    [Process] [Investment] [Jobs] [Insights]    [Social Icons] [Validate My Idea]
```

**Hero Mobile (sem quebra):**
```
+-----------------------------+
|  Got a SaaS Idea?           |
|  Validate It First          |
|                             |
| +-------------------------+ |
| |    Validate Free        | |
| +-------------------------+ |
| +-------------------------+ |
| |    How It Works         | |
| +-------------------------+ |
|                             |
|  [Trust Badges em 1 linha]  |
|                             |
|  +----------------------+   |
|  |                      |   |
|  |   [Video/Thumb]      |   |
|  |                      |   |
|  +----------------------+   |
+-----------------------------+
```

