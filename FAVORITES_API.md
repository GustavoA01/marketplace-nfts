# Favoritos

## Fluxo e autenticação

Favoritos exigem autenticação, conforme o enunciado. Visitantes abrem o modal no desktop, a partir de 1024 px, ou a página de login no mobile. A URL de origem, incluindo busca e filtros, é preservada. Depois de entrar, o usuário aciona novamente o coração para salvar. Não há lista de favoritos do visitante nem migração no login.

Os corações do catálogo e das recomendações no mobile, da galeria e do detalhe compartilham o estado remoto. O botão Favoritar do desktop também pode remover um favorito existente. O coração é um botão separado do link do card, com estado pressionado e nome acessível; clicar nele não navega para o detalhe.

A rota protegida `/favoritos` permite consultar e remover os itens salvos. Ela está ligada ao atalho mobile Favoritos e à Lista de interesse do menu da conta, usando os cards e componentes existentes. Trata carregamento, vazio, falha, nova tentativa e salvamento em andamento. Não foi criado um novo desenho no Figma para essa lista.

## REST

Todas as chamadas da interface passam pelo Axios em `src/services/favorites`. Os handlers MSW estão em `src/data/mocks/handlers/favorites`.

| Endpoint                       | Resposta                             | Comportamento                                                                             |
| ------------------------------ | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `GET /api/favorites`           | `{ nftIds: string[], items: NFT[] }` | Consulta somente os favoritos da sessão; os itens vêm do catálogo com estoque atualizado. |
| `PUT /api/favorites/:nftId`    | `{ nftId, isFavorite: true }`        | Inclui um NFT existente; repetir a inclusão mantém um único registro.                     |
| `DELETE /api/favorites/:nftId` | `{ nftId, isFavorite: false }`       | Remove o NFT; repetir a remoção continua retornando ausência.                             |

Sem sessão válida, retorna 401. O cliente expira o cookie apenas se a operação pertencer à sessão atual. NFT inexistente retorna 404. Erro de armazenamento ou cenário de falha retorna 503. Nenhuma operação aceita um usuário enviado pela interface; a propriedade é obtida exclusivamente da sessão.

## Cache e falhas

TanStack Query mantém uma consulta compartilhada por usuário, com chave `['favorites', 'list', userId]`. A consulta é cancelável por AbortSignal e usa o staleTime padrão de 60 segundos. Faz uma nova tentativa apenas para falhas de rede/servidor; erros HTTP abaixo de 500 não têm retry. Mutations não têm retry automático.

O coração muda antes da resposta da API. A mutation cancela consultas em andamento e guarda o estado anterior daquele NFT. Em falha, reverte somente esse NFT, preservando alterações concorrentes em outros itens. Cliques repetidos no mesmo NFT ficam bloqueados durante o envio. Após a última mutation em andamento do usuário, a consulta é invalidada para reconciliar com a API.

As respostas e o rollback só atualizam o cache se o usuário da operação ainda for o usuário ativo. Logout e troca de conta usam a limpeza de cache privado existente. Consultas e mutations carregam a identidade do proprietário nos metadados; um 401 atrasado de outra conta não encerra a sessão atual. Sessão expirada durante a mutation solicita login novamente, preservando a origem.

## Persistência e reset

O localStorage é usado exclusivamente pela base MSW, em `src/data/mocks/database/favorites.ts`. A chave versionada `marketplace-nfts:mock-favorites:v1` contém pares `{ userId, nftId }`. A interface não lê nem grava essa base diretamente. Cada conta começa com a lista vazia; os antigos corações preenchidos fixos das fixtures foram removidos.

`resetFavorites()` restaura a lista vazia de todas as contas. Para um reset manual no navegador, remova a chave e recarregue:

```js
localStorage.removeItem("marketplace-nfts:mock-favorites:v1");
localStorage.removeItem("marketplace-nfts:favorite-scenario");
location.reload();
```

## Cenários reproduzíveis

```js
localStorage.setItem("marketplace-nfts:favorite-scenario", "mutation-error");
```

| Valor                 | Efeito                                                                              |
| --------------------- | ----------------------------------------------------------------------------------- |
| Sem chave             | Latência de 150 ms e sucesso.                                                       |
| `slow`                | Latência de 2 segundos.                                                             |
| `mutation-error`      | GET funciona; inclusão e remoção falham com 503.                                    |
| `slow-mutation-error` | Falha de mutation com 2 segundos para observar a atualização otimista e o rollback. |
| `error`               | Consultas e mutations retornam 503.                                                 |
| `offline`             | Falha de conexão.                                                                   |

Remova a chave para recuperar o funcionamento normal. Expiração usa a sessão real dos mocks: remova o cookie `authToken` antes de favoritar, mantendo a página aberta.

## Testes

`tests/e2e/favorites.spec.ts` contém cenários desktop (1440 px) e mobile (390 px) para login com retorno, persistência da inclusão/remoção, atualização otimista com rollback e recuperação, logout/troca de usuário, falha de consulta e sessão expirada durante a mutation. Cada teste usa um contexto novo do navegador, com armazenamento isolado. As interações passam pela interface, Axios e handlers MSW.

```bash
npx playwright install chromium
npm run test:e2e -- favorites.spec.ts
```

Os demais fluxos E2E, regressão visual, Socket.IO e Lighthouse continuam independentes desta implementação.
