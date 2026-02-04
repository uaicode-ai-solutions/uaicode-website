

# Correção: Trocar Hero por Banner Compacto

## O Problema

Criei uma hero section que ocupa **70% da altura da tela** (`min-h-[70vh]`), quando você pediu um **banner** - algo compacto e elegante no topo da página.

## O Que Vou Fazer

Transformar o `SharedReportHero.tsx` em um **banner horizontal compacto** que:
- Ocupa apenas ~200px de altura (não a tela toda)
- Mantém o visual premium com gradientes e efeitos sutis
- Mostra nome do projeto, score e tagline de forma limpa
- Remove os cards de métricas (muito pesado para um banner)
- Remove o scroll indicator (desnecessário em um banner)

## Novo Design do Banner

```text
┌───────────────────────────────────────────────────────────────────────┐
│  ░░░░░ Gradient Background Sutil ░░░░░                                │
│                                                                       │
│   ┌────────┐                                                          │
│   │   68   │    NOME DO PROJETO                                       │
│   │  score │    "Tagline de viabilidade do projeto"                   │
│   └────────┘                                                          │
│                                                    🏷️ Shared Report   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Altura**: ~py-8 a py-10 (compacto, não full-screen)
**Layout**: Score à esquerda + Nome/Tagline à direita + Badge no canto

## Arquivo a Modificar

**`src/components/planningmysaas/public/SharedReportHero.tsx`**

### Mudanças Principais:

1. **Remover** `min-h-[70vh]` → usar apenas `py-8` ou `py-10`
2. **Layout horizontal** → flex row com score à esquerda e texto à direita
3. **Score ring menor** → `w-20 h-20` (80px) ao invés de `w-32 h-32`
4. **Remover** os 3 cards de métricas (pesado demais para banner)
5. **Remover** o scroll indicator (não faz sentido em banner compacto)
6. **Adicionar** o badge no canto superior direito

### Estrutura Final:

```tsx
<div className="relative py-10 rounded-xl overflow-hidden mb-8">
  {/* Background sutil */}
  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent/10" />
  
  <div className="relative z-10 flex items-center gap-6">
    {/* Score Ring Compacto */}
    <div className="w-20 h-20 flex-shrink-0">
      <ScoreRing score={68} />
    </div>
    
    {/* Texto */}
    <div className="flex-1">
      <h1 className="text-2xl md:text-3xl font-bold">Nome do Projeto</h1>
      <p className="text-accent mt-1">Tagline do veredicto</p>
    </div>
    
    {/* Badge */}
    <Badge className="absolute top-4 right-4">Shared Report</Badge>
  </div>
</div>
```

## Resultado

Um banner elegante e compacto que comunica rapidamente:
- ✅ Qual é o projeto
- ✅ O score de viabilidade
- ✅ O veredicto resumido
- ✅ Sem ocupar espaço desnecessário

