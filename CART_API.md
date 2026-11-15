# Carrinho — API e integração

O detalhe e o carrinho usam Axios, TanStack Query e MSW. Os dados de produtos vêm das mesmas fixtures do catálogo. A interface de carrinho não importa exemplos de compras de `temporary`.

## Contratos

| Endpoint                     | Corpo                          | Resposta                                                                       |
| ---------------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `GET /api/cart`              | —                              | HTTP 200 com `{ cart }`, inclusive vazio.                                      |
| `POST /api/cart/items`       | `{ nftId, edition, quantity }` | HTTP 201 para nova linha; 200 quando acumula na mesma combinação NFT/edição.   |
| `PATCH /api/cart/items/:id`  | `{ quantity }`                 | HTTP 200 com o carrinho atualizado. A quantidade enviada substitui a anterior. |
| `DELETE /api/cart/items/:id` | —                              | HTTP 200 com o carrinho atualizado.                                            |

`Cart` contém `items`, `totalQuantity`, `subtotal`, `currency: "ETH"` e `couponCode`.

Cada linha contém `id`, `nftId`, `edition`, `quantity`, `name`, `image`, `imageDescription`, `network`, `unitPrice`, `lineTotal`, `availableQuantity`, `maxQuantity` e `isAvailable`. O ID da linha permanece estável ao adicionar a mesma combinação. Edições diferentes ficam em linhas separadas.

Preços trafegam como strings decimais. Os cálculos usam inteiros em wei, com utilitários compartilhados em `src/lib/eth.ts`. A API fornece os valores confirmados; preços enviados pelo cliente são rejeitados. O subtotal ainda não inclui cupom ou taxa de rede.

## Estoque

O limite considera tanto o estoque geral do NFT quanto o estoque da edição, descontando a quantidade das outras linhas do mesmo NFT. Adicionar ao carrinho não reserva estoque.

`src/data/mocks/fixtures/nft-inventory.ts` define os limites específicos da simulação. Emerald Ape possui uma unidade de `1/1`, dez de `1/10`, até 42 de `1/50` e `ABERTA` esgotada. Para produtos sem configuração específica, `1/1` tem limite de uma unidade e as demais edições utilizam o estoque geral do NFT. Esses valores são fixtures da demonstração, sem verificação de blockchain.

O detalhe recebe `editionAvailability` pela API e desabilita edições esgotadas. Quantidades e botões respeitam o limite da seleção. O carrinho recalcula os limites a cada resposta. Linhas acima do estoque permanecem visíveis, sinalizadas para ajuste ou remoção.

## Visitante, usuário e login

O proprietário é identificado pela sessão; o cliente não envia `userId`.

Sem sessão, os endpoints usam o carrinho do visitante. Uma sessão enviada e inválida retorna HTTP 401, sem alterar o carrinho do visitante. Usuários autenticados possuem carrinhos separados. Alterar ou remover uma linha de outra conta retorna 404.

O armazenamento MSW utiliza a chave `marketplace-nfts:mock-carts:v1`, com `{ visitor, users, coupons }`. A versão anterior `marketplace-nfts:mock-visitor-cart:v1` é lida quando a nova chave ainda não existe, preservando itens da etapa anterior.

Após validar as credenciais, o handler de login une o visitante ao carrinho da conta. Combinações iguais somam quantidades, preservando o ID existente. A união e a limpeza do visitante são gravadas juntas em uma única operação de armazenamento. Repetir o login não reaplica a união. Quantidades acima do estoque são preservadas e sinalizadas, permitindo ao usuário ajustar a seleção.

Logout ou troca de conta não apagam os carrinhos persistidos das contas. O visitante volta ao seu próprio carrinho. Login futuro recupera o carrinho daquela conta.

Os caches incluem a identidade do proprietário. Respostas de mutations de uma sessão anterior não repopulam o cache da sessão atual. Na expiração, o cookie local inválido também é removido para permitir novas consultas como visitante. A limpeza de cache na perda de sessão preserva a consulta do visitante que acabou de iniciar.

## Interface e cache

