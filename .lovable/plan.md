
# Plano: Botão de IA para Logo (Criar ou Melhorar)

## Resumo

Adicionar um botão de IA na seção "Upload your Logo" que muda o texto dinamicamente:
- **Sem logo**: "Create with AI"
- **Com logo**: "Improve with AI"

Nesta fase, apenas o botão será criado (sem funcionalidade real). O agente de IA será implementado posteriormente.

---

## Fluxo Visual

```text
┌─────────────────────────────────────────────────────────────┐
│  Upload your Logo (optional)                                │
│  If you don't have a logo yet, don't worry...               │
│                                                             │
│  ┌──────────┐                                               │
│  │  [IMG]   │  [Upload Logo]  [Create with AI ✨]           │
│  └──────────┘                                               │
│  PNG, JPG or SVG. Max 2MB...                                │
└─────────────────────────────────────────────────────────────┘

          ↓ (após upload)

┌─────────────────────────────────────────────────────────────┐
│  Upload your Logo (optional)                                │
│                                                             │
│  ┌──────────┐                                               │
│  │  LOGO    │ ✕  [Change Logo]  [Improve with AI ✨]        │
│  └──────────┘                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/wizard/StepYourIdea.tsx` | Modificar (adicionar botão + estado de loading) |

---

## Mudanças no Frontend

### 1. Novo Estado

Adicionar estado para controlar loading do botão de IA:

```typescript
const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
```

### 2. Nova Função Placeholder

Criar função que será implementada posteriormente:

```typescript
const handleAILogo = async () => {
  if (!isDescriptionValid) {
    toast.error("Please fill in the description first (min 20 characters)");
    return;
  }
  
  setIsGeneratingLogo(true);
  
  // TODO: Implementar chamada à Edge Function
  toast.info("AI logo generation coming soon!");
  
  setIsGeneratingLogo(false);
};
```

### 3. Adicionar Botão de IA

Inserir novo botão ao lado do botão "Upload Logo" / "Change Logo":

```tsx
{/* Upload Button */}
<div className="flex-1">
  <input type="file" ... />
  
  <div className="flex gap-2">
    {/* Existing upload button */}
    <Button
      type="button"
      variant="outline"
      onClick={() => document.getElementById('logo-upload')?.click()}
      className="border-border/50 hover:border-accent hover:bg-accent/10"
    >
      <Upload className="w-4 h-4 mr-2" />
      {data.saasLogo ? "Change Logo" : "Upload Logo"}
    </Button>
    
    {/* NEW: AI Logo Button */}
    <Button
      type="button"
      variant="outline"
      disabled={!isDescriptionValid || isGeneratingLogo}
      onClick={handleAILogo}
      className="border-accent text-accent hover:bg-accent/10 hover:text-accent
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGeneratingLogo ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          {data.saasLogo ? "Improve with AI" : "Create with AI"}
        </>
      )}
    </Button>
  </div>
  
  <p className="text-xs text-muted-foreground mt-2">
    PNG, JPG or SVG. Max 2MB. Recommended: 512×512px
  </p>
</div>
```

---

## Lógica do Texto Dinâmico

```typescript
{data.saasLogo ? "Improve with AI" : "Create with AI"}
```

- **`data.saasLogo` vazio/undefined**: Botão mostra "Create with AI"
- **`data.saasLogo` com valor (base64 ou URL)**: Botão mostra "Improve with AI"

---

## Condições do Botão

| Condição | Botão Habilitado? |
|----------|-------------------|
| Descrição < 20 chars | ❌ Desabilitado |
| Descrição >= 20 chars | ✅ Habilitado |
| Gerando logo | ❌ Desabilitado (mostra "Generating...") |

---

## Resultado Esperado

1. Usuário vê botão "Create with AI" se não fez upload de logo
2. Usuário vê botão "Improve with AI" se já fez upload de logo
3. Botão fica desabilitado se a descrição tiver menos de 20 caracteres
4. Ao clicar, mostra estado de loading "Generating..."
5. Funcionalidade real do agente será implementada na próxima etapa
