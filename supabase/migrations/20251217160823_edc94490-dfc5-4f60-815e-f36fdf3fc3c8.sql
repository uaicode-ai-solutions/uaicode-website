-- Criar bucket público para mockups
INSERT INTO storage.buckets (id, name, public) 
VALUES ('screen-mockups', 'screen-mockups', true);

-- RLS policy para permitir leitura pública
CREATE POLICY "Public read access for screen mockups" ON storage.objects
FOR SELECT USING (bucket_id = 'screen-mockups');

-- RLS policy para inserção via service role
CREATE POLICY "Service role insert access for screen mockups" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'screen-mockups');

-- Adicionar coluna para armazenar URLs das imagens geradas
ALTER TABLE wizard_submissions 
ADD COLUMN screen_mockups JSONB DEFAULT '[]';