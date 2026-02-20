

# Corrigir Branding do Email "Password Changed" para Hero Ecosystem

## Problema

O email de confirmacao de troca de senha esta com branding "PlanningMySaaS by UaiCode" no header e no subject. Precisa ser "UaiCode Hero Ecosystem".

## Onde esta o problema

O template esta hardcoded na edge function `supabase/functions/pms-send-password-changed/index.ts`:
- **Linha 31**: Header diz `PlanningMySaaS` — alterar para `UaiCode <span style="color:#FACC15;">Hero</span>Ecosystem`
- **Linha 32**: Subtitulo diz `by UaiCode` — remover
- **Linha 117**: Campo `from` diz `PlanningMySaaS <noreply@uaicode.ai>` — alterar para `Hero Ecosystem <noreply@uaicode.ai>`
- **Linha 119**: Subject diz `Your Password Was Successfully Changed` — alterar para `Your Password Was Successfully Changed - Hero Ecosystem`

## Alteracoes

| Arquivo | O que muda |
|---|---|
| `supabase/functions/pms-send-password-changed/index.ts` | Header: "UaiCode HeroEcosystem", remover subtitulo "by UaiCode", from: "Hero Ecosystem", subject atualizado |

Nenhum outro arquivo precisa ser alterado. A edge function sera deployada automaticamente apos a edicao.

