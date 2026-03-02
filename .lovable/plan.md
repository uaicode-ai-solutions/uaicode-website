

# Remover Kyle do Cabeçalho

## Alteração

**Arquivo:** `src/components/planningmysaas/public/SharedReportHeader.tsx`

Remover do cabeçalho:
- O avatar do Kyle com o dropdown (Email, Chat, Call)
- O badge "Ask Kyle"
- Os 3 dialogs (KyleConsultantDialog, KyleChatDialog, EmailKyleDialog)
- Os states associados (kyleDialogOpen, kyleChatDialogOpen, emailKyleDialogOpen)
- Os imports do kyleAvatar, dos dialogs, e dos ícones (Mail, MessageSquare, Phone)

O cabeçalho ficará apenas com o logo + nome "PlanningMySaaS" à esquerda, sem nada à direita (ou apenas o container vazio).

