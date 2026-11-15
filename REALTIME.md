# Tempo real

## Execução

Use Node 24, `npm ci` e `.env.local` com `VITE_ENABLE_MOCKS=true`. Execute `npm run dev`. Para a demonstração otimizada, mantenha a mesma variável durante `npm run build` e execute `npm run preview`. Não é necessário iniciar um servidor Socket.IO em outra porta.

O `socket.io-client` usa o transporte WebSocket, namespace `/` e a mesma origem da aplicação. O MSW intercepta a conexão e `@mswjs/socket.io-binding` codifica e decodifica os pacotes Engine.IO/Socket.IO. Os eventos não são chamadas diretas ao cache ou a setters da interface. O cliente só é importado depois de o worker iniciar, para que o WebSocket seja interceptado também no build.

Com mocks desligados, `VITE_SOCKET_URL` define a URL do servidor real; esse servidor e uma API real não fazem parte da entrega. A biblioteca `socket.io` instalada no projeto não inicia um servidor no navegador.

## Como demonstrar

Abra um destes endereços diretamente, usando a origem local ou publicada. A configuração permanece na aba ao navegar para outras telas e após refresh.

| URL                           | Resultado                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `/?scenario=normal`           | Desativa os cenários especiais para novas operações. Não apaga os dados já alterados.                        |
| `/?scenario=price-change`     | Ao abrir carrinho/pagamento com itens, aumenta o preço do primeiro NFT em 0.30 ETH depois de cinco segundos. |
| `/?scenario=stock-change`     | No mesmo ponto do fluxo, esgota a disponibilidade do NFT.                                                    |
| `/?scenario=duplicate-events` | Altera o preço e entrega novamente o mesmo evento.                                                           |
| `/?scenario=old-events`       | Altera o preço e entrega depois um evento antigo com preço 0.01. O cliente o ignora.                         |
| `/?scenario=disconnect-order` | Interrompe a conexão por 5,5 segundos após criar o pedido, com toast; a reconexão recupera o resultado.      |
| `/?scenario=payment-declined` | A próxima compra termina recusada e preserva o carrinho.                                                     |
| `/?scenario=pending`          | Mantém a próxima compra pendente por aproximadamente um minuto.                                              |
| `/?scenario=reset`            | Restaura integralmente os dados e cenários locais do projeto e encerra a sessão.                             |

Faça login com `luna@example.com` e senha `Colecionador123!`; ela possui uma carteira inicial. Escolha o Emerald Ape #042, compre e vá ao carrinho/pagamento. O aviso informa a mudança, os valores são buscados novamente por REST e a revisão precisa ser marcada outra vez. Uma cotação antiga também é recusada na API com 409, mesmo que alguém tente enviá-la diretamente.

O cenário de mercado dispara uma vez por conta e cenário em cada carregamento da aplicação. O parâmetro opcional `nft=emerald-ape-042` escolhe um NFT específico, que precisa estar no carrinho. Para repetir com estado conhecido, abra `/?scenario=reset`, depois o cenário desejado. O reset remove apenas chaves `marketplace-nfts:` de localStorage/sessionStorage e o cookie da sessão; preserva dados alheios à aplicação. Faça isso em uma única aba de demonstração, pois a persistência local é compartilhada pela origem.

O reset restaura as fixtures de usuários e carteiras na próxima leitura, zera favoritos, carrinhos, compras, ajustes de estoque, alterações de preço e tentativas pendentes. A inicialização cria novos estados em memória para cotações, timers e conexões. Ele exige navegação completa pelo endereço, como nos exemplos; mudar apenas o search de uma rota já aberta não reinicia os mocks.

## Contratos dos eventos

Todos os eventos de recurso têm `eventId` UUID e `version` inteiro crescente por recurso. Os valores ETH trafegam como strings decimais; disponibilidade é inteira. Os contratos e a validação em runtime estão em `src/data/schemas/realtime.ts`.

| Evento            | Payload adicional                                                                 | Comportamento                                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `nft.updated`     | `nftId`, `price`, `availableQuantity`, `reason: "market" ou "purchase"`           | Invalida catálogo, detalhe e favoritos; se afetar o carrinho, atualiza carrinho e cotação. Mudanças de mercado mostram aviso acessível. |
| `order.updated`   | `orderId`, `attemptKey`, `userId`, `status: "pending", "confirmed" ou "declined"` | Somente o proprietário recebe o evento; o cliente consulta o pedido pela API antes de mostrar o recibo.                                 |
| `session.ready`   | `userId: string ou null`                                                          | Confirma a identidade da assinatura e dispara reconciliação REST.                                                                       |
| `session.expired` | Sem payload                                                                       | Revalida a sessão REST e encerra a assinatura privada. O login preserva o destino.                                                      |

O cliente envia `session.authenticate` com `{ sessionId?: string }`, obtido do mesmo cookie usado no REST. O mock resolve o proprietário pela base de sessões, em vez de aceitar um userId escolhido pelo cliente. `context.watch` envia `{ pathname }` para armar o cenário de demonstração do carrinho/pagamento; não altera dados diretamente.

## Cache, ordem e recuperação

`RealtimeSync` gerencia a conexão de acordo com a conta atual. Os handlers validam payloads com Zod e comparam a versão recebida com a última aceita e com os snapshots REST em cache. Duplicatas e versões antigas não geram uma nova atualização nem reaplicam efeitos. Estados terminais de pedido não regridem.

O evento é uma indicação para reconciliar com REST. Após autenticar ou reconectar, as queries ativas de catálogo, detalhe, favoritos, carrinho, cotações e pedidos são revalidadas. A cotação é invalidada depois da atualização do carrinho; a nova identificação da cotação invalida a revisão anterior. Os serviços Axios recebem AbortSignal e os caches privados são isolados por conta; callbacks verificam se o proprietário ainda está ativo.

