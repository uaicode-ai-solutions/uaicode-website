

# Plano: Descrições Mais Concisas no Popup de Logo

## Resumo

Ajustar o tool calling da Edge Function `pms-generate-logo` para gerar descrições menores e mais pontuais, mantendo as informações relevantes mas sem textos extensos.

---

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/functions/pms-generate-logo/index.ts` | Modificar descrições do tool calling |

---

## Mudanças no Tool Calling

### Antes (linhas 88-95)

```typescript
logoDescription: {
  type: "string",
  description: "Description of the logo design in 2-3 sentences. Explain what the icon represents and its visual elements."
},
marketJustification: {
  type: "string",
  description: "2-3 sentences explaining why this design aligns with current market trends, industry standards, and target audience expectations."
}
```

### Depois

```typescript
logoDescription: {
  type: "string",
  description: "Brief description of the logo (max 15 words). State what the icon represents."
},
marketJustification: {
  type: "string",
  description: "One concise sentence (max 20 words) on why this design aligns with market trends."
}
```

---

## Mudança no System Prompt (linhas 46-50)

### Antes

```text
RESPONSE REQUIREMENTS:
You must provide:
1. A detailed image generation prompt that strictly follows the rules above
2. A description of the logo design (2-3 sentences explaining what it depicts)
3. A market justification (2-3 sentences explaining why this design aligns with current market trends and industry standards)
```

### Depois

```text
RESPONSE REQUIREMENTS:
You must provide:
1. A detailed image generation prompt that strictly follows the rules above
2. A brief logo description (max 15 words stating what the icon represents)
3. A concise market justification (one sentence, max 20 words on trend alignment)
```

---

## Exemplos de Output

### Antes (muito longo)
- **logoDescription**: "A modern circular icon featuring interconnected nodes representing seamless data flow and connectivity. The design uses clean geometric shapes to convey efficiency and technological sophistication."
- **marketJustification**: "This design aligns with 2024 SaaS trends favoring minimalist icons and blue color palettes that signal reliability. Competitors in the CRM space use similar geometric approaches for brand recognition and trust."

### Depois (conciso)
- **logoDescription**: "Circular icon with connected nodes symbolizing seamless data flow."
- **marketJustification**: "Aligns with 2024 SaaS minimalist trends and blue trust palettes."

---

## Resultado Esperado

O popup exibirá textos curtos e diretos que comunicam o essencial sem ocupar espaço excessivo na interface.

