# Arquitetura

## Organização e tecnologias

React e TypeScript são compilados pelo Vite. TanStack Router gera as rotas de `src/pages`; busca, filtros, ordenação e paginação pertencem à URL e são preservados no histórico. TanStack Query gerencia consultas e mutations. Axios centraliza REST, com timeout de 15 segundos e AbortSignal para cancelamento. React Hook Form e Zod validam os formulários. Tailwind e shadcn/ui, sobre Base UI, fornecem os componentes e tokens visuais.

| Local                                                           | Responsabilidade                                                                                                                                                                           |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/pages`                                                     | Composição e lógica no `index.tsx`; exclusivos da rota em `-components` e, quando necessário, `-hooks` (excluídos do roteamento). Pagamento, perfil e carteiras seguem isso.               |
| `src/components`                                                | Componentes compartilhados, incluindo a biblioteca em `ui`.                                                                                                                                |
| `src/features`                                                  | Só o que é compartilhado entre telas: hoje `Auth`, `Favorites` e `Realtime`. Cada uma usa `container` (entrada/composição), `components` (apresentação) e, se precisar, `hooks` e `utils`. |
| `src/services`                                                  | Chamadas Axios tipadas.                                                                                                                                                                    |
| `src/data/types` e `src/data/schemas`                           | Contratos de transporte e validação.                                                                                                                                                       |
| `src/data/mocks/handlers`                                       | Handlers REST e de conexão Socket.IO registrados no MSW.                                                                                                                                   |
| `src/data/mocks/database`, `fixtures`, `scenarios` e `realtime` | Estado canônico, dados iniciais, falhas configuráveis e emissão dos eventos.                                                                                                               |
| `src/data/mocks/temporary` e `public/mocks`                     | Dados visuais provisórios e assets locais.                                                                                                                                                 |
| `tests/e2e`                                                     | Testes Playwright com isolamento por contexto do navegador.                                                                                                                                |

Os mocks são ativados por `VITE_ENABLE_MOCKS=true`, inclusive no build. O worker inicia antes da importação do router e do cliente Socket.IO, permitindo interceptar HTTP e WebSocket. As respostas fictícias ficam na camada MSW; os componentes consomem os mesmos serviços utilizados no fluxo normal da aplicação.

## Contratos REST

Prefixo `/api`, JSON e proprietário identificado pela sessão. As chamadas enviam o cookie e, para compatibilidade do ambiente MSW, o header `X-Auth-Token` com o mesmo identificador. Recursos privados não aceitam um proprietário escolhido pelo formulário.

| Método e recurso                 | Entrada                                                                | Resposta de sucesso                                            |
| -------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| `POST /auth/register`            | `username`, `email`, `password`, `confirmPassword`                     | 201, `{ user }`. Não autentica automaticamente.                |
| `POST /auth/login`               | `email`, `password`                                                    | 200, `{ user, sessionId }` e cookie de sessão.                 |
| `GET /auth/session`              | Sessão                                                                 | 200, `{ user }`.                                               |
| `DELETE /auth/logout`            | Sessão, quando existente                                               | 204; invalida a sessão e o cookie.                             |
| `GET /nfts`                      | Busca, filtros, ordenação, aba e página                                | 200, `{ items, total, page, pageSize, totalPages, filters }`.  |
| `GET /nfts/:id`                  | Identificador do NFT                                                   | 200, `NFTDetail`.                                              |
| `GET /favorites`                 | Sessão                                                                 | 200, `{ nftIds, items }`.                                      |
| `PUT /favorites/:nftId`          | NFT e sessão                                                           | 200, `{ nftId, isFavorite: true }`. Inclusão idempotente.      |
| `DELETE /favorites/:nftId`       | NFT e sessão                                                           | 200, `{ nftId, isFavorite: false }`. Remoção idempotente.      |
| `GET /cart`                      | Sessão ou visitante                                                    | 200, `{ cart }`.                                               |
| `POST /cart/items`               | `{ nftId, edition, quantity }`                                         | 201 na inclusão ou 200 ao acumular na mesma linha, `{ cart }`. |
| `PATCH /cart/items/:id`          | `{ quantity }`                                                         | 200, `{ cart }`; substitui a quantidade anterior.              |
| `DELETE /cart/items/:id`         | Identificador da linha                                                 | 200, `{ cart }`.                                               |
| `POST /cart/coupon`              | `{ code }`                                                             | 200, `{ cart }`, com o cupom aplicado.                         |
| `DELETE /cart/coupon`            | Sem corpo                                                              | 200, `{ cart }`, sem cupom.                                    |
| `POST /quotes`                   | `{ cartSignature, network? }`                                          | 200, `{ quote }`, com disponibilidade e valores revalidados.   |
| `GET /profile`                   | Sessão                                                                 | 200, `{ profile }`.                                            |
| `PATCH /profile`                 | Dados do perfil, avatar e campos opcionais de alteração de senha       | 200, `{ profile }`.                                            |
| `GET /wallets`                   | Sessão                                                                 | 200, `{ wallets }`.                                            |
| `POST /wallets`                  | Dados da carteira e `kind`                                             | 201, `{ wallet }`.                                             |
| `PATCH /wallets/:id`             | Dados da carteira                                                      | 200, `{ wallet }`.                                             |
| `POST /wallet-connections`       | `{ walletId }`                                                         | 200, `{ connection: { id, walletId } }`.                       |
| `DELETE /wallet-connections/:id` | Identificador da conexão                                               | 204.                                                           |
| `POST /orders`                   | `{ quoteId, connectionId, collector }` e header `Idempotency-Key` UUID | 201, `{ order }`.                                              |
| `GET /orders?attempt=UUID`       | Chave da tentativa                                                     | 200, `{ order }`.                                              |
| `GET /orders/:id`                | Identificador do pedido                                                | 200, `{ order }`.                                              |

Favoritos, perfil, carteiras, conexões e pedidos exigem autenticação. Carrinho e cotação atendem também visitantes; um identificador de sessão enviado e inválido recebe 401. Recursos inexistentes ou pertencentes a outra conta retornam 404. Falhas usam `{ message, errors?, code?, cart? }`, conforme o recurso: 400 para requisição malformada, 401 para sessão/credenciais inválidas, 409 para conflito, 422 para validação e 503 para falha transitória ou de persistência. `errors` associa mensagens aos campos; conflitos de cotação podem incluir o carrinho atualizado.

### Campos dos recursos

- `AuthUser`: `id`, `username`, `email`, `displayName`, `avatarUrl`. Hashes e salts não são retornados. Cadastro normaliza o e-mail e rejeita sua duplicidade.
- Catálogo: `q`, arrays `category`/`network`, `minPrice`, `maxPrice`, `sort` (`recent`, `price-asc`, `price-desc`), `tab` (`all`, `new`, `trending`) e `page`. A API recebe filtros repetidos na query e retorna até nove itens por página. Valores da mesma dimensão usam OU; dimensões distintas usam E. Empates usam o ID. Vazio retorna 200 e lista vazia.
- `NFTDetail`: dados do NFT, preço, estoque, versão, galeria, edições, `defaultEdition`, `editionAvailability`, token, descrição e metadados. O estoque por edição é a referência para a seleção de quantidade.
- `Cart`: `items`, `totalQuantity`, `subtotal`, `currency: "ETH"`, `couponCode`. Cada item contém `id`, `nftId`, `edition`, `quantity`, `network`, `unitPrice`, `lineTotal`, `availableQuantity`, `maxQuantity`, `isAvailable`, versão e dados de exibição.
- `Quote`: `id`, `cartSignature`, `createdAt`, `expiresAt`, `network`, `couponCode`, snapshot de `items` e `summary: { subtotal, discount, networkFee, total }`.
- Perfil: `displayName`, `username`, `email`, `ensSuffix`, `ensName`, `walletAlias`, `avatarUrl` nullable. A alteração de senha envia `currentPassword`, `newPassword`, `confirmNewPassword`; senha atual incorreta retorna 422 e conflitos de e-mail/username retornam 409. ENS e apelido são metadados opcionais, sem cadastrar uma carteira.
- Carteira: `id`, `kind` (`main` ou `secondary`), `displayName`, `alias`, `network`, `profileName`, `address`, `secondaryAddress`, `walletType`, `referralCode`, `email`, `ensSuffix`, `ensName`. Há no máximo uma principal e uma secundária por conta. Redes: `ethereum`, `polygon`, `solana`; tipos: `metamask`, `walletconnect`, `coinbase`. Ethereum/Polygon validam `0x` e 40 hexadecimais; Solana valida Base58 entre 32 e 44 caracteres.
- `collector`: `displayName`, `username`, `profileName`, `email`, `note`. O pedido determina proprietário, endereço, rede e provedor pela sessão e carteira cadastrada.
- `Order`: `id`, `attemptKey`, `version`, `status` (`pending`, `confirmed`, `declined`), `createdAt`, `updatedAt`, `transaction`, `reason?`, snapshot de `items`, `summary`, `collector` e `wallet`. Campos internos de persistência são excluídos da resposta.

As definições completas e schemas estão em `src/data/types` e `src/data/schemas`. Valores monetários trafegam como strings decimais e são calculados com BigInt em wei, preservando até 18 casas; quantidades são inteiras. KURIO10 desconta 10% do subtotal, arredondando frações inferiores a um wei para baixo. A taxa é adicionada depois, conforme as fixtures de cada rede. O código e o percentual são decisões da implementação, não valores impostos pelo enunciado.

## Política de sessão e persistência

O cookie `authToken` contém um identificador aleatório vinculado ao usuário na base MSW. Dura 30 minutos, com `Path=/`, `SameSite=Lax`, `Max-Age=1800` e `Secure` em HTTPS. O mock permite leitura pelo JavaScript para interoperar com REST e Socket.IO; não é um cookie HttpOnly de produção. Senhas fictícias são verificadas por PBKDF2/SHA-256 com salt aleatório e 600.000 iterações.

`useSession` compartilha a query da sessão com header, rotas e features. `undefined` significa carregamento; `null`, visitante. A sessão é revalidada a cada 30 segundos, ao focar a janela e ao entrar em uma rota privada. Um 401 de recurso privado encerra a autenticação; credenciais inválidas no formulário de login não removem outra sessão válida.

Login une o carrinho visitante ao da conta e substitui a sessão anterior do cookie. Logout invalida a sessão e remove o cookie. Troca de conta, logout e expiração cancelam queries e limpam dados em cache e mutations; a política conservadora também descarta caches públicos. Callbacks de escrita conferem a conta ativa antes de aplicar resultados. O socket libera listeners e encerra a assinatura anterior.

Quando carrinho ou favoritos pedem autenticação, o desktop abre o modal de login e o mobile navega para `/login`, ambos com retorno ao destino. Em rota privada, sessão expirada redireciona para login preservando a navegação. O formulário de pagamento não persiste rascunho de campos ainda não enviados; só a tentativa de pedido (UUID + payload) usa sessionStorage.

Os modelos MSW persistem usuários, sessões, favoritos, carteiras, carrinhos, estoque/mercado e pedidos em chaves `marketplace-nfts:` do localStorage. Dados permanecem após refresh da mesma origem. Tentativas de compra e configuração de cenário ficam no sessionStorage; a chave adicional de cenário de pagamento fica no localStorage. Cotações ficam em memória, com validade de cinco minutos e limite de 100 registros, e são renovadas após refresh.

O endereço `/?scenario=reset`, carregado pela barra de navegação, limpa as chaves do projeto em ambos os storages e o cookie. O novo carregamento reinicia timers, cotações e conexões em memória e restaura as fixtures na próxima leitura. Dados alheios à aplicação são preservados. Cenários e instruções de reprodução estão no [README](./README.md#cenários-reproduzíveis).

## Estado do carrinho e compra

O carrinho guarda linhas de NFT/edição com ID estável. Adicionar a mesma combinação acumula quantidade; outra edição cria outra linha. Preço e limites são calculados pela API, que considera estoque geral, estoque por edição e outras linhas do mesmo NFT. Adicionar ao carrinho não reserva unidades.

Visitantes e contas têm estados separados. Ao autenticar, as linhas são combinadas, somando quantidades e preservando o ID existente da conta; a limpeza do visitante e a união são gravadas juntas. Repetir o login não duplica a união. Quantidades acima da disponibilidade permanecem sinalizadas para ajuste. O cupom do visitante é aproveitado quando a conta não tem um aplicado. Logout preserva os carrinhos persistidos das contas.

A assinatura do carrinho inclui itens, edições, quantidades, preço, disponibilidade, rede e cupom. A cotação compara essa assinatura com o estado canônico e retorna 409 em divergência. Mudanças de conteúdo ou mercado exigem uma cotação atual e nova revisão antes de confirmar.

O pedido exige conexão de carteira válida, da própria conta e da rede da cotação. A conexão vale por 15 minutos. Antes de criar, a API revalida assinatura, disponibilidade, cupom, taxa, total e dados da carteira. A tentativa salva UUID e payload original por conta em sessionStorage. A mesma Idempotency-Key com o mesmo corpo recupera o pedido existente; reutilização com outro corpo retorna 409. O cliente mantém o contexto para consulta ou reenvio da mesma tentativa após timeout.

O pedido pendente possui prazo persistido para decisão. Um timer conclui a operação e publica o evento; consultas REST também reconciliam o estado. Após refresh, os timers são retomados. Confirmação e recusa são terminais. O recibo lê somente o snapshot confirmado, preservando os valores mesmo após mudanças no catálogo.

Na confirmação, são removidas somente as quantidades compradas e aplicados os ajustes de estoque. Carrinho, estoque e um marcador de conclusão são persistidos juntos. Se uma gravação posterior do pedido falhar, o marcador permite recuperar a confirmação sem repetir a baixa. Recusa mantém os itens no carrinho.

## Estratégia de cache

| Recurso            | Chave/política                                                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Catálogo e detalhe | Chaves por parâmetros/ID; padrão global de staleTime de 60 segundos e uma nova tentativa. O detalhe não repete 404.                          |
| Sessão             | Chave única compartilhada; staleTime e intervalo de 30 segundos, revalidação por foco e sem retry.                                           |
| Carrinho           | Chave por conta ou visitante, staleTime zero e reconciliação ao montar/retornar ao foco; retry transitório, sem repetir 4xx.                 |
| Favoritos          | Chave por conta; inclusão/remoção otimista com cancelamento, snapshot, rollback e reconciliação REST. Detalhe abaixo.                        |
| Cotação            | Conta, assinatura e rede na chave; staleTime de dez segundos, atualização a cada minuto enquanto ativa; sem retry para 4xx.                  |
| Perfil e carteiras | Queries invalidadas após salvamento; carteiras incluem a conta na chave. O cache de perfil é limpo nas transições de sessão.                 |
| Pedido             | Chave por conta e tentativa. Atualização por eventos; consulta REST a cada cinco segundos como fallback durante indisponibilidade do socket. |

Queries propagam AbortSignal ao Axios para cancelar consultas obsoletas. Mutations de compra não têm retry automático. A remoção do carrinho também é otimista: restaura o estado anterior em falha e revalida ao concluir. Sucesso dos formulários e do pagamento depende da resposta da API.

### Favoritos: cache, otimismo e sync

A feature fica em `src/features/Favorites`; a query e o patch de cache em `src/lib/favorites-query.ts`. A lista usa `queryKeys.favorites.list(userId)`, só habilita com usuário autenticado e marca `meta.ownerId` para isolamento. Retry da query: no máximo uma nova tentativa, e nunca para respostas 4xx.

O clique no `FavoriteButton` trata sessão ainda indefinida com `refetch` da sessão antes de decidir. Visitante segue o fluxo de login descrito na política de sessão. Conta autenticada com query em erro tenta recarregar a lista antes de mutar. Enquanto a mutation daquele NFT está em voo, cliques extras são ignorados.

A mutation (`PUT`/`DELETE /favorites/:nftId`) não tem retry. Fluxo otimista:

1. `onMutate` cancela a query da lista da conta, confirma o dono ativo, guarda se o NFT já era favorito e aplica `updateFavoriteCache` imediatamente.
2. `onSuccess` reescreve o cache com a resposta canônica e exibe toast.
3. `onError` restaura o snapshot (`wasFavorite`) quando a conta ainda é a ativa; 401 com sessão nula pede login de novo, sem rollback de outra conta.
4. `onSettled` invalida a lista só quando aquela conta não tem outra mutation de favoritos em andamento, evitando corrida entre cliques rápidos em NFTs diferentes.

Callbacks e `updateFavoriteCache` só alteram o cache se `isFavoriteOwnerActive` confirmar a mesma conta da sessão atual. Troca de usuário, logout ou expiração limpam o cache conforme a política geral de sessão.

Eventos `nft.updated` e a reconciliação pós-`session.ready`/reconexão invalidam a lista de favoritos; o estado canônico volta pelo REST. A página `/favoritos` reutiliza os cards do catálogo e depende da mesma query.

## Eventos Socket.IO e reconciliação

O cliente real `socket.io-client` conecta por WebSocket, no namespace `/`, com reconexão automática. No modo de mocks, utiliza a mesma origem; MSW e `@mswjs/socket.io-binding` interceptam e codificam os pacotes Engine.IO/Socket.IO. A emissão atravessa o protocolo antes de chegar a `socket.on`; o mock não chama setters ou cache da interface diretamente.

| Evento            | Payload                                                                                             | Efeito                                                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `nft.updated`     | `eventId` UUID, `version`, `nftId`, `price`, `availableQuantity`, `reason` (`market` ou `purchase`) | Atualiza catálogo/detalhe/favoritos e, se afetado, carrinho/cotação. Mudança de mercado informa a alteração e invalida a revisão anterior. |
| `order.updated`   | `eventId` UUID, `version`, `orderId`, `attemptKey`, `userId`, `status`                              | Entregue somente ao proprietário; provoca consulta REST antes de apresentar confirmação ou recusa.                                         |
| `session.ready`   | `{ userId: string ou null }`                                                                        | Confirma a identidade e inicia a reconciliação REST.                                                                                       |
| `session.expired` | Sem payload                                                                                         | Encerra a assinatura privada e revalida a sessão.                                                                                          |

O cliente envia `session.authenticate` com `{ sessionId? }`, obtido do cookie; o mock resolve a conta pela base de sessões. `context.watch` envia `{ pathname }` para armar o cenário do carrinho/pagamento. O payload de recurso é validado com Zod. Versões crescentes por recurso são comparadas ao último evento aceito e aos snapshots em cache; duplicatas e eventos antigos são ignorados. Estados terminais de pedido não regridem.

As alterações são persistidas antes de publicar os eventos, e as respostas REST consultam a mesma base. Ao receber um evento válido, o cliente invalida as queries relacionadas e obtém os dados canônicos por Axios. O carrinho é reconciliado antes de invalidar a cotação. Após autenticar ou reconectar, catálogo, detalhe, favoritos, carrinho, cotação e pedidos ativos são revalidados por REST, recuperando eventos perdidos sem reenviar a compra.

Enquanto a assinatura está pronta, o pedido não usa polling. Se houver interrupção, mostra feedback, tenta reconectar e permite consulta manual; a consulta periódica é fallback. O toast de desconexão é único por interrupção e fecha ao reconectar. Logout e desmontagem liberam listeners específicos e desconectam o socket. Filtragem na simulação e checagem da conta ativa no cliente impedem eventos privados de outra sessão.

### Controles determinísticos do mock

`GET /api/mock/realtime` retorna `{ connections }` para a conta/visitante. `POST /api/mock/realtime` recebe uma das ações abaixo. As rotas só são registradas com MSW habilitado; os testes usam Axios para disparar os comandos e observam os eventos no cliente Socket.IO.

| `action`         | Campos adicionais               | Comportamento                                                                       |
| ---------------- | ------------------------------- | ----------------------------------------------------------------------------------- |
| `update-nft`     | `nftId`, `price?`, `supply?`    | Atualiza a base e emite nova versão. `supply` é o estoque-base anterior às compras. |
| `run-scenario`   | Nenhum                          | Dispara a alteração de mercado configurada.                                         |
| `replay-nft`     | `nftId`, `outdated?`            | Reenvia o evento atual/antigo sem alterar a base REST.                              |
| `replay-order`   | `outdated?`                     | Reenvia o último evento da conta, opcionalmente antigo.                             |
| `disconnect`     | `milliseconds?`                 | Interrompe a conexão atual pelo período informado.                                  |
| `settle-order`   | `attempt`, `outcome?`, `delay?` | Finaliza um pedido pendente da conta, imediatamente ou após o atraso.               |
| `expire-session` | Nenhum                          | Invalida a sessão e publica seu encerramento.                                       |
| `reset-market`   | Nenhum                          | Restaura preço/estoque-base com novas versões; preserva compras e demais dados.     |

`trigger=manual` na URL desativa o timer de mercado nos testes. As ações privadas exigem sessão e filtram o proprietário. Comando inválido retorna 422; pedido ausente/de outra conta, 404; pedido terminal, 409.

### Transporte e limitações dos mocks

A versão publicada `@mswjs/socket.io-binding@0.2.0` fornece `toSocketIo` e declara peer dependency de MSW 2. O projeto usa MSW 3 com override explícito em package.json e lockfile. Essa combinação foi validada com instalação, build e testes do cliente real. A API da branch principal da biblioteca difere da versão publicada.

O bridge cobre namespace padrão, eventos JSON e transporte WebSocket. Não implementa polling de transporte, namespaces customizados, acknowledgements, anexos binários ou cluster. Um heartbeat Engine.IO a cada 20 segundos mantém a conexão. O matching acompanha a normalização do MSW 3, que retira `/socket.io/`; WebSockets sem `EIO`, como HMR do Vite, seguem para o servidor.

Os dados pertencem à origem do navegador e não são compartilhados entre dispositivos. Não há garantia transacional entre abas. Timers não executam com a aplicação fechada; os prazos persistidos são reconciliados na reabertura. API e eventos reais de produção, blockchain, extensões e gateways estão fora do escopo. As referências de transação são fictícias; Etherscan, Polygonscan e Solana Explorer podem abrir sem um registro correspondente.

## Decisões de produto e adaptações ao Figma

### Regras de negócio e fluxo

- A compra é feita por uma rede por pedido. Carteiras incompatíveis com a rede do carrinho são omitidas; itens de redes diferentes exigem ajuste antes do pagamento. ETH e taxas seguem fixtures do desafio, sem conversão ou bridge.
- Contas novas começam sem carteira. ENS e apelido do perfil são opcionais e não cadastram carteira; a página de carteiras aceita retorno ao pagamento quando aberta pelo checkout.
- Atividade, ofertas, downloads, suporte e páginas editoriais citadas no enunciado ficam fora dos fluxos entregues.

### Adaptações e desvios do Figma

- No mobile, a seção de compra do detalhe do NFT difere levemente do frame: opções adicionais ficam abaixo dela para acomodar o fluxo funcional.
- O pagamento mobile usa Accordion para dados do colecionador e revisão, e coloca seleção/conexão de carteira antes da confirmação. Checkbox de revisão, erros, processamento e reconexão complementam frames estáticos.
- O footer aparece só na página inicial. A lista de favoritos reutiliza os cards do catálogo; não há frame dedicado no Figma.
- Fontes e imagens são locais. O fundo retangular das imagens dos cards segue as camadas do design; a ordenação reserva espaço extra para não sobrepor texto e ícone. Skeletons usam shimmer e respeitam `prefers-reduced-motion`.

## Verificação e limitações da entrega

A suíte atual contém 30 casos Playwright em Chromium, com maior cobertura em favoritos, compatibilidade de carteiras, compra e tempo real. Há execução desktop/mobile nesses grupos e testes de confirmação/recusa, snapshot, eventos antigos/duplicados, reconexão, refresh, isolamento e expiração. Os contextos são isolados; testes sensíveis a tempo usam relógio e comandos MSW determinísticos. Relatório HTML, screenshot e trace são produzidos conforme a configuração de falhas.

A cobertura ainda precisa ser ampliada para catálogo/histórico, operações completas do carrinho e cupons, formulários de cadastro/perfil/carteiras, timeout do envio e teclado/foco. A validação de formulários pelo navegador faz parte do E2E; não requer testes unitários. As baselines de regressão visual ainda não foram adicionadas, e a largura de 768 px não possui cobertura automatizada. O comando test:visual está reservado para essa etapa.

As auditorias Lighthouse completas, com três medições por página/perfil e respectivas medianas, e a URL pública de entrega ainda estão pendentes. A publicação deve manter os mocks no build e permitir acesso direto/refresh das rotas da SPA. Os comandos de setup e reprodução dos cenários estão no [README](./README.md).
