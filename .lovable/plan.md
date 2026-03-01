

## Corrigir mascara de telefone: placeholder dinamico por pais

### Problema

Quando o usuario troca de pais no seletor, o campo de telefone continua mostrando a mascara/placeholder dos EUA "(555) 123-4567". A flag `disableDialCodeAndPrefix: true` funciona corretamente para esconder o dial code do input, mas o placeholder e estatico.

### Solucao

**Arquivo:** `src/components/ui/phone-input.tsx`

1. Importar `getActiveFormattingMask` da biblioteca `react-international-phone` para obter a mascara de formatacao do pais selecionado
2. Criar uma funcao que gera um placeholder dinamico baseado no pais atual, convertendo a mascara (ex: `"(..) .....-...."` para Brasil) em um exemplo legivel
3. Usar esse placeholder dinamico no campo `<Input>` ao inves do prop estatico

**Arquivo:** `src/components/pms-lead-wizard/steps/PhoneStep.tsx`

- Remover o `placeholder` hardcoded "(555) 123-4567", deixando o componente PhoneInput gerar o placeholder correto automaticamente

### Detalhes tecnicos

A funcao `getActiveFormattingMask` da biblioteca retorna a mascara de formatacao para um dado pais. Usaremos isso junto com `parseCountry` para:

1. Obter a mascara do pais selecionado (ex: `"(..) .....-...."` para BR)
2. Substituir os caracteres de mascara `.` por digitos de exemplo (0-9)
3. Exibir como placeholder no input

O `disableDialCodeAndPrefix: true` sera mantido -- ele funciona corretamente para esconder o codigo do pais no input. O problema era apenas o placeholder estatico.

