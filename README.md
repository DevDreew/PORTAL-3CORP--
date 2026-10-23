# 3CORP / Finance Operations

Interface operacional funcional em Next.js + React + TypeScript, com CSS corporativo proprio.
Paleta navy, azul e superficies claras; cinco menus essenciais, sem landing page de marketing.

Comece por LEIA-PRIMEIRO.md.

## Funcionalidades implementadas
- Visao Geral: indicadores clicaveis, totais calculados, busca, filtro e exportacao CSV.
- Obrigacoes: lista, cadastro validado, detalhe, conferencias, documentos e timeline.
- Fornecedores: lista, cadastro, edicao e pagina individual com Resumo, Obrigacoes, Documentos, Envios e Configuracao.
- Envios: confirmacao em modal, bloqueio visual de duplicidade, snapshot e filtros por periodo, fornecedor, cliente, usuario, competencia e situacao.
- Configuracoes: destinatarios do Financeiro e teste de conexao.
- Responsividade: menu mobile, tabelas com rolagem interna, formularios e modais adaptaveis.
- Acessibilidade basica: labels, foco visivel, dialog com foco contido, Escape, mensagens de erro/status.
- Estados de carregamento, vazio, erro de rede e erro de contrato.

## Modo demonstracao
Sem API_BASE_URL, usa dados FICTICIOS separados em src/lib/demo.ts e localStorage.
A persistencia e somente neste navegador, nao e banco de dados e nao e compartilhada entre usuarios.
Nao cadastre dados reais nesse modo. Os documentos sao TXT explicitamente ficticios, nao boletos ou NFs reais.
O botao de simulacao e exclusivo desse modo e nao existe no modo API real.
Nenhum e-mail e lido ou enviado. Um registro SIMULATED nunca e apresentado como entrega real.

## Modo API real
A URL e o token ficam no servidor. O browser chama apenas /api/bridge/... na mesma origem.
A ponte tem lista fixa de endpoints, timeout, verificacao de origem para mutacoes e nao aceita URL arbitraria.
Nao ha fallback para mocks se a API falhar. O erro e mostrado ao usuario.
Os dados reais NAO sao gravados no localStorage.
GET /portal/bootstrap fornece o estado do Portal; mutacoes retornam o estado atualizado.
Veja docs/API.md e src/lib/model.ts.

## Seguranca e limites
- A protecao HTTP Basic incluida e um controle inicial compartilhado, NAO SSO, RBAC ou identidade individual.
- Antes de operacao corporativa multiusuario, implemente identidade, autorizacao por perfil, auditoria individual,
  rate limiting e politica de sessoes na sua infraestrutura/API.
- A API deve validar tudo novamente. Validacao no browser nao substitui seguranca no servidor.
- O backend deve fazer transacao, idempotencia por obrigacao, snapshots imutaveis e fila/outbox de envio.
- ACCEPTED significa aceite do processamento, nao entrega do e-mail. DELIVERED depende de confirmacao do backend.
- PDFs reais devem permanecer em storage privado. O endpoint de documento fornece URL HTTPS temporaria.
- Baixar por URL externa depende dos headers do storage (Content-Disposition); o browser pode abrir o arquivo.
- Nao ha Microsoft Graph, scheduler, OCR, PostgreSQL nem credenciais corporativas neste pacote: sua automacao os fornece.
- O bootstrap e adequado para a base operacional inicial; para alto volume, evolua para endpoints paginados.

## Desenvolvimento local
Node.js 22+.
```bash
npm ci
npm run dev
```
Abra http://localhost:3000. Para producao local: npm run build e npm start.
Variaveis opcionais em .env.local, nunca no Git. Veja .env.example.

## Estrutura
src/components/Portal.tsx: interface, formularios, navegacao e modais.
src/app/[[...slug]]/page.tsx: rotas de paginas.
src/lib/model.ts: contratos TypeScript e validacoes de conferencia.
src/lib/api.ts: cliente da ponte HTTP.
src/lib/demo.ts: dados ficticios e documentos de demonstracao.
src/app/api/bridge/[...path]/route.ts: ponte server-side para sua API.
src/proxy.ts: protecao de acesso inicial.
docs/: contrato, exemplo de bootstrap e relatorio de testes.

## Testes executados
Build de producao Next.js e verificacao TypeScript aprovados.
Fluxos testados em Chromium contra o servidor Next de producao: navegacao, busca, formularios,
preview/download ficticio, modal, envio simulado, historico, edicao, persistencia e menu mobile.
Modo API real testado com respostas interceptadas no browser para validar o contrato de interface.
Nao houve conexao com a API do usuario, Outlook ou Microsoft Graph.
Veja docs/TESTES.md.
