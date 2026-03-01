

## Corrigir mascara de telefone ao trocar pais no PhoneInput

### Problema

O componente `PhoneInput` usa as opcoes `disableDialCodeAndPrefix: true` e `disableDialCodePrefill: true` no hook `usePhoneInput`. Isso impede que a biblioteca `react-international-phone` atualize a formatacao/mascara do numero quando o usuario troca de pais.

### Solucao

**Arquivo:** `src/components/ui/phone-input.tsx`

Remover as duas opcoes `disableDialCodeAndPrefix` e `disableDialCodePrefill` da chamada ao `usePhoneInput`. Isso permite que a biblioteca gerencie o prefixo do codigo do pais e aplique a mascara correta automaticamente ao trocar de pais.

Como o dial code passara a aparecer dentro do input, o placeholder sera ajustado para refletir apenas o formato do numero local (ex: "Phone number").

Alteracao nas linhas 30-39:

```ts
const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
  defaultCountry,
  value,
  countries: defaultCountries,
  onChange: (data) => {
    onChange(data.phone);
  },
});
```

Isso e tudo -- uma remocao de 2 linhas de configuracao.

