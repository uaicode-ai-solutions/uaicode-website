

# Plano: Layout Responsivo de 2 Colunas para Steps da Tela de Loading

## Problema Atual

A lista de 10 steps está em uma única coluna com `max-h-[400px] overflow-y-auto`, criando barra de rolagem desnecessária conforme mostrado na imagem.

## Solução

Reorganizar os 10 steps em:
- **Desktop**: 2 colunas lado a lado (5 itens cada)
- **Mobile**: 1 coluna única, mas com itens mais compactos para evitar scroll

---

## Arquivo a Modificar

`src/components/planningmysaas/skeletons/GeneratingReportSkeleton.tsx`

---

## Mudanças Específicas

### 1. Aumentar largura máxima do container

```typescript
// Linha 65: Mudar de max-w-lg para max-w-2xl
<div className="max-w-2xl w-full mx-auto text-center space-y-6 px-4">
```

### 2. Remover scroll e aplicar grid de 2 colunas

```typescript
// Linha 94: Substituir div de steps
<div className="text-left bg-card/50 rounded-xl p-4 md:p-6 border border-border/50">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
    {steps.map((step) => {
      // ... existing step rendering logic
    })}
  </div>
</div>
```

### 3. Compactar itens no mobile

Reduzir padding e gaps no mobile para caber todos os 10 itens sem scroll:

```typescript
// Cada item de step:
<div
  key={step.id}
  className={`flex items-center gap-2 md:gap-3 py-1 md:py-0 transition-all duration-300 ${...}`}
>
  {/* Ícone menor no mobile */}
  <div className={`w-6 h-6 md:w-8 md:h-8 shrink-0 rounded-full flex items-center justify-center ...`}>
    {/* Ícones menores no mobile */}
    <Icon className="w-3 h-3 md:w-4 md:h-4" />
  </div>
  
  {/* Texto mais compacto */}
  <span className="text-xs md:text-sm font-medium truncate flex-1">{step.label}</span>
  
  {/* Status badges mais compactos */}
  {isActive && (
    <span className="shrink-0 text-[10px] md:text-xs text-accent animate-pulse">
      In progress...
    </span>
  )}
</div>
```

---

## Layout Final

### Desktop (md+)
```text
┌─────────────────────────────────────────────┐
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │ 1. Investment    │ │ 6. Pricing       │  │
│  │ 2. Benchmarks    │ │ 7. Paid media    │  │
│  │ 3. Competitors   │ │ 8. Growth        │  │
│  │ 4. Opportunity   │ │ 9. Summary       │  │
│  │ 5. Customer ICP  │ │ 10. Final score  │  │
│  └──────────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────┘
```

### Mobile
```text
┌───────────────────────┐
│ 1. Investment    ✓    │
│ 2. Benchmarks    ✓    │
│ 3. Competitors   ...  │
│ 4. Opportunity        │
│ 5. Customer ICP       │
│ 6. Pricing            │
│ 7. Paid media         │
│ 8. Growth             │
│ 9. Summary            │
│ 10. Final score       │
└───────────────────────┘
```

---

## Código Completo do Bloco de Steps

```typescript
{/* Steps - 2 columns on desktop, 1 column on mobile */}
<div className="text-left bg-card/50 rounded-xl p-4 md:p-6 border border-border/50">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-3">
    {steps.map((step) => {
      const Icon = step.icon;
      const isFailed = step.id === failedStep;
      const isActive = !isFailed && step.id === currentStep + 1;
      const isComplete = !isFailed && step.id <= currentStep;

      return (
        <div
          key={step.id}
          className={`flex items-center gap-2 md:gap-3 transition-all duration-300 ${
            isFailed ? "text-destructive" : isActive ? "text-accent" : isComplete ? "text-muted-foreground" : "text-muted-foreground/50"
          }`}
        >
          <div className={`w-6 h-6 md:w-8 md:h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
            isFailed
              ? "bg-destructive/20 border-2 border-destructive"
              : isActive 
                ? "bg-accent/20 border-2 border-accent" 
                : isComplete 
                  ? "bg-accent/10 border border-accent/50" 
                  : "bg-muted/30 border border-border/50"
          }`}>
            {isFailed ? (
              <XCircle className="w-3 h-3 md:w-4 md:h-4" />
            ) : isActive ? (
              <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
            ) : isComplete ? (
              <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
            ) : (
              <Icon className="w-3 h-3 md:w-4 md:h-4" />
            )}
          </div>
          <span className={`text-xs md:text-sm font-medium truncate flex-1 ${isFailed ? "text-destructive" : isActive ? "text-foreground" : ""}`}>
            {step.label}
          </span>
          {isFailed && (
            <span className="shrink-0 ml-auto text-[10px] md:text-xs text-destructive font-medium">
              Failed
            </span>
          )}
          {isActive && (
            <span className="shrink-0 ml-auto text-[10px] md:text-xs text-accent animate-pulse">
              In progress...
            </span>
          )}
          {isComplete && (
            <span className="shrink-0 ml-auto text-[10px] md:text-xs text-muted-foreground">
              ✓
            </span>
          )}
        </div>
      );
    })}
  </div>
</div>
```

---

## Resumo das Alterações

| Linha | Mudança |
|-------|---------|
| 65 | `max-w-lg` → `max-w-2xl`, `space-y-8` → `space-y-6` |
| 94 | Remover `max-h-[400px] overflow-y-auto`, adicionar padding responsivo |
| 94+ | Adicionar wrapper `grid grid-cols-1 md:grid-cols-2` |
| 102-145 | Tamanhos responsivos para ícones e textos |

