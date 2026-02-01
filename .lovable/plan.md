
# Plano: Corrigir Animação de Áudio do Kyle Call

## Problema Identificado

A visualização de áudio no `KyleConsultantDialog` não está funcionando porque:

1. `getInputVolume` e `getOutputVolume` são arrow functions inline no hook (linhas 229-230)
2. Dentro do `requestAnimationFrame`, essas funções podem ter closures desatualizadas
3. O `isSpeaking` usado dentro do loop de animação também pode estar stale

## Solução

Usar **refs** para armazenar os valores atuais das funções de volume e do estado `isSpeaking`, garantindo que o loop de animação sempre acesse os valores mais recentes.

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/KyleConsultantDialog.tsx` | Corrigir visualização com refs |

## Mudanças Técnicas

### KyleConsultantDialog.tsx

**Adicionar refs** para armazenar valores atuais (após linha 18):
```typescript
const getInputVolumeRef = useRef(getInputVolume);
const getOutputVolumeRef = useRef(getOutputVolume);
const isSpeakingRef = useRef(isSpeaking);
```

**Adicionar useEffect** para manter refs atualizadas (após linha 42):
```typescript
useEffect(() => {
  getInputVolumeRef.current = getInputVolume;
  getOutputVolumeRef.current = getOutputVolume;
  isSpeakingRef.current = isSpeaking;
}, [getInputVolume, getOutputVolume, isSpeaking]);
```

**Corrigir useEffect de visualização** (linhas 44-81):
- Usar `getInputVolumeRef.current()` ao invés de `getInputVolume()`
- Usar `getOutputVolumeRef.current()` ao invés de `getOutputVolume()`
- Usar `isSpeakingRef.current` ao invés de `isSpeaking`
- Remover `isSpeaking`, `getInputVolume`, `getOutputVolume` das dependências
- Manter apenas `isCallActive` como dependência

**Código corrigido do useEffect:**
```typescript
useEffect(() => {
  if (!isCallActive) {
    setFrequencyBars(Array(12).fill(0.1));
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    return;
  }

  const updateVisualization = () => {
    const inputVol = getInputVolumeRef.current();
    const outputVol = getOutputVolumeRef.current();
    
    // Use output volume when speaking, input volume when listening
    const activeVolume = isSpeakingRef.current ? outputVol : inputVol;
    const baseLevel = Math.max(0.1, activeVolume);
    
    // Generate bars with some randomness based on actual volume
    setFrequencyBars(
      Array(12).fill(0).map((_, i) => {
        const variation = Math.sin(Date.now() / 100 + i) * 0.2;
        const level = baseLevel + variation;
        return Math.max(0.1, Math.min(1, level));
      })
    );

    animationFrameRef.current = requestAnimationFrame(updateVisualization);
  };

  animationFrameRef.current = requestAnimationFrame(updateVisualization);

  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
}, [isCallActive]); // Apenas isCallActive como dependência
```

## Por que isso resolve?

1. **Refs não causam re-render** - podem ser atualizadas sem afetar o ciclo de render
2. **requestAnimationFrame** acessa sempre o valor atual via `.current`
3. **Sem closures stale** - o loop de animação sempre lê os valores mais recentes
4. **Menos dependências** - useEffect só re-executa quando `isCallActive` muda

## Visualização do Fluxo

```
┌────────────────────────────────────────────────┐
│          requestAnimationFrame loop            │
│                                                │
│  getInputVolumeRef.current() → valor atual     │
│  getOutputVolumeRef.current() → valor atual    │
│  isSpeakingRef.current → true/false atual      │
│                                                │
│  ↓                                             │
│  Calcula barras baseado no volume real         │
│  ↓                                             │
│  setFrequencyBars([...])                       │
│  ↓                                             │
│  Barras animam na tela                         │
└────────────────────────────────────────────────┘
```

## O que NÃO será alterado

- Nenhuma mudança no `useKyleElevenLabs.ts`
- Nenhuma mudança no visual do componente
- Nenhuma mudança no `KyleChatDialog.tsx`
