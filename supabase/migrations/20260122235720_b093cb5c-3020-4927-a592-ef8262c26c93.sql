-- 1. Criar nova tabela com colunas na ordem lógica
CREATE TABLE tb_pms_reports_new (
  -- Metadados
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  wizard_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- 1. INVESTMENT
  section_investment JSONB DEFAULT '{}'::jsonb,
  
  -- 2. BENCHMARKS
  benchmark_section JSONB DEFAULT '{}'::jsonb,
  
  -- 3. COMPETITORS
  competitive_analysis_section JSONB DEFAULT '{}'::jsonb,
  
  -- 4. OPPORTUNITY
  opportunity_section JSONB DEFAULT '{}'::jsonb,
  
  -- 5. ICP
  icp_intelligence_section JSONB DEFAULT '{}'::jsonb,
  icp_avatar_url TEXT,
  
  -- 6. PRICE
  price_intelligence_section JSONB DEFAULT '{}'::jsonb,
  
  -- 7. PAID MEDIA
  paid_media_intelligence_section JSONB DEFAULT '{}'::jsonb,
  
  -- 8. GROWTH
  growth_intelligence_section JSONB DEFAULT '{}'::jsonb,
  
  -- 9. SUMMARY
  summary_section JSONB DEFAULT '{}'::jsonb,
  
  -- 10. HERO SCORE
  hero_score_section JSONB DEFAULT '{}'::jsonb,
  
  PRIMARY KEY (id)
);

-- 2. Copiar dados da tabela antiga
INSERT INTO tb_pms_reports_new (
  id, wizard_id, status, created_at, updated_at,
  section_investment, benchmark_section, competitive_analysis_section,
  opportunity_section, icp_intelligence_section, icp_avatar_url,
  price_intelligence_section, paid_media_intelligence_section,
  growth_intelligence_section, summary_section, hero_score_section
)
SELECT 
  id, wizard_id, status, created_at, updated_at,
  section_investment, benchmark_section, competitive_analysis_section,
  opportunity_section, icp_intelligence_section, icp_avatar_url,
  price_intelligence_section, paid_media_intelligence_section,
  growth_intelligence_section, summary_section, hero_score_section
FROM tb_pms_reports;

-- 3. Dropar tabela antiga e renomear nova
DROP TABLE tb_pms_reports;
ALTER TABLE tb_pms_reports_new RENAME TO tb_pms_reports;

-- 4. Recriar RLS policies
ALTER TABLE tb_pms_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports" ON tb_pms_reports
FOR SELECT USING (
  wizard_id IN (
    SELECT id FROM tb_pms_wizard 
    WHERE user_id IN (
      SELECT id FROM tb_pms_users WHERE auth_user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can insert own reports" ON tb_pms_reports
FOR INSERT WITH CHECK (
  wizard_id IN (
    SELECT id FROM tb_pms_wizard 
    WHERE user_id IN (
      SELECT id FROM tb_pms_users WHERE auth_user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can update own reports" ON tb_pms_reports
FOR UPDATE USING (
  wizard_id IN (
    SELECT id FROM tb_pms_wizard 
    WHERE user_id IN (
      SELECT id FROM tb_pms_users WHERE auth_user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can delete own reports" ON tb_pms_reports
FOR DELETE USING (
  wizard_id IN (
    SELECT id FROM tb_pms_wizard 
    WHERE user_id IN (
      SELECT id FROM tb_pms_users WHERE auth_user_id = auth.uid()
    )
  )
);

-- 5. Recriar trigger de updated_at
CREATE TRIGGER update_tb_pms_reports_updated_at
BEFORE UPDATE ON tb_pms_reports
FOR EACH ROW
EXECUTE FUNCTION update_tb_pms_reports_updated_at();