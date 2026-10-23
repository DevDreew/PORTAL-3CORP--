# Contrato para a sua API / automacao

Este e um contrato PROPOSTO e implementado pelo frontend. Nao afirma compatibilidade automatica com uma API ainda nao fornecida.
A API_BASE_URL aponta para a raiz destes caminhos. Exemplo: se API_BASE_URL termina em /api,
GET /portal/bootstrap sera chamado como https://seu-host/api/portal/bootstrap.

## Autenticacao
Se API_TOKEN estiver definido, a ponte envia Authorization: Bearer <valor do ambiente> somente ao backend.
Nunca coloque esse token em NEXT_PUBLIC_*. O acesso ao Portal usa HTTP Basic inicial (ver README).
O backend deve identificar o ator real conforme a autenticacao corporativa escolhida, nao confiar no nome vindo do browser.

## Endpoints usados
- GET /health -> 200 JSON {"status":"ok"}.
- GET /portal/bootstrap -> 200 Store (estrutura abaixo).
- POST /suppliers -> Supplier enviado no corpo; retornar 200/201 Store atualizado.
- PATCH /suppliers/{id} -> Supplier completo no corpo; retornar 200 Store atualizado.
- POST /obligations -> Obligation no corpo; retornar 200/201 Store atualizado.
- PUT /settings -> {"to":"email1; email2","cc":"email3"}; retornar 200 Store atualizado.
- GET /documents/{id}/url -> {"url":"URL HTTPS assinada e temporaria"}.
- POST /obligations/{id}/send-to-finance -> corpo {}; header Idempotency-Key: UUID.
  Retornar 200/201/202 {"store": Store, "dispatch": Dispatch}.
  O dispatch.status deve ser ACCEPTED ou DELIVERED. Nao retornar SIMULATED em producao.

Todas as respostas sao JSON. Erros: {"detail":"Mensagem para o operador"} com HTTP 400/401/403/404/409/422/5xx.
O cliente trata erro de rede, timeout, JSON invalido e contrato de bootstrap invalido.
O backend deve responder dentro do timeout da ponte (20 segundos); processe e-mail em worker e retorne ACCEPTED.

## Store
```ts
type Store = {
  suppliers: Supplier[];
  obligations: Obligation[];
  dispatches: Dispatch[];
  settings: { to: string; cc: string };
};
```
Definicoes completas: src/lib/model.ts. Exemplo integral: bootstrap.example.json.
Datas de calendario: YYYY-MM-DD. Instantes: ISO 8601 com timezone. Competencia: MM/AAAA.
Valores: numeros em reais (298.80), nunca texto monetario formatado. Armazene com decimal exato no backend.
IDs: strings de letras, numeros, hifen e underscore. Os UUIDs enviados nos cadastros devem ser preservados.
Campos de listas do cadastro (senders, clients, companies) sao strings separadas por ponto e virgula nesta versao.

## Obrigacoes e documentos
Estados suportados nesta interface reduzida:
WAITING_DOCUMENTS, REVIEW_REQUIRED, READY_FOR_FINANCE, SENT_TO_FINANCE.
Mapeie estados tecnicos da automacao para esses estados operacionais no bootstrap.
O frontend nao muda status real nem cria documentos reais; recebe tudo da API.
Documentos: kind BOLETO, NF ou OTHER; amount, dueDate e companyCnpj podem ser null se ainda nao extraidos.
Timeline: array de {id, at, label, actor}, sempre vindo do backend em modo real.

## Regras obrigatorias do backend para envio
1. Autenticar e autorizar o operador.
2. Validar fornecedor ativo, status READY_FOR_FINANCE e boleto + NF presentes.
3. Validar valor esperado = boleto = NF, vencimento e CNPJ da empresa pagadora.
4. Bloquear segundo envio por obrigacao com constraint/lock/transacao. O header de idempotencia sozinho nao basta.
5. Criar snapshot de fornecedor, cliente, empresa, competencia, valor, vencimento, destinatarios e documentos.
6. Enfileirar envio em outbox/worker. Nao depender de processamento longo no browser.
7. Retornar ACCEPTED quando aceito; usar DELIVERED apenas com confirmacao de entrega real.
8. Registrar messageId e atualizar timeline, auditoria e bootstrap conforme o resultado.
9. Em timeout/resultado incerto, consulta de estado deve permitir reconciliar sem reenviar automaticamente.
10. Nao permitir editar historico de dispatches quando o cadastro mudar.

## Documentos privados
GET /documents/{id}/url deve autorizar o acesso e emitir URL HTTPS temporaria.
Configure Content-Disposition: attachment para download e content-type adequado para visualizacao.
Nenhuma credencial de storage deve ser enviada ao browser.

## Como conectar
Configure API_BASE_URL, API_TOKEN (se necessario), PORTAL_USER e PORTAL_PASSWORD no Vercel e faca redeploy.
O frontend chama sua API por uma ponte de mesma origem: nao exige CORS entre browser e sua API.
A API ainda precisa ser acessivel pelo servidor do Vercel.
