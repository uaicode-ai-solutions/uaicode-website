
# Corrigir Tamanho do Avatar do Kyle

## Problema Identificado

Os tamanhos dos avatares estão inconsistentes entre Kyle e Eve:

| Size | KyleAvatar | EveAvatar | Diferença |
|------|------------|-----------|-----------|
| sm   | 48px (w-12 h-12) | 32px (w-8 h-8) | +16px |
| md   | 80px (w-20 h-20) | 48px (w-12 h-12) | +32px |
| lg   | **112px** (w-28 h-28) | **64px** (w-16 h-16) | **+48px** |

O avatar do Kyle no tamanho `lg` é 75% maior que o da Eve, causando o overflow vertical no dialog.

---

## Solução

Alinhar os tamanhos do `KyleAvatar` com os do `EveAvatar`:

**Arquivo**: `src/components/chat/KyleAvatar.tsx`

### Mudança (linha 24-27):

**De:**
```typescript
const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-28 h-28"
};
```

**Para:**
```typescript
const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16"
};
```

---

## Resultado

Após a correção:
- O `KyleAvatar` terá os mesmos tamanhos que o `EveAvatar`
- O `EmailKyleDialog` terá a mesma altura que o `EmailContactDialog`
- Não haverá mais barra de rolagem desnecessária
- Consistência visual entre todos os dialogs de contato
