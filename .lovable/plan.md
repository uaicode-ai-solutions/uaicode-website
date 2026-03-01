

## Corrigir PhoneInput: manter dial code fora do input e atualizar mascara

### Problema

A correcao anterior removeu ambas as flags `disableDialCodeAndPrefix` e `disableDialCodePrefill`. Isso fez o codigo do pais (+55) aparecer dentro do campo de texto, duplicando a informacao que ja esta no botao seletor.

### Causa raiz

A flag `disableDialCodeAndPrefix` deve permanecer `true` para esconder o dial code do input. O problema original de mascara era causado pela combinacao com `disableDialCodePrefill`. Removendo apenas `disableDialCodePrefill`, a biblioteca consegue aplicar a mascara correta ao trocar de pais, sem exibir o dial code no campo.

### Solucao

**Arquivo:** `src/components/ui/phone-input.tsx`

Restaurar `disableDialCodeAndPrefix: true` no hook `usePhoneInput`, mantendo `disableDialCodePrefill` removido:

```ts
const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
  defaultCountry,
  value,
  countries: defaultCountries,
  disableDialCodeAndPrefix: true,
  onChange: (data) => {
    onChange(data.phone);
  },
});
```

Isso garante:
- O dial code aparece apenas no botao seletor de pais (nao duplicado no input)
- A mascara de formatacao atualiza ao trocar de pais
- O valor salvo no banco continua sendo o E.164 completo (via `data.phone`)

