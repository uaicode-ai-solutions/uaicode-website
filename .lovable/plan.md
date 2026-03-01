

## Remover auto-advance nos steps com cards

O comportamento atual usa a funcao `autoAdvance` que automaticamente avanca para o proximo step 350ms apos selecionar um card. O usuario quer que a navegacao ocorra apenas ao clicar no botao "Next" ou "Submit".

### Alteracao

**Arquivo:** `src/pages/PmsLeadWizard.tsx`

Remover a funcao `autoAdvance` e substituir todas as suas referencias por `set` (o setter simples que apenas atualiza o valor sem avancar automaticamente).

Steps afetados (que usam `autoAdvance` atualmente):
- Step 5: CountryStep - `autoAdvance("country")` -> `set("country")`
- Step 6: RoleStep - `autoAdvance("role")` -> `set("role")`
- Step 7: SaasTypeStep - `autoAdvance("saasType")` -> `set("saasType")`
- Step 8: IndustryStep - `autoAdvance("industry")` -> `set("industry")`
- Step 12: GeographicRegionStep - `autoAdvance("geographicRegion")` -> `set("geographicRegion")`

Remover a funcao `autoAdvance` por completo, ja que nao sera mais utilizada.

