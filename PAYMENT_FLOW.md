# Pagamento e pedidos simulados

## Como conferir o fluxo

1. Escolha um NFT, edição e quantidade e clique em Comprar.
2. No carrinho, confira os itens e aplique `KURIO10` se desejar.
3. Clique em Conectar e finalizar. Visitantes abrem o modal de login no desktop (a partir de 1024 px) ou a página de login no mobile. Após autenticar, seguem para o pagamento, preservando o destino e os itens.
4. No pagamento, confira os dados do colecionador, selecione uma carteira cadastrada e clique em Conectar carteira. A rede e o endereço vêm da carteira selecionada.
5. Confira os valores da nova cotação e marque a revisão antes de Confirmar compra.
6. O pedido aparece pendente. A consulta à API apresenta confirmação ou recusa; somente confirmação permite exibir o recibo e remover as quantidades compradas do carrinho.

Se não houver carteira, há um link para cadastrá-la. Sem conexão, revisão ou cotação válida, o envio permanece bloqueado. Não há extensão de carteira, gateway ou transação blockchain real.

## REST

| Endpoint                             | Comportamento                                                                                             |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `POST /api/wallet-connections`       | Recebe `{ walletId }`, valida proprietário e simula conexão. Retorna `{ connection: { id, walletId } }`.  |
| `DELETE /api/wallet-connections/:id` | Desconecta uma conexão do usuário; HTTP 204.                                                              |
| `POST /api/orders`                   | Recebe `{ quoteId, connectionId, collector }` e o header `Idempotency-Key` com UUID. Retorna `{ order }`. |
| `GET /api/orders?attempt=UUID`       | Recupera a tentativa do usuário, inclusive após timeout ou refresh.                                       |
| `GET /api/orders/:id`                | Consulta o pedido do usuário por ID.                                                                      |

Todos exigem sessão. Recurso de outra conta retorna 404. Dados inválidos retornam 422, JSON inválido 400 e falha de persistência 503. Cotação inválida, conexão desconectada ou conflito de chave retornam 409.

`collector` contém `displayName`, `username`, `profileName`, `email` e `note`. Dados de endereço/rede/provedor vêm da carteira cadastrada; o pedido não aceita um proprietário enviado pelo formulário. ENS e indicação são informações opcionais da carteira, exibidas para consulta.

## Idempotência e recuperação

A aplicação salva a chave e o payload original por usuário no sessionStorage antes de enviar. Uma tentativa em aberto oferece Retomar pedido e impede um novo envio acidental. A confirmação usa o parâmetro `attempt` na URL para consultar o pedido.

Mesmo usuário, mesma chave e mesmo payload recuperam o mesmo pedido. Conteúdo diferente com a mesma chave retorna conflito, inclusive quando a cotação original já expirou. Mutations não têm retry automático. Após erro de rede ou timeout, a tela consulta o estado existente; se necessário, Reenviar mesma tentativa usa a mesma chave e o mesmo corpo.

Se a tentativa não chegou ao backend e sua cotação já não existe após refresh, a API recusa o reenvio e o cliente libera uma nova revisão. Dados do carrinho permanecem preservados.

## Cotação e conclusão

Antes de criar, a API verifica a conexão, a propriedade e o endereço/rede atual da carteira, a validade da cotação, assinatura do carrinho, disponibilidade, cupom e valores. Divergências exigem uma nova cotação e nova revisão.

O pedido guarda um snapshot de itens, quantidades, preços, descontos, taxa, total, dados do colecionador e carteira. O recibo lê esse snapshot, preservando os valores após mudanças no catálogo.

A simulação persiste o pedido pendente com prazo para decisão. Consultar após o prazo consolida confirmação/recusa. Estados terminais não regridem. A confirmação desconta apenas as quantidades compradas, preservando itens ou quantidades acrescentados depois. Recusa mantém o carrinho.

Carrinho, ajustes de estoque e um marcador de conclusão do pedido são gravados juntos na chave do carrinho. Se a gravação do estado final do pedido falhar depois disso, a próxima consulta reconhece o marcador e recupera a confirmação sem descontar novamente. Estoque e edições passam a refletir as compras no catálogo, detalhe e carrinho.

