# Cotação e cupom

O carrinho apresenta subtotal, desconto, taxa estimada e total da API simulada. A cotação não cria um pedido e não confirma pagamento.

## Endpoints

| Operação                  | Corpo                         | Resultado                                             |
| ------------------------- | ----------------------------- | ----------------------------------------------------- |
| `POST /api/cart/coupon`   | `{ code: "KURIO10" }`         | `{ cart }`, com o código normalizado e persistido.    |
| `DELETE /api/cart/coupon` | —                             | `{ cart }`, com `couponCode: null`.                   |
| `POST /api/quotes`        | `{ cartSignature, network? }` | `{ quote }` com preços e disponibilidade revalidados. |

Os endpoints usam o proprietário da sessão, ou o visitante quando não há sessão. Código de usuário no corpo não é aceito. Uma sessão inválida retorna 401. A sessão é verificada novamente após a latência simulada, antes de acessar ou alterar dados.

A assinatura do carrinho é produzida por `cartSignature`, em `src/lib/cart.ts`, e inclui IDs, edições, quantidades, preços, disponibilidade, redes e cupom. A API calcula sua própria assinatura a partir dos dados atuais. Divergência retorna 409 `CART_CHANGED`, com o carrinho atualizado. O cliente substitui o cache daquele proprietário e solicita uma nova cotação.

`network` aceita `ethereum`, `polygon` ou `solana`. Quando omitida, usa a rede do primeiro item. Essa rede é uma estimativa exibida no carrinho; no pagamento, a seleção de carteira/rede deverá solicitar e confirmar a cotação correspondente.

`Quote` contém `id`, `cartSignature`, `createdAt`, `expiresAt`, `network`, `couponCode`, snapshot de `items` e `summary`, com `subtotal`, `discount`, `networkFee` e `total`.

## Cupons e taxas da demonstração

| Código         | Comportamento                                                        |
| -------------- | -------------------------------------------------------------------- |
| `KURIO10`      | Desconto de 10% no subtotal dos itens, sem descontar a taxa de rede. |
| `EXPIRADO`     | Retorna 422 `COUPON_EXPIRED`.                                        |
| Outros códigos | Retornam 422 `COUPON_INVALID`.                                       |

Os códigos ignoram caixa e espaços nas extremidades. Cupom inválido, expirado ou erro de persistência não removem um cupom anterior nem alteram os itens. O código aplicado é salvo por proprietário e acompanha a união do visitante no login quando a conta ainda não possui um cupom.

As taxas são fixtures determinísticas: Ethereum `0.003` ETH, Polygon `0.0001` ETH e Solana `0.00005` ETH. Não representam taxas reais das redes.

Todos os valores monetários trafegam como strings decimais. Desconto e total são calculados com inteiros em wei. Frações de desconto inferiores a um wei são arredondadas para baixo. Exemplo: subtotal `1.19`, desconto `0.119` e taxa `0.003` resultam em total `1.074` ETH.

## Disponibilidade, validade e snapshots

Carrinho vazio retorna 409 `EMPTY_CART`. Edição indisponível ou quantidade acima do estoque retorna 409 `INSUFFICIENT_STOCK`, com o carrinho atual. Nessas condições a interface pede ajuste dos itens.

A cotação vale por cinco minutos. Os snapshots são independentes das fixtures: alterações posteriores no catálogo não modificam seus valores. `getQuoteForUser` só recupera uma cotação do mesmo proprietário e ainda válida. As últimas cotações ficam em memória do MSW, com remoção de expiradas e limite de 100 registros; após refresh a interface solicita uma nova cotação. Carrinho e cupom permanecem no localStorage.

O pagamento futuro deverá comparar assinatura, validade e disponibilidade antes de aceitar uma cotação e exigir nova confirmação quando os valores mudarem. A criação idempotente de pedidos, pagamento e recibo continuam como próxima etapa.

## Cache e erros na interface

As chaves incluem proprietário, assinatura do carrinho e rede. A consulta passa o AbortSignal ao Axios para descartar respostas obsoletas. A cotação tem `staleTime` de dez segundos e atualização a cada minuto enquanto ativa. Falhas transitórias permitem uma nova tentativa; erros 4xx não são repetidos automaticamente.

Alterar itens ou cupom muda a assinatura e solicita novos valores. Durante mutations do carrinho, a consulta aguarda a resposta confirmada. O resumo apresenta skeleton ao calcular, indicador durante atualização e recuperação por “Recalcular valores”. Erros de cupom são associados ao campo e preservam o texto informado.

Aplicar e remover cupom não possuem retries automáticos. Os cenários `error`, `offline`, `slow` e `mutation-error` da chave `marketplace-nfts:cart-scenario` também exercitam estes endpoints. `resetQuotes`, em `src/data/mocks/database/quotes.ts`, limpa as cotações em memória. `resetCarts` limpa os carrinhos e os cupons persistidos.

## Revisão e validação desta etapa

Foram corrigidas duas condições no carrinho: uma sessão expirada durante a latência não pode concluir uma escrita, e a resposta de uma mutation é calculada antes da persistência para evitar gravação parcial seguida de erro.

Verificações temporárias com MSW cobriram valores exatos, taxas por rede, aplicação/remoção/persistência do cupom, código inválido e expirado, assinatura desatualizada, snapshots, permissões, união no login, expiração durante a latência, estoque insuficiente, arredondamento em wei e falha sem alteração do estado. TypeScript, lint e build também foram executados. A interface não foi aberta no navegador nesta etapa, conforme solicitado.
