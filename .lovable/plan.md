
# Substituir Ícone por EveAvatar no EmailContactDialog

## Mudança Necessária

Substituir o ícone de envelope (`Mail`) pelo componente `EveAvatar` no header do dialog "Send Us a Message".

## Arquivo a Modificar

**`src/components/chat/EmailContactDialog.tsx`**

### Alterações:

1. **Adicionar import do EveAvatar** (linha 5)
   - Importar `EveAvatar from "@/components/chat/EveAvatar"`
   - Remover `Mail` do import do lucide-react (manter apenas `Sparkles, Send`)

2. **Substituir o bloco do ícone** (linhas 113-122)
   
   **De:**
   ```tsx
   <div className="flex justify-center mb-4">
     <div className="relative">
       <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full" />
       <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center">
         <Mail className="w-10 h-10 text-amber-400" />
       </div>
       <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-pulse" />
       <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
     </div>
   </div>
   ```
   
   **Para:**
   ```tsx
   <div className="flex justify-center mb-4">
     <div className="relative">
       <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full scale-110" />
       <EveAvatar size="lg" isActive={true} />
       <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-pulse" />
       <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
     </div>
   </div>
   ```

## Resultado Visual

- O avatar da Eve aparecerá no topo do formulário
- Mantém o efeito de glow amber ao redor
- Mantém as sparkles decorativas
- Cria consistência visual com os outros dialogs da Eve (Chat e Voice)
