
# Reinserir Section Schedule na Homepage

## O que sera feito

Adicionar o componente `Schedule` (que ja existe em `src/components/Schedule.tsx`) de volta na homepage, posicionado antes do `Footer`.

## Mudanca

### `src/pages/Index.tsx`
- Adicionar import: `import Schedule from "@/components/Schedule";`
- Inserir `<Schedule />` entre `<MeetTheFounder />` e `</main>` (antes do Footer)

Nenhum CTA ou copy sera alterado nesta etapa.