Pedidos pendentes são concluídos por um timer no mock, que publica `order.updated`. A tela não faz polling enquanto a conexão está pronta. Se o socket ficar indisponível, usa consulta REST a cada cinco segundos e mantém o botão Atualizar status. A reconexão recupera eventos perdidos pela API, sem reenviar o POST. Ao recarregar, os prazos persistidos dos pedidos pendentes são retomados. O snapshot do recibo e a baixa única de estoque continuam sob responsabilidade da API.

Logout, troca de usuário e desmontagem removem os listeners registrados e desconectam o socket. O mock filtra os eventos privados por sessão; o cliente também confere a conta antes de invalidar queries. A limpeza existente da autenticação cancela consultas e remove caches da conta anterior.

## Controles determinísticos de teste

Com `trigger=manual` na URL do cenário, o timer de mercado não dispara. Os testes usam Axios para chamar os endpoints abaixo; os comandos alteram a base MSW e emitem pacotes para o `socket.io-client`. Não há controles de teste na interface do produto.

| Endpoint                  | Operação                                                |
| ------------------------- | ------------------------------------------------------- |
| `GET /api/mock/realtime`  | Retorna `{ connections }` para a conta/visitante atual. |
| `POST /api/mock/realtime` | Recebe um comando discriminado por `action`.            |

| action           | Campos                          | Efeito                                                                                                     |
| ---------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `update-nft`     | `nftId`, `price?`, `supply?`    | Atualiza a base e publica a nova versão. `supply` é o estoque total antes de descontar compras anteriores. |
| `run-scenario`   | Nenhum                          | Executa a alteração de mercado configurada na URL.                                                         |
| `replay-nft`     | `nftId`, `outdated?`            | Reenvia o último evento ou uma versão anterior. Não muda a base REST.                                      |
| `replay-order`   | `outdated?`                     | Reenvia o último evento da conta atual, opcionalmente antigo.                                              |
| `disconnect`     | `milliseconds?`                 | Fecha a conexão atual e bloqueia sua reconexão pelo período informado.                                     |
| `settle-order`   | `attempt`, `outcome?`, `delay?` | Finaliza um pedido pendente da conta atual, imediatamente ou após o atraso.                                |
| `expire-session` | Nenhum                          | Encerra a sessão e avisa o cliente pelo socket.                                                            |
| `reset-market`   | Nenhum                          | Restaura preços e estoque-base das fixtures, publicando versões novas; preserva as compras e outros dados. |

Comandos inválidos retornam 422, NFT/pedido ausente ou de outro proprietário retorna 404, pedido já terminal retorna 409 e falha de persistência retorna 503. Operações privadas exigem sessão. Esses endpoints só existem quando a configuração habilita MSW e servem à demonstração local/publicada, sem representar uma API administrativa real.

## Compatibilidade e limitações

A versão publicada `@mswjs/socket.io-binding@0.2.0` fornece `toSocketIo`. Seu peer dependency declara MSW 2, enquanto o projeto usa MSW 3; `package.json` fixa um override para reutilizar o MSW do projeto. A instalação e os testes devem ser mantidos junto ao lockfile. A API da branch principal do repositório da biblioteca difere dessa versão publicada.

O bridge trata o namespace padrão e eventos JSON via WebSocket; não implementa polling de transporte, namespaces customizados, acknowledgements, anexos binários nem um cluster Socket.IO. Um heartbeat Engine.IO a cada 20 segundos mantém a conexão de demonstração. O handler acompanha a normalização de URL do MSW 3, que retira `/socket.io/` antes do matching; WebSockets sem `EIO` continuam para o servidor, como o HMR do Vite.

O servidor é uma simulação na camada de rede do navegador. Os dados pertencem à origem local, não são compartilhados entre dispositivos, e os timers não executam com a aplicação fechada; na reabertura, os pedidos são reconciliados. Não há garantias transacionais entre abas, autenticação de produção, blockchain real ou entrega durável de eventos. O comportamento de recuperação usa a API como fonte de verdade.

## Testes

Execute `npx playwright install chromium` uma vez e depois `npm run test:e2e`. Para esta integração, use `npx playwright test realtime`.

Os testes observam a interface, as respostas Axios/MSW e os eventos recebidos no cliente Socket.IO. Cobrem preço e revisão em desktop/mobile, cotação antiga recusada, esgotamento, duplicatas e eventos antigos, confirmação/recusa, snapshot preservado, interrupção e refresh sem nova compra, isolamento entre contas, sessão expirada, disparo automático pela URL e reset. Contextos independentes isolam a persistência; relógio e comandos de rede controlam os cenários sensíveis a tempo. Relatório HTML e traces de falhas são produzidos pela configuração do Playwright.

## Verificação desta integração

Em 15/11/2026, a suíte existente terminou com 29 testes aprovados, incluindo 13 adicionados para tempo real. O teste de demonstração também passou separadamente no preview do build otimizado, cobrindo login, compra, mudança automática de preço, revisão, confirmação e refresh do recibo, sem importar módulos de desenvolvimento.

Foram executados instalação pelo lockfile (`npm ci --ignore-scripts`), build com verificação TypeScript, lint, formatação e verificação de diferenças. O lint terminou sem erros, com três avisos preexistentes em AuthPage, useProfileForm e useCheckout. Ambiente: Ubuntu/WSL, Node 24.15.0, Playwright 1.65.1 e Chromium headless 153.0.8010.12. A execução local utilizou configuração temporária para apontar ao binário já disponível; o repositório mantém a configuração portátil e requer `npx playwright install chromium` no setup normal. O relatório HTML fica em `playwright-report/index.html` após a execução; traces e screenshots são retidos em falhas.
