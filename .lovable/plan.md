

## LinkedIn step: prefixo fixo + input apenas do username

### O que muda

No step "What's your LinkedIn?", o campo deixara de ser um input de URL livre. Em vez disso, tera um prefixo visual fixo `https://linkedin.com/in/` seguido de um input onde o usuario digita apenas o username.

### Arquivo: `src/components/pms-lead-wizard/steps/LinkedInStep.tsx`

1. **Prefixo visual fixo**: Renderizar um container flex com um `<span>` contendo `https://linkedin.com/in/` estilizado como parte do campo (fundo levemente diferente, borda arredondada apenas a esquerda)
2. **Input do username**: O `<Input>` recebe apenas o username (sem o prefixo), com placeholder `your_username`
3. **Logica de valor**:
   - O `value` prop vem como URL completa (ex: `https://linkedin.com/in/johndoe`)
   - Ao exibir, extrair apenas o username (remover o prefixo)
   - Ao salvar (`onChange`), concatenar o prefixo + username digitado
   - Se o usuario apagar tudo, salvar string vazia (campo e opcional)

### Exemplo visual

```text
[ https://linkedin.com/in/ |  johndoe          ]
   (fixo, nao editavel)      (input editavel)
```

### Detalhes tecnicos

```tsx
const PREFIX = "https://linkedin.com/in/";

const extractUsername = (url: string) => {
  if (url.startsWith(PREFIX)) return url.slice(PREFIX.length);
  return url;
};

// No render:
<div className="flex items-center ...">
  <span className="...">https://linkedin.com/in/</span>
  <Input
    value={extractUsername(value)}
    onChange={(e) => {
      const username = e.target.value.trim();
      onChange(username ? PREFIX + username : "");
    }}
    placeholder="your_username"
  />
</div>
```

Apenas o arquivo `LinkedInStep.tsx` sera modificado. Nenhum outro arquivo precisa de alteracao, pois o valor salvo continuara sendo a URL completa.

