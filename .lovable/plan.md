

# Plano: Adicionar 4 Novos Tipos de SaaS + Enviar Títulos ao Webhook

## Resumo

1. Adicionar 4 novos tipos de SaaS ao wizard
2. Modificar o webhook para enviar o **título** de TODOS os tipos de SaaS (não o ID técnico)

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/wizard/StepYourIdea.tsx` | Adicionar 4 novos tipos + imports de ícones |
| `supabase/functions/pms-webhook-new-report/index.ts` | Mapeamento completo ID → Título para TODOS os tipos |

---

## Parte 1: Frontend - Novos Tipos de SaaS

### Imports de Ícones a Adicionar

`Brain`, `Shield`, `Code`, `Layers`

### Novos Tipos no Array `saasTypes`

Inserir antes do `other`:

```typescript
{ id: "ai", title: "AI & Automation", description: "AI-powered solutions", icon: Brain },
{ id: "security", title: "Cybersecurity & Compliance", description: "Security & data protection", icon: Shield },
{ id: "devtools", title: "Developer Tools", description: "APIs, SDKs & dev platforms", icon: Code },
{ id: "platform", title: "Platform", description: "Multi-sided marketplace", icon: Layers },
```

---

## Parte 2: Webhook - Mapeamento Completo de Títulos

### Mapeamento de TODOS os Tipos

```typescript
const SAAS_TYPE_TITLES: Record<string, string> = {
  // Tipos existentes
  crm: "CRM & Sales",
  project: "Project Management",
  ecommerce: "E-commerce",
  hr: "HR & Recruiting",
  finance: "Financial Management",
  marketing: "Marketing Automation",
  analytics: "Analytics & BI",
  communication: "Communication",
  support: "Customer Support",
  productivity: "Productivity",
  education: "Education & Learning",
  // Novos tipos
  ai: "AI & Automation",
  security: "Cybersecurity & Compliance",
  devtools: "Developer Tools",
  platform: "Platform",
};
```

### Função Helper

```typescript
const getSaasTypeTitle = (id: string, otherValue?: string | null): string => {
  if (id === "other" && otherValue) {
    return otherValue; // Retorna o texto personalizado do usuário
  }
  return SAAS_TYPE_TITLES[id] || id;
};
```

### Uso no Payload do Webhook

```typescript
// No objeto wizard dentro do webhookPayload:
saas_type: getSaasTypeTitle(wizardData.saas_type, wizardData.saas_type_other),
```

---

## Tabela de Conversão Completa

| ID no Banco | Título Enviado ao n8n |
|-------------|----------------------|
| `crm` | CRM & Sales |
| `project` | Project Management |
| `ecommerce` | E-commerce |
| `hr` | HR & Recruiting |
| `finance` | Financial Management |
| `marketing` | Marketing Automation |
| `analytics` | Analytics & BI |
| `communication` | Communication |
| `support` | Customer Support |
| `productivity` | Productivity |
| `education` | Education & Learning |
| `ai` | AI & Automation |
| `security` | Cybersecurity & Compliance |
| `devtools` | Developer Tools |
| `platform` | Platform |
| `other` + "Legal Tech" | Legal Tech |

---

## Resultado Esperado

O n8n receberá títulos legíveis como "CRM & Sales" ou "Cybersecurity & Compliance" em vez de IDs técnicos como "crm" ou "security", permitindo pesquisas de mercado mais precisas e contextualizadas.

