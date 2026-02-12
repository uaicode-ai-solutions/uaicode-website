
# Logo Generation: Priorizar Nome do SaaS + Market Trends

## Problema
A geração de logo atualmente recebe apenas `description`, `saasType` e `industry`. O **nome do SaaS** (que agora segue regras descritivas como "DoctorHub", "SalesRadar") não é enviado, então a IA não consegue criar um ícone que reflita visualmente o nome.

## Mudanças

### 1. Frontend - Enviar o nome do SaaS
**Arquivo**: `src/components/planningmysaas/wizard/StepYourIdea.tsx`

Adicionar `name: data.name` no body da requisição para `pms-generate-logo`, junto com os campos já existentes.

### 2. Backend - Reestruturar o prompt para priorizar o nome
**Arquivo**: `supabase/functions/pms-generate-logo/index.ts`

Alteracoes na funcao `buildAnalysisPrompt`:
- Adicionar parametro `name` na funcao
- Reestruturar o prompt para incluir uma secao `SAAS NAME` em destaque
- Adicionar instrucoes claras de que o icone deve representar visualmente o significado semantico do nome

Alteracoes no handler principal:
- Extrair `name` do request body
- Passar `name` para `buildAnalysisPrompt`

### Detalhes Tecnicos

**`buildAnalysisPrompt`** - novo formato do prompt:

```
SAAS NAME: {name}
PRODUCT DESCRIPTION: {description}
PRODUCT TYPE: {saasType}
TARGET INDUSTRY: {industry}

DESIGN PRIORITY (follow this order):
1. The logo icon MUST visually represent the SAAS NAME semantics.
   - Break the name into its component words (e.g., "DoctorHub" = Doctor + Hub)
   - The icon should symbolize the core concept from the name
   - Examples: "SalesRadar" -> radar/target icon, "DoctorHub" -> medical cross/connection icon
2. Reinforce the concept using market trends and visual conventions from the {industry} industry
3. Use the product description for additional context on colors and mood

The name is the PRIMARY driver of the visual concept. The description and industry inform style, colors, and trends.
```

**Frontend payload** - adicionar campo:
```typescript
body: JSON.stringify({
  description: data.description,
  name: data.name,        // <-- novo
  saasType: data.saasType,
  industry: data.industry,
  existingLogo: data.saasLogo || undefined,
  mode: data.saasLogo ? "improve" : "create"
})
```

A edge function sera redeployada apos as alteracoes.