“Comprar” adiciona a edição/quantidade selecionada e abre o carrinho. O ícone de carrinho no detalhe mobile adiciona sem sair da página. Sucesso só aparece após a resposta da API. O contador do header usa a quantidade total confirmada.

Consultas de carrinho são revalidadas ao montar e ao retornar o foco; o `AbortSignal` é enviado ao Axios. Leituras permitem uma nova tentativa em falhas transitórias, sem repetir erros 4xx. Mutations não são repetidas automaticamente. Controles ficam bloqueados durante a operação.

A alteração de quantidade usa a resposta confirmada da API. A remoção é otimista: cancela a leitura em andamento, guarda o carrinho anterior e recalcula o subtotal provisório. Se a API falhar, restaura o snapshot. Ao terminar, reconcilia o carrinho com uma nova consulta REST. Essa decisão segue a [estratégia de atualização otimista do TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates).

Há skeletons com shimmer, carrinho vazio, erro com nova tentativa, feedback de mutation e controles disponíveis em desktop e mobile. O subtotal permanece acessível e é atualizado com os valores da resposta.

## Cenários e reset

No console do navegador, configure e atualize a página:

```js
localStorage.setItem("marketplace-nfts:cart-scenario", "mutation-error");
```

| Valor            | Resultado                                                                          |
| ---------------- | ---------------------------------------------------------------------------------- |
| Sem chave        | Sucesso com latência de 150 ms.                                                    |
| `slow`           | Latência de dois segundos.                                                         |
| `error`          | HTTP 503 em consultas e mutations.                                                 |
| `mutation-error` | Consultas funcionam; escritas retornam 503. Permite verificar rollback da remoção. |
| `offline`        | Erro de conexão do MSW.                                                            |

Para recuperar, remova a chave e tente a ação novamente:

```js
localStorage.removeItem("marketplace-nfts:cart-scenario");
```

`resetCarts`, em `src/data/mocks/database/cart-storage.ts`, restaura todos os carrinhos vazios. `resetVisitorCart` limpa apenas o visitante. Para reset manual no navegador:

```js
localStorage.setItem(
  "marketplace-nfts:mock-carts:v1",
  JSON.stringify({ visitor: [], users: {} }),
);
```

Atualize a página depois do reset manual para descartar o cache em memória.

## Erros

As falhas retornam `{ code, message, errors? }`: 400 para JSON inválido, 422 para campos inválidos ou extras, 404 para NFT/linha inexistente ou linha de outra conta, 409 para edição esgotada ou estoque insuficiente, 401 para sessão inválida e 503 para falha de persistência/rede simulada. Requisições rejeitadas não alteram os itens.

## Cotação e próximos passos

Cupom, desconto, taxa estimada e total estão integrados. Veja [os contratos e cenários de cotação](./QUOTES_API.md). O cálculo utiliza a API e rejeita uma assinatura de carrinho desatualizada.

Pagamento e pedidos estão integrados ao fluxo descrito em PAYMENT_FLOW.md. Socket.IO atualiza preço e disponibilidade, com testes permanentes de revisão, esgotamento e reconexão. Veja [contratos e cenários](./REALTIME.md). A cobertura E2E específica de todas as operações do carrinho ainda deve ser ampliada. O botão de finalizar abre o pagamento quando há cotação disponível. Veja [o fluxo de pagamento e pedidos](./PAYMENT_FLOW.md).

## Verificações executadas

Foram executadas verificações temporárias de API com MSW e da interface com Playwright. Cobertura: adicionar a seleção do detalhe; contador do header; alteração de quantidade e subtotal; persistência após refresh; remoção otimista, rollback e recuperação; união ao fazer login; logout e troca de usuário; expiração de sessão; edição esgotada; limite de quantidade por edição; falha de consulta com nova tentativa; skeleton; isolamento de permissões e inclusões sem perda dos itens.

As larguras 390, 768, 1024 e 1440 foram conferidas sem overflow horizontal. Essas verificações não representam a suíte E2E permanente exigida na entrega, que ainda será implementada.
