

# Plano: Ocultar DataQualityBanner em Mobile

## Objetivo

Esconder o banner de Data Quality Notice quando o usuário estiver em dispositivos móveis (telas menores que 768px). O banner continuará visível em tablet e desktop.

## Solução

Existem duas abordagens possíveis:

### Opção 1: Usar classe CSS do Tailwind (Mais Simples)
Adicionar a classe `hidden md:block` no container principal do banner.

### Opção 2: Usar o hook `useIsMobile` (Alternativa)
Importar o hook existente e retornar `null` quando for mobile.

**Recomendação:** Opção 1 é mais simples e usa apenas CSS, sem adicionar lógica JavaScript.

## Alteração

### Arquivo: `src/components/planningmysaas/dashboard/ui/DataQualityBanner.tsx`

**Linha 35-42 (container principal):**

```tsx
// Antes
<div 
  className={`
    relative rounded-xl border p-4 mb-6
    ${isCritical 
      ? 'bg-amber-500/10 border-amber-500/30' 
      : 'bg-amber-500/5 border-amber-500/20'
    }
  `}
>

// Depois
<div 
  className={`
    hidden md:block relative rounded-xl border p-4 mb-6
    ${isCritical 
      ? 'bg-amber-500/10 border-amber-500/30' 
      : 'bg-amber-500/5 border-amber-500/20'
    }
  `}
>
```

## Explicação das Classes

| Classe | Efeito |
|--------|--------|
| `hidden` | Esconde o elemento por padrão (mobile) |
| `md:block` | Mostra o elemento a partir de 768px (tablet/desktop) |

## Resultado

- **Mobile (< 768px)**: Banner não aparece
- **Tablet (≥ 768px)**: Banner aparece
- **Desktop (≥ 1024px)**: Banner aparece

