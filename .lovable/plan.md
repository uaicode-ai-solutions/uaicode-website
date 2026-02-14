

## Corrigir: reverter subject e alterar apenas o remetente

Duas alteracoes no arquivo `supabase/functions/pms-send-newsletter-broadcast/index.ts`:

1. **Linha 192** - Reverter o subject para o original:
   - De: `` `📰 Uaicode Daily Insights: ${post.title}` ``
   - Para: `` `📰 ${post.title}` ``

2. **Linha 193** - Alterar o remetente (from):
   - De: `Uaicode Insights <noreply@uaicode.ai>`
   - Para: `Uaicode Daily Insights <noreply@uaicode.ai>`

Apos as alteracoes, a funcao sera deployada e disparada novamente para verificacao.

