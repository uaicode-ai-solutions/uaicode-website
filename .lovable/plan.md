
# Plano: Consolidar Cards do Kyle

## Objetivo

Remover o card de voz separado e manter apenas 2 cards do Kyle (Email + Chat/Voice híbrido), ajustando o layout para ficarem bem distribuídos.

## Mudanças

### 1. Alterar Grid de 3 para 2 colunas

**Antes:**
```
[Email Kyle] [Chat with Kyle] [Call Kyle]
   1/3            1/3            1/3
```

**Depois:**
```
[Email Kyle] [Call or Chat Kyle]
    1/2              1/2
```

### 2. Remover Card "Call Kyle"

Remover completamente o card que está nas linhas 792-818, pois a funcionalidade de voz já está no card híbrido.

### 3. Atualizar Card "Chat with Kyle"

| Campo | Antes | Depois |
|-------|-------|--------|
| Título | "Chat with Kyle" | "Call or Chat Kyle" |
| Subtítulo | "AI Sales Consultant" | "24/7 Chat and Voice Consultant" |
| Ícone | MessageSquare | Manter MessageSquare ou trocar para Headphones |

### 4. Remover KyleConsultantDialog (opcional)

Se o `KyleConsultantDialog` não for mais usado em nenhum outro lugar, pode ser removido. Mas vou mantê-lo por enquanto caso seja usado futuramente.

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx` | Modificar |

## Código Atual (linhas 738-818)

```tsx
{/* Kyle Contact Buttons - 3 cards grid */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  {/* Email Kyle Card */}
  ...
  {/* Chat with Kyle Card */}
  ...
  {/* Call Kyle Card */}  ← REMOVER
  ...
</div>
```

## Código Novo

```tsx
{/* Kyle Contact Buttons - 2 cards grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Email Kyle Card */}
  <Card ...>
    ...
  </Card>

  {/* Call or Chat Kyle Card (híbrido) */}
  <Card 
    onClick={() => setKyleChatDialogOpen(true)}
    className="..."
  >
    <CardContent className="p-4 flex items-center gap-4">
      <div className="relative">
        <KyleAvatar size="sm" isActive={true} />
        <div className="absolute -bottom-1 -right-1 ...">
          <MessageSquare className="h-3 w-3 text-black" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-foreground">Call or Chat Kyle</p>
          <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping ..."></span>
              <span className="relative ... bg-green-500"></span>
            </span>
            Available
          </span>
        </div>
        <p className="text-sm text-muted-foreground">24/7 Chat and Voice Consultant</p>
      </div>
    </CardContent>
  </Card>
</div>
```

## Limpeza Adicional

- Manter o `KyleConsultantDialog` no código (pode ser útil futuramente)
- O estado `kyleDialogOpen` e `setKyleDialogOpen` podem ser mantidos ou removidos

## Resultado Visual

```
┌─────────────────────────────────────────────────────────────┐
│            Have a question? Get instant answers with Kyle   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────┐   │
│  │ [Avatar] Email Kyle     │  │ [Avatar] Call or Chat   │   │
│  │          ⏰ 24h reply   │  │          Kyle  🟢 Avail │   │
│  │ Get a detailed response │  │ 24/7 Chat and Voice     │   │
│  │                         │  │ Consultant              │   │
│  └─────────────────────────┘  └─────────────────────────┘   │
│                                                              │
│         50% de espaço          50% de espaço                │
└─────────────────────────────────────────────────────────────┘
```
