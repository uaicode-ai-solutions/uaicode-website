

# Remover botão Email do Kyle

## Alteração

**Arquivo:** `src/components/planningmysaas/dashboard/sections/MeetKyleSection.tsx`

- Remover o botão "Email" e o state/dialog associado (`emailDialogOpen`, `EmailKyleDialog`)
- Remover o import do `Mail` (lucide-react) e do `EmailKyleDialog`
- Manter apenas os botões "Chat" e "Call"

Ficarão apenas 2 botões: Chat (outline) e Call (gold gradient).

