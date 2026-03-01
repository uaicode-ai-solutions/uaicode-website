

## Adicionar campo `ideal_market_size` na tb_pms_lp_wizard

### 1. Migration SQL

Adicionar a coluna `ideal_market_size` (text, nullable, default NULL):

```sql
ALTER TABLE public.tb_pms_lp_wizard
  ADD COLUMN ideal_market_size text;
```

### 2. Prompts atualizados para o n8n

**System Prompt:**

```text
You are an elite SaaS strategist specializing in market segmentation, audience profiling, and business model design.

CRITICAL RULES:

1. Analyze the SaaS based on its description, industry, type, geographic region, and country.
2. Output ONLY valid JSON with exactly 4 keys: ideal_target_customers, ideal_target_audience, ideal_business_model, ideal_market_size.
3. No markdown, no explanations, no code blocks — just the raw JSON object.
4. Each field must contain EXACTLY ONE value from the allowed options below. Never return multiple values, arrays, or comma-separated lists.

FIELD RULES:

- ideal_target_customers: Return EXACTLY one of: "companies", "individual", "government", "nonprofit".
- ideal_target_audience: Return EXACTLY one of: "male", "female", "any".
- ideal_business_model: Return EXACTLY one of: "b2b", "b2c".
- ideal_market_size: Return EXACTLY one of: "regional", "national", "global". Pick based on the SaaS description, geographic region, and country.

EXAMPLE OUTPUT:

{"ideal_target_customers":"companies","ideal_target_audience":"any","ideal_business_model":"b2b","ideal_market_size":"global"}
```

**User Prompt:**

```text
Analyze this SaaS and generate enrichment data:

SAAS NAME: {{ $json.saas_name }}
SAAS TYPE: {{ $json.saas_type || $json.saas_type_other || "not specified" }}
INDUSTRY: {{ $json.industry || $json.industry_other || "not specified" }}
DESCRIPTION: {{ $json.description }}
TARGET REGION: {{ $json.geographic_region || $json.geographic_region_other || "not specified" }}
COUNTRY: {{ $json.country || "not specified" }}

Respond with ONLY a JSON object:

{"ideal_target_customers": "one of: companies, individual, government, nonprofit", "ideal_target_audience": "one of: male, female, any", "ideal_business_model": "one of: b2b, b2c", "ideal_market_size": "one of: regional, national, global"}
```

### 3. Parse atualizado (n8n Code node)

```javascript
const raw = $input.first().json.content[0].text;
const parsed = JSON.parse(raw);

return {
  ideal_target_customers: parsed.ideal_target_customers,
  ideal_target_audience: parsed.ideal_target_audience,
  ideal_business_model: parsed.ideal_business_model,
  ideal_market_size: parsed.ideal_market_size
};
```

### 4. Supabase Update node

Adicionar o mapeamento do novo campo `ideal_market_size` apontando para `{{ $json.ideal_market_size }}`.

### Resumo das alteracoes no codigo

- Uma migration SQL para adicionar a coluna
- O arquivo `src/integrations/supabase/types.ts` sera atualizado automaticamente
- Nenhuma outra alteracao de codigo no projeto

