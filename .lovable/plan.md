
<contexto-e-diagnostico>
Objetivo: eliminar a “tela em branco” e o delay entre a tela de erro e a tela de loading ao clicar em Retry.

O que observei (com evidências):
1) Hoje o Retry faz `window.location.reload()`.
   - Um reload de página sempre tem um período em que o browser descarrega a UI atual e ainda não re-renderizou o React. Esse intervalo pode parecer “tela branca”, principalmente em rotas protegidas (porque precisa re-hidratar sessão/JS/CSS).
2) Mesmo antes do reload, existe um delay perceptível porque o hook `useReportData` só volta a fazer GET a cada 5s quando não está em terminal. Quando está em “Fail”, ele para de pollar. No log de rede, o PATCH do status aconteceu, mas o próximo GET veio ~5 segundos depois. Isso dá sensação de “travou / sumiu / branco”.

Conclusão: enquanto existir `window.location.reload()`, sempre vai existir uma janela de UI “desmontada” (ou pelo menos instável) e o usuário pode enxergar branco. E, além disso, a atualização visual depende do próximo poll de 5s.
</contexto-e-diagnostico>

<causa-raiz>
A causa raiz do “branco” é o reload. O delay adicional acontece porque o polling estava parado (status terminal), e só volta a atualizar quando você força um refetch (ou espera algum novo ciclo/reativação).
</causa-raiz>

<solucao-proposta-alto-nivel>
Trocar o fluxo de Retry de “reset via reload” para “reset via estado + refetch + re-trigger do orchestrator”, tudo dentro do SPA, sem recarregar a página.

Comportamento desejado após a mudança:
- Clique em Retry:
  1) Imediatamente some a tela de erro e entra a tela de loading (skeleton) sem branco.
  2) O botão continua com spinner/estado de “Preparing...” (ou mantém feedback visual equivalente) enquanto o status é atualizado no banco.
  3) Assim que o banco confirma o status atualizado (via refetch imediato), o fluxo dispara o orchestrator e segue normalmente, com polling ativo.
</solucao-proposta-alto-nivel>

<mudancas-de-codigo>
Arquivo: `src/pages/PmsLoading.tsx`

1) Remover o `window.location.reload()`.
   - Isso elimina a janela inevitável de “tela branca” causada por recarregar a página inteira.

2) Fazer o Retry virar um fluxo SPA:
   - No `handleRetryFailedStep`:
     a) `setIsRetrying(true)` imediatamente.
     b) PATCH no Supabase: `status = "preparing"`.
     c) Se falhar: `setIsRetrying(false)` e manter a tela de erro (idealmente com toast).
     d) Se sucesso:
        - Forçar `await refetch()` imediatamente (não esperar 5s).
        - Assim que o refetch confirmar que o status não é mais “Fail” (ex: “preparing”), chamar `triggerOrchestrator()` para reiniciar o fluxo completo.
        - Opcional: `setIsRetrying(false)` após o refetch (porque a tela já estará em loading e o polling voltará automaticamente).

3) Ajustar a lógica de render para nunca mostrar a tela de erro quando `isRetrying` estiver true:
   - Regra: `if (isRetrying) return <GeneratingReportSkeleton ... />` (full screen).
   - Isso garante transição imediata para loading (zero “branco”) mesmo se o `reportData.status` ainda estiver com “Fail” em cache por alguns milissegundos.

4) Garantir que o skeleton mostre um status coerente durante o Retry:
   - Enquanto `isRetrying` estiver true, passar `currentStatus="preparing"` (ou algo similar) ao `GeneratingReportSkeleton`, ao invés do status antigo “Fail”.
   - Isso evita a sensação de “loading, mas com status falhando”.

5) (Opcional, mas recomendado) “failsafe” para desligar `isRetrying` automaticamente:
   - Um `useEffect` que observa `status` e, se `isRetrying === true` e `status` virar “Step 1 …” / “preparing” / “in progress”, então `setIsRetrying(false)`.
   - Isso evita ficar preso em estado de retry caso algum caminho de promise não finalize como esperado.

</mudancas-de-codigo>

<criterios-de-aceitacao>
1) Ao clicar Retry na tela de erro:
   - Não existe mais tela em branco.
   - A UI troca imediatamente para o skeleton (loading).
2) O sistema não espera 5 segundos para “começar a mexer”:
   - Deve haver um `refetch()` imediato após atualizar o status.
3) O orchestrator é disparado exatamente uma vez no retry (sem duplo-disparo).
4) Se o PATCH falhar:
   - A tela de erro permanece e o botão volta para “Retry” (sem travar).
</criterios-de-aceitacao>

<observacao-importante-backend>
Nos logs aparece que o orchestrator falhou no Step 4 com:
“HTTP 500: No item to return was found”.
Isso é um problema do pipeline/edge/n8n retornando vazio, independente da UX. A correção acima melhora a transição/UX do Retry, mas não resolve a causa do Step 4 falhar. Se você quiser, depois fazemos uma auditoria específica do Step 4 (logs do edge function + validação do retorno do n8n + tratamento de “no item”).
</observacao-importante-backend>

<passos-de-implementacao>
1) Editar `PmsLoading.tsx`:
   - Remover `window.location.reload()`.
   - Atualizar `handleRetryFailedStep` para: update status -> refetch imediato -> triggerOrchestrator.
2) Ajustar render:
   - Priorizar `isRetrying` e mostrar skeleton sempre que true.
3) Testar o fluxo:
   - Simular falha (status “Step X … Fail”), clicar Retry e verificar:
     - sem branco
     - skeleton imediato
     - status muda para preparing rapidamente (sem esperar 5s)
     - orchestrator é chamado
</passos-de-implementacao>
