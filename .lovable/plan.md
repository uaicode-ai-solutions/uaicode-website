
# Plano: Adicionar 4 Novas Indústrias + Enviar Títulos ao Webhook

## Resumo

1. Adicionar 4 novas indústrias ao wizard (Logistics & Supply Chain, Hospitality & Travel, Manufacturing, Legal & Compliance)
2. Modificar o webhook para enviar o **título** de TODAS as indústrias (não o ID técnico)

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/wizard/StepYourIdea.tsx` | Adicionar 4 novas indústrias + imports de ícones |
| `supabase/functions/pms-webhook-new-report/index.ts` | Adicionar mapeamento completo ID → Título para TODAS as indústrias |

---

## Parte 1: Frontend - Novas Indústrias

### Imports de Ícones a Adicionar (linha ~51)

`Truck`, `Plane`, `Factory`, `Scale`

### Indústrias Atuais (linhas 72-81)

```typescript
const industries = [
  { id: "healthcare", title: "Healthcare", ... },
  { id: "education", title: "Education", ... },
  { id: "finance", title: "Finance", ... },
  { id: "realestate", title: "Real Estate", ... },
  { id: "retail", title: "Retail", ... },
  { id: "technology", title: "Technology", ... },
  { id: "marketing", title: "Marketing", ... },
  { id: "other", title: "Other", ... },  // <- penúltimo atualmente
];
```

### Novas Indústrias (inserir antes do "other")

```typescript
{ id: "logistics", title: "Logistics & Supply Chain", description: "Shipping & warehousing", icon: Truck },
{ id: "hospitality", title: "Hospitality & Travel", description: "Hotels & tourism", icon: Plane },
{ id: "manufacturing", title: "Manufacturing", description: "Production & Industry 4.0", icon: Factory },
{ id: "legal", title: "Legal & Compliance", description: "Law firms & regulations", icon: Scale },
```

### Layout Final das Indústrias

```text
Linha 1: Healthcare, Education, Finance, Real Estate
Linha 2: Retail, Technology, Marketing
Linha 3 (NOVA): Logistics & Supply Chain, Hospitality & Travel, Manufacturing, Legal & Compliance
Linha 4: Other
```

---

## Parte 2: Webhook - Mapeamento Completo de Títulos de Indústrias

### Adicionar Constante INDUSTRY_TITLES (após SAAS_TYPE_TITLES, linha ~32)

```typescript
const INDUSTRY_TITLES: Record<string, string> = {
  healthcare: "Healthcare",
  education: "Education",
  finance: "Finance",
  realestate: "Real Estate",
  retail: "Retail",
  technology: "Technology",
  marketing: "Marketing",
  // Novas indústrias
  logistics: "Logistics & Supply Chain",
  hospitality: "Hospitality & Travel",
  manufacturing: "Manufacturing",
  legal: "Legal & Compliance",
};
```

### Adicionar Função Helper (após getSaasTypeTitle, linha ~40)

```typescript
const getIndustryTitle = (id: string | null, otherValue?: string | null): string => {
  if (!id) return "";
  if (id === "other" && otherValue) {
    return otherValue;
  }
  return INDUSTRY_TITLES[id] || id;
};
```

### Alterar no Payload do Webhook (linha ~136-137)

```typescript
// Antes:
industry: wizardData.industry,
industry_other: wizardData.industry_other,

// Depois:
industry: getIndustryTitle(wizardData.industry, wizardData.industry_other),
```

---

## Tabela de Conversão Completa - Indústrias

| ID no Banco | Título Enviado ao n8n |
|-------------|----------------------|
| `healthcare` | Healthcare |
| `education` | Education |
| `finance` | Finance |
| `realestate` | Real Estate |
| `retail` | Retail |
| `technology` | Technology |
| `marketing` | Marketing |
| `logistics` | Logistics & Supply Chain |
| `hospitality` | Hospitality & Travel |
| `manufacturing` | Manufacturing |
| `legal` | Legal & Compliance |
| `other` + "Insurance" | Insurance |

---

## Resultado Esperado

O n8n receberá títulos legíveis como "Logistics & Supply Chain" ou "Legal & Compliance" em vez de IDs técnicos como "logistics" ou "legal", permitindo pesquisas de mercado mais precisas e contextualizadas para cada setor.
