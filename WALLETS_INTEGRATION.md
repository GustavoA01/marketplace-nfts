# Integração de carteiras

Cadastro e edição das carteiras principal e secundária via Axios, TanStack Query e MSW. A propriedade vem só da sessão autenticada.

## Como executar

Use `VITE_ENABLE_MOCKS=true` e `VITE_API_URL=/api` em `.env.local`. Reinicie o Vite, entre com um usuário e abra `/carteiras`.

Credenciais iniciais:

| E-mail           | Senha            |
| ---------------- | ---------------- |
| luna@example.com | Colecionador123! |
| theo@example.com | Colecionador123! |

A Luna inicia com uma carteira principal nas fixtures. Contas novas e o Theo começam sem carteiras.

## Camadas

- `src/data/mocks/fixtures/wallets.ts`: semente estática por usuário.
- `src/data/mocks/database/wallets.ts`: leitura, criação, atualização, persistência e `resetWallets()`.
- `src/data/mocks/handlers/wallets/`: GET, POST e PATCH com a mesma autenticação de perfil (`requestSessionId` + `getSessionUser`).
- `src/data/mocks/scenarios/wallets.ts`: latência e falhas determinísticas.
- `src/services/wallets/`: chamadas Axios.
- `src/pages/carteiras/`: consulta, mutations, formulários e feedback de status.

Componentes e serviços não acessam `localStorage` nem a pasta `database/` diretamente.

## Contrato

### `GET /api/wallets`

Retorna `{ wallets: Wallet[] }` do usuário da sessão.

| Status | Resultado                            |
| ------ | ------------------------------------ |
| 200    | Lista de carteiras (pode ser vazia)  |
| 401    | Sessão ausente, inválida ou expirada |
| 503    | Falha ao carregar                    |

### `POST /api/wallets`

Recebe os campos do formulário e `kind` (`"main"` \| `"secondary"`). Não aceita `userId` no corpo.

Retorna `{ wallet: Wallet }`.

| Status | Resultado                                           |
| ------ | --------------------------------------------------- |
| 201    | Carteira criada                                     |
| 400    | JSON inválido ou `userId` enviado no corpo          |
| 401    | Sessão inválida                                     |
| 409    | Já existe carteira com aquele `kind` para o usuário |
| 422    | Dados inválidos; erros por campo                    |
| 503    | Falha ao salvar                                     |

### `PATCH /api/wallets/:id`

Recebe os campos do formulário. Não aceita `userId` no corpo.

Retorna `{ wallet: Wallet }`.

| Status | Resultado                                  |
| ------ | ------------------------------------------ |
| 200    | Carteira atualizada                        |
| 400    | JSON inválido ou `userId` enviado no corpo |
| 401    | Sessão inválida                            |
| 404    | Carteira inexistente ou de outro usuário   |
| 422    | Dados inválidos; erros por campo           |
| 503    | Falha ao salvar                            |

`Wallet` contém `id`, `kind` e os dados do formulário: `displayName`, `alias`, `network`, `profileName`, `address`, `secondaryAddress`, `walletType`, `referralCode`, `email`, `ensSuffix`, `ensName`.

## Validação

- Redes: `ethereum`, `polygon`, `solana`.
- Tipos: `metamask`, `walletconnect`, `coinbase`.
- Endereço Ethereum/Polygon: `0x` + 40 hexadecimais.
- Endereço Solana: Base58 com 32 a 44 caracteres.
- Indicação e ENS são opcionais.
- Cada usuário pode ter no máximo uma principal e uma secundária.

## Persistência

Chave `marketplace-nfts:mock-wallets:v1` no `localStorage`. `resetWallets()` restaura as fixtures. Em Node sem `window`, a base usa memória.

## Interface

- Skeleton com shimmer no carregamento inicial.
- **Salvar carteira** no cadastro e **Salvar alterações** na edição; cria (`POST`) ou atualiza (`PATCH`).
- A principal não exibe “Adicionar”; o formulário já fica visível.
- Na secundária, “Adicionar” aparece só quando ainda não há carteira e o formulário está fechado.
- **Igual à carteira principal** sincroniza os campos com o formulário principal enquanto marcado, sem salvar sozinho. O envio usa os valores sincronizados mesmo com campos desabilitados.
- Salvar um formulário não sobrescreve edições pendentes no outro; refetch também respeita `isDirty`.
- Sucesso só após confirmação da API. Erros de campo e a mensagem geral da API são exibidos; valores preenchidos permanecem.
- Mutations capturam o `ownerId` da sessão; respostas após logout ou troca de usuário não atualizam cache nem UI.

## Query keys

- `queryKeys.wallets.list(userId)`
- `queryKeys.wallets.create`
- `queryKeys.wallets.update`

## Cenários de rede

Com `VITE_ENABLE_MOCKS=true`, use a chave abaixo no console e atualize `/carteiras`:

```js
localStorage.setItem("marketplace-nfts:wallet-scenario", "error");
```

| Valor            | Resultado                             |
| ---------------- | ------------------------------------- |
| Sem chave        | Sucesso com latência de 150 ms.       |
| `slow`           | Resposta após 2 segundos.             |
| `error`          | HTTP 503 em GET/POST/PATCH.           |
| `mutation-error` | GET ok; POST/PATCH retornam HTTP 503. |
| `offline`        | Falha de conexão simulada pelo MSW.   |

A sessão é revalidada **depois** da latência e **antes** da operação. Para restaurar:

```js
localStorage.removeItem("marketplace-nfts:wallet-scenario");
```

`resetWallets()` restaura as fixtures de carteiras.

## Como verificar

1. Luna: editar principal, ver “Salvar alterações”, persistir com refresh.
2. Theo/conta nova: cadastrar principal com “Salvar carteira”.
3. Editar um formulário, salvar o outro e confirmar que as edições pendentes permanecem.
4. Marcar “Igual à carteira principal”, alterar a principal e conferir a sincronização; salvar a secundária com campos desabilitados.
5. Forçar 422/409 e conferir mensagem geral + erros de campo.
6. Com `slow`, trocar de usuário ou sair antes da resposta e confirmar que o cache não é repovoado indevidamente.
7. Ativar `error`/`offline`/`mutation-error` e usar “Tentar novamente”.

Pendência: consumo dessas carteiras no pagamento/checkout fica com a etapa de pedidos.
