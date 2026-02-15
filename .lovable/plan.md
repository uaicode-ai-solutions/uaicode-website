

## Criar Tabelas e Bucket no Supabase para o Pipeline de Instagram

### O que sera criado

**1. Tabela `tb_media_trends` (Inventario de Trends)**
- Armazena trends detectadas pelo Workflow 1 (Detector de Trends)
- Campos: titulo, URL fonte, pilar (strategy/development/marketing), sugestao de hook, status (pending/used/discarded)
- RLS: somente admins podem ler, inserir, atualizar e deletar (os workflows n8n usam service_role_key)

**2. Tabela `tb_media_content` (Fila de Publicacao)**
- Armazena conteudo gerado pelo Workflow 2 (Gerador de Conteudo)
- FK para `tb_media_trends` (vincula conteudo a trend de origem)
- Campos: caption, asset_url, tipo (carousel/reel/single_image), pilar, data agendada, status (generating/ready/published/failed), instagram_media_id
- RLS: somente admins

**3. Bucket `media-instagram-content` (Storage)**
- Bucket publico para hospedar imagens e videos gerados por IA
- Necessario ser publico para que a Instagram Graph API consiga acessar as URLs
- RLS: admins podem fazer upload e deletar; leitura publica

### SQL da Migration

```sql
-- Tabela tb_media_trends
CREATE TABLE public.tb_media_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  source_url text,
  pillar text NOT NULL CHECK (pillar IN ('strategy', 'development', 'marketing')),
  hook_suggestion text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'discarded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tb_media_trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can select trends"
  ON public.tb_media_trends FOR SELECT
  USING (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Admins can insert trends"
  ON public.tb_media_trends FOR INSERT
  WITH CHECK (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Admins can update trends"
  ON public.tb_media_trends FOR UPDATE
  USING (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Admins can delete trends"
  ON public.tb_media_trends FOR DELETE
  USING (has_role(get_pms_user_id(), 'admin'::app_role));

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_tb_media_trends_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_tb_media_trends_updated_at
  BEFORE UPDATE ON public.tb_media_trends
  FOR EACH ROW EXECUTE FUNCTION public.update_tb_media_trends_updated_at();

-- Tabela tb_media_content
CREATE TABLE public.tb_media_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id uuid REFERENCES public.tb_media_trends(id) ON DELETE SET NULL,
  caption text,
  asset_url text,
  content_type text NOT NULL DEFAULT 'single_image'
    CHECK (content_type IN ('carousel', 'reel', 'single_image')),
  pillar text NOT NULL CHECK (pillar IN ('strategy', 'development', 'marketing')),
  scheduled_for timestamptz,
  status text NOT NULL DEFAULT 'generating'
    CHECK (status IN ('generating', 'ready', 'published', 'failed')),
  instagram_media_id text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tb_media_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can select content"
  ON public.tb_media_content FOR SELECT
  USING (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Admins can insert content"
  ON public.tb_media_content FOR INSERT
  WITH CHECK (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Admins can update content"
  ON public.tb_media_content FOR UPDATE
  USING (has_role(get_pms_user_id(), 'admin'::app_role));

CREATE POLICY "Admins can delete content"
  ON public.tb_media_content FOR DELETE
  USING (has_role(get_pms_user_id(), 'admin'::app_role));

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_tb_media_content_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_tb_media_content_updated_at
  BEFORE UPDATE ON public.tb_media_content
  FOR EACH ROW EXECUTE FUNCTION public.update_tb_media_content_updated_at();

-- Bucket de Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('media-instagram-content', 'media-instagram-content', true);

-- Politica: leitura publica
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media-instagram-content');

-- Politica: admins podem fazer upload
CREATE POLICY "Admins can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media-instagram-content');

-- Politica: admins podem deletar
CREATE POLICY "Admins can delete media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media-instagram-content');
```

### Apos a migration

Nenhuma alteracao de codigo no frontend e necessaria nesta etapa -- essas tabelas serao consumidas exclusivamente pelos workflows n8n via `service_role_key`.

