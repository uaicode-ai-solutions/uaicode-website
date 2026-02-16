

## Passo 1: Migration + Primeiro No

### Migration SQL

Expandir a constraint de status da `tb_media_trends` para permitir `processed` e `skipped`:

```sql
ALTER TABLE public.tb_media_trends
DROP CONSTRAINT IF EXISTS tb_media_trends_status_check;

ALTER TABLE public.tb_media_trends
ADD CONSTRAINT tb_media_trends_status_check
CHECK (status IN ('pending', 'processed', 'skipped'));
```

### Primeiro No: Google Gemini (gerar slides + caption)

Apos a migration, comecaremos pelo **No 1 do fluxo de geracao de carrossel** no n8n:

- **Tipo**: Google Gemini (no nativo do n8n)
- **Modelo**: gemini-2.5-flash
- **Input**: dados do trend recem-inserido (title, summary, pillar, spiced, hook_suggestion)
- **Output**: JSON estruturado com `slides` (array Hook/Content/CTA) e `caption` com hashtags

O prompt do Gemini sera configurado para:
- Gerar 6-8 slides no formato Hook - Conteudo - CTA
- Usar a paleta UaiCode Premium (fundo #000000, destaque #FFBF1A/#FF9F00)
- Retornar JSON estruturado para facilitar o processamento nos nos seguintes
- Gerar caption Instagram com hashtags relevantes

### Resultado

Apos aprovar, vou:
1. Executar a migration no Supabase
2. Detalhar a configuracao exata do no Google Gemini para voce replicar no n8n

