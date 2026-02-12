

# Ajuste nas Regras de Geração de Nome do SaaS

## Problema
A IA está gerando acrônimos feios que não remetem ao foco do SaaS. Os nomes gerados não comunicam claramente o propósito da ferramenta.

## Novas Regras de Palavras
- **Ideal**: 2 palavras (ex: DoctorHub, TaskFlow, CodeShip)
- **Aceitável**: 3 palavras (ex: PlanningMySaaS, MyDoctorHub)
- **Máximo permitido**: 1 palavra, somente se for altamente descritiva e memorável

## Estratégia de Naming
O nome deve ser construído a partir da descrição do SaaS (`description`), extraindo:
1. O **domínio/nicho** (saúde, finanças, educação, etc.)
2. A **ação principal** que a ferramenta executa (planejar, automatizar, conectar, gerenciar)
3. O **público-alvo** quando relevante

A IA será instruída a combinar esses elementos em nomes compostos descritivos, evitando acrônimos e siglas abstratas.

---

## Detalhes Técnicos

### Arquivo alterado
`supabase/functions/pms-suggest-name/index.ts`

### Mudanças no SYSTEM_PROMPT

**Seção NAMING RULES** - inverter a prioridade:
```
1. IDEAL: 2 words combining domain + action/benefit (e.g., DoctorHub, TaskFlow, CodeShip, SalesRadar)
2. ACCEPTABLE: 3 words for clarity (e.g., PlanningMySaaS, MyDoctorHub, SmartLeadGen)
3. LAST RESORT: 1 word ONLY if it clearly evokes the product's purpose (e.g., Calendly, Grammarly)
4. NEVER use abstract acronyms or abbreviations that don't communicate the product's focus
```

**Nova seção NAME CONSTRUCTION STRATEGY** a ser adicionada:
```
NAME CONSTRUCTION STRATEGY:
- Extract the CORE DOMAIN from the description (healthcare, finance, education, sales, etc.)
- Identify the PRIMARY ACTION the tool performs (plan, track, manage, automate, connect, etc.)
- Combine domain + action/benefit into a compound name that instantly communicates purpose
- Patterns that work well:
  * [Domain][Action]: SalesRadar, CodeFlow, LeadPilot
  * [Action][Domain]: TrackHealth, PlanMyTrip
  * [My/Smart/Easy][Domain][Tool]: MyDoctorHub, SmartBudget
- The name MUST make someone guess what the product does within 3 seconds
- NEVER generate acronyms or initialisms (no "SFM", "APT", "GHR")
- NEVER use random invented words that don't relate to the description
```

**Seção AVOID** - adicionar:
```
- Acronyms or initialisms of any kind
- Abstract invented words with no semantic connection to the product
- Single generic tech words (Hub, Pro, App) used alone
```

### Mudança no userPrompt
Reforçar a instrução para que o nome reflita a descrição:

```
Generate ONE perfect name that clearly reflects what the product does based on the description above.
The name MUST communicate the product's purpose at first glance. Prefer 2 words.
DO NOT use acronyms. Combine meaningful words from the product's domain and core function.
```

