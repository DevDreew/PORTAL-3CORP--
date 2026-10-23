# Portal Financeiro 3CORP: publicar sem editar codigo

## 1. GitHub
Este pacote substitui os anteriores. Faca uma copia do repositorio atual antes de substituir arquivos.
Para evitar conflito com as pastas antigas, a opcao mais simples e um NOVO repositorio privado.
Extraia o ZIP e envie TODO o conteudo para a raiz do repositorio.
A primeira tela do GitHub deve mostrar `src/`, `package.json`, `package-lock.json`, `next.config.mjs` e os demais arquivos.
Nao envie o ZIP fechado. Nao coloque outra pasta por fora de `src`.

## 2. Vercel
Importe esse repositorio. Framework: Next.js. Root Directory: ./.
Mantenha Install, Build e Output no padrao. Node.js: 22.x ou superior.
Para testar a interface, NAO configure API_BASE_URL ainda. Clique em Deploy.
O modo demonstracao permite cadastrar fornecedores e obrigacoes, buscar, filtrar, abrir processos,
visualizar documentos ficticios, simular recebimento, confirmar um envio e consultar seu historico.

## 3. Conectar sua API
Seu desenvolvedor deve seguir `docs/API.md` e `docs/bootstrap.example.json`.
No Vercel, adicione nas Environment Variables:
- API_BASE_URL: URL HTTPS da sua API, incluindo /api se existir esse prefixo.
- API_TOKEN: token opcional da API, SOMENTE no ambiente do servidor.
- PORTAL_USER: usuario de acesso inicial ao Portal.
- PORTAL_PASSWORD: senha forte para esse acesso inicial.
Depois faca um novo deploy para aplicar as variaveis.
Ao abrir, o navegador pede usuario e senha. Sem essas duas variaveis, o modo API real fica bloqueado.

IMPORTANTE: o contrato real da sua API nao foi fornecido nesta conversa.
A ponte esta implementada, mas seu backend precisa atender o contrato incluido ou receber um adaptador.
Nenhum e-mail real e enviado por este pacote. Sua API/automacao e responsavel por isso.

## 4. Login (novo)
Adicione tambem SESSION_SECRET (32+ caracteres aleatorios) nas Environment Variables. Sem API_BASE_URL e sem PORTAL_USER/PORTAL_PASSWORD o modo demonstracao continua aberto.
