-- Create bucket for ICP avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('icp-avatars', 'icp-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policy for public read access
CREATE POLICY "Public read access for icp avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'icp-avatars');

-- RLS policy for service role insert access
CREATE POLICY "Service role can insert icp avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'icp-avatars');

-- Add column to store ICP avatar URL
ALTER TABLE public.tb_pms_reports 
ADD COLUMN IF NOT EXISTS icp_avatar_url TEXT DEFAULT NULL;