

# Plano: Popup de Confirmação para Sugestão de Descrição

## Resumo

Quando o usuário clicar em "Improve with AI", ao invés de substituir o texto automaticamente, vamos mostrar um dialog/popup comparando o texto original com a sugestão da IA. O usuário poderá aprovar (aplicar a sugestão) ou rejeitar (manter o texto original).

## O que será implementado

### 1. Novo componente de Dialog de Comparação

Criar um dialog que mostra:
- **Lado a lado**: Texto original vs. Texto sugerido pela IA
- **Botão "Aplicar"**: Substitui o texto pelo sugerido
- **Botão "Cancelar"**: Fecha o dialog sem alterar nada
- Destaque visual para facilitar a comparação

### 2. Fluxo de Usuário

```text
[Usuário escreve descrição]
         |
         v
[Clica "Improve with AI"]
         |
         v
[Loading... aguardando resposta da IA]
         |
         v
[Dialog abre com comparação]
    |           |
    v           v
[Aplicar]   [Cancelar]
    |           |
    v           v
[Texto       [Dialog fecha,
substituído] texto original
             mantido]
```

### 3. Design do Dialog

O dialog terá:
- Título: "Sugestão de Melhoria"
- Duas caixas lado a lado (em telas grandes) ou empilhadas (mobile)
- Caixa esquerda: "Seu texto original" com fundo cinza
- Caixa direita: "Sugestão da IA" com fundo dourado/accent suave
- Rodapé com botões: "Cancelar" (outline) e "Aplicar Sugestão" (primário)

---

## Detalhes Técnicos

### Mudanças no arquivo `StepYourIdea.tsx`

1. **Adicionar novo estado** para controlar o dialog e armazenar a sugestão:
   ```typescript
   const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
   const [suggestedDescription, setSuggestedDescription] = useState("");
   ```

2. **Modificar `handleImproveDescription`** para abrir o dialog ao invés de aplicar diretamente:
   - Quando a IA retornar a sugestão, guardar em `suggestedDescription`
   - Abrir o dialog com `setShowSuggestionDialog(true)`

3. **Adicionar função `handleApplySuggestion`** para aplicar quando o usuário confirmar:
   ```typescript
   const handleApplySuggestion = () => {
     onChange("description", suggestedDescription);
     setShowSuggestionDialog(false);
     setSuggestedDescription("");
     toast.success("Descrição atualizada!");
   };
   ```

4. **Renderizar o Dialog** usando o componente AlertDialog existente:
   - Import do `AlertDialog` e componentes relacionados
   - Exibir comparação visual entre textos
   - Botões de ação no footer

### Estrutura do Dialog

```tsx
<AlertDialog open={showSuggestionDialog} onOpenChange={setShowSuggestionDialog}>
  <AlertDialogContent className="max-w-2xl">
    <AlertDialogHeader>
      <AlertDialogTitle>AI Suggestion</AlertDialogTitle>
      <AlertDialogDescription>
        Compare your original text with the AI-improved version
      </AlertDialogDescription>
    </AlertDialogHeader>
    
    <div className="grid md:grid-cols-2 gap-4">
      {/* Original */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <Label className="text-sm text-muted-foreground">Your Original</Label>
        <p className="mt-2 text-sm">{data.description}</p>
      </div>
      
      {/* Suggestion */}
      <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
        <Label className="text-sm text-accent">AI Suggestion</Label>
        <p className="mt-2 text-sm">{suggestedDescription}</p>
      </div>
    </div>
    
    <AlertDialogFooter>
      <AlertDialogCancel>Keep Original</AlertDialogCancel>
      <AlertDialogAction onClick={handleApplySuggestion}>
        Apply Suggestion
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Imports necessários

Adicionar ao início do arquivo:
```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
```

---

## Resultado Final

- O usuário mantém controle total sobre seu texto
- Pode comparar visualmente antes de decidir
- Experiência mais segura e transparente
- Design consistente com o resto da aplicação (usando AlertDialog existente)

