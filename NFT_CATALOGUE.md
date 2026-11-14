# Catálogo e detalhes dos NFTs

O catálogo e o detalhe consultam a mesma fixture `src/data/mocks/fixtures/nfts.ts`, preparada pelo Cursor. Os dados complementares da galeria e dos detalhes de Emerald Ape estão em `src/data/mocks/fixtures/nft-details.ts`. Os componentes não importam essas fixtures: as chamadas passam pelo Axios e são interceptadas pelo MSW.

## Contratos REST

`GET /api/nfts` retorna `NFTListResponse`, definido em `src/data/types/catalogue.ts`.

| Parâmetro              | Comportamento                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| `q`                    | Busca parcial por nome, coleção ou criador, ignorando caixa e acentos; até 120 caracteres. |
| `category`             | Categorias selecionadas. O parâmetro pode ser repetido.                                    |
| `network`              | Redes selecionadas. O parâmetro pode ser repetido.                                         |
| `minPrice`, `maxPrice` | Limites inclusivos em ETH.                                                                 |
| `sort`                 | `recent` (padrão), `price-asc` ou `price-desc`.                                            |
| `tab`                  | `all` (padrão), `new` ou `trending`.                                                       |
| `page`                 | Inteiro positivo; padrão 1. Cada página contém até 9 itens.                                |

A resposta contém `items`, `total`, `page`, `pageSize`, `totalPages` e `filters`, com categorias, redes e contagens reais do catálogo completo. Valores da mesma dimensão são combinados com OU; dimensões diferentes são combinadas com E. Preço é comparado numericamente. Empates são resolvidos pelo ID para estabilizar a paginação.

Na simulação, novos lançamentos são os itens publicados nos 30 dias anteriores à data mais recente das fixtures. Essa referência mantém o cenário reproduzível independentemente do dia de execução. Em alta utiliza o campo `trending`.

Resultado vazio é HTTP 200, com `items: []` e `total: 0`. Uma página além da última também retorna itens vazios, preservando o total real. Parâmetros inválidos ou preços invertidos enviados diretamente à API retornam HTTP 400 com `message`.

`GET /api/nfts/:id` retorna `NFTDetail`, com os dados do NFT, galeria, edição inicial e metadados. IDs inexistentes retornam HTTP 404 com `message`. Campos de avaliações são opcionais; a interface só os exibe quando presentes na resposta.

## URL, consultas e interação

O TanStack Router valida os parâmetros da página inicial. Busca, categorias, redes, preços, aba, ordenação e página permanecem na URL. O Router serializa arrays no formato JSON; o Axios serializa os filtros da API como parâmetros repetidos.

A busca é enviada por Enter ou pelo botão da lupa. No desktop, o ícone do header abre um Dialog do shadcn/ui. No mobile, o campo existente é utilizado. Aplicar busca, filtro, aba ou ordenação reinicia a página. Alterar a página mantém os outros parâmetros. Navegação não substitui o histórico, permitindo retornar com Voltar.

As chaves das consultas incluem os parâmetros ou o ID do NFT. O cache público usa a política global de 60 segundos de `staleTime` e uma nova tentativa em falhas. O detalhe não repete erros 404. O `AbortSignal` do TanStack Query chega ao Axios, cancelando requisições obsoletas. Durante a troca de consulta, os metadados anteriores mantêm os filtros disponíveis, enquanto os cards mostram skeletons. Atualizações em segundo plano indicam estado ocupado.

Catálogo e detalhe possuem carregamento, erro com nova tentativa e tratamento de vazio/404. Os skeletons têm shimmer e respeitam movimento reduzido. A edição selecionada e a quantidade são estado da página de detalhe; a quantidade respeita o estoque do NFT. Estoque e disponibilidade por edição ainda serão tratados na integração do carrinho.

Os itens de “Mais desta coleção” também vêm da API, pela busca da coleção, excluindo o NFT atual.

## Cenários de rede

Com `VITE_ENABLE_MOCKS=true`, use a chave abaixo no console do navegador e atualize a página:

```js
localStorage.setItem("marketplace-nfts:catalogue-scenario", "error");
```

| Valor          | Resultado                                                                   |
| -------------- | --------------------------------------------------------------------------- |
| Sem chave      | Sucesso com latência de 250 ms.                                             |
| `empty`        | Listagem vazia.                                                             |
| `error`        | HTTP 503, com nova tentativa na interface.                                  |
| `offline`      | Falha de conexão simulada pelo MSW.                                         |
| `slow`         | Resposta após 2 segundos.                                                   |
| `timeout`      | Resposta após 16 segundos, ultrapassando o timeout de 15 segundos do Axios. |
| `out-of-order` | Consultas com menos de 4 caracteres levam 1,5 segundo; as demais, 150 ms.   |

Para restaurar:

```js
localStorage.removeItem("marketplace-nfts:catalogue-scenario");
```

Remover a chave e clicar em Tentar novamente também permite conferir a recuperação sem refresh. A configuração fica exclusivamente no MSW, sem respostas fictícias ou caminhos alternativos nos serviços e componentes.

## Validação desta etapa

Foram feitas verificações temporárias da API com MSW e da interface com Playwright, incluindo filtros combinados, paginação sem repetição, ordenação numérica, erro/recuperação, acesso direto ao detalhe, 404, refresh, histórico, seleção de edição e limite de quantidade. O cancelamento de uma consulta antiga foi verificado com QueryObserver e respostas de latências diferentes. As larguras 390, 768 e 1440 foram verificadas sem overflow horizontal.

Essas verificações não substituem a suíte E2E permanente e as baselines visuais, que continuam como uma etapa própria. Favoritos, compra, carrinho, disponibilidade por edição e Socket.IO não foram implementados nesta etapa.