Pedidos e conexões são persistidos na chave `marketplace-nfts:mock-orders:v1`. `resetOrders`, em `src/data/mocks/database/orders-store.ts`, limpa essa base; `resetCarts` limpa carrinhos, ajustes de estoque e marcadores. Para um cenário totalmente limpo, execute ambos os resets e limpe tentativas do sessionStorage. Os demais resets de usuários, carteiras e cotações continuam independentes.

## Cenários

Configure no console, antes de iniciar a ação:

```js
localStorage.setItem("marketplace-nfts:payment-scenario", "payment-declined");
```

| Valor                  | Efeito                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| Sem chave              | Pedido pendente por aproximadamente 1,5 segundo, depois confirmado.                                         |
| `payment-declined`     | Pedido termina recusado, preservando os itens.                                                              |
| `wallet-refused`       | Recusa a conexão simulada da carteira.                                                                      |
| `timeout-after-create` | Cria o pedido e atrasa a resposta por 16 segundos; Axios expira aos 15. A consulta recupera o mesmo pedido. |
| `pending`              | Mantém o pedido pendente por aproximadamente um minuto.                                                     |
| `offline`              | Simula falha de conexão no envio/consulta pela chave da tentativa. Remover o cenário permite recuperar.     |

```js
localStorage.removeItem("marketplace-nfts:payment-scenario");
```

Para simular desconexão antes de enviar, use Desconectar carteira. Uma solicitação de pagamento já aceita pode continuar sendo consultada após perda da conexão do cliente.

## Interface, validação e limitações

O pagamento usa dados de perfil e carteiras pela API, campos do colecionador validados com React Hook Form/Zod, revisão explícita e indicação de cotação. O recibo só é exibido para pedido confirmado. O recibo exibe a identificação abreviada no formato `0xA91F…E82C`, preservando o valor completo no título e no link. O botão abre o explorador da rede em uma nova aba: Etherscan para Ethereum, Polygonscan para Polygon e Solana Explorer para Solana. As identificações geradas pelo mock não correspondem a transações reais, portanto não terão registro nesses serviços. A interface usa mensagens normais de compra e conexão; os detalhes da simulação permanecem nesta documentação.

Esta etapa usa consultas REST periódicas de um segundo enquanto o pedido está pendente. A integração obrigatória de eventos com Socket.IO ainda será feita; este polling não a substitui. Favoritos e seus testes E2E já estão integrados; os testes permanentes do pagamento e a auditoria Lighthouse continuam pendentes.

Sem abrir navegador, verificações temporárias da API cobriram idempotência concorrente, conflito de chave, isolamento entre usuários, pendência, confirmação, recusa, snapshot imutável, baixa única de estoque/carrinho, recusa/desconexão da carteira, cotação alterada e recuperação do mesmo pedido após timeout e falha intermediária de persistência. TypeScript, lint e build foram executados. Interações e fidelidade visual desta etapa ainda precisam da verificação no navegador e dos testes E2E permanentes.

## Ajuste de fidelidade do pagamento

O pagamento foi realinhado aos frames desktop e mobile do Figma: no desktop, formulário de duas colunas na ordem original e revisão com 405 px à direita, seguida de carteira/rede; no mobile, carteiras salvas e provedores aparecem primeiro, com os dados e a revisão no Accordion. Os campos de rede e tipo selecionam carteiras cadastradas compatíveis. Os provedores sem uma carteira cadastrada ficam desabilitados. Campos derivados da carteira são preenchidos pela API e não criam uma nova carteira no checkout.

Foi feita uma verificação temporária apenas deste fluxo, com captura desktop/mobile, alinhamento dos campos, coluna de revisão, ausência de overflow, preservação do formulário ao redimensionar, abertura do modal no desktop, conexão e pedido confirmado. A revisão explícita e os controles de conexão são estados funcionais adicionais ao frame estático. O footer continua exclusivo da página inicial, conforme a decisão do projeto.
