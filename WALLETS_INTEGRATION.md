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

Recebe os campos do formulário (sem `kind` obrigatório na atualização). Não aceita `userId` no corpo.

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

- Carrega carteiras do usuário autenticado e preenche os formulários.
- **Salvar** cria (`POST`) ou atualiza (`PATCH`) conforme a carteira já exista.
- **Adicionar** na secundária abre o formulário; na principal restaura os dados salvos ou o formulário vazio.
- **Igual à carteira principal** copia os valores da principal para a secundária.
- Exibe carregamento, erro com nova tentativa, envio e sucesso somente após confirmação da API.
- Erros 422 são associados aos campos. Valores preenchidos permanecem se a API falhar.

## Query keys

- `queryKeys.wallets.list(userId)`
- `queryKeys.wallets.create`
- `queryKeys.wallets.update`

## Cenários verificados

- Login como Luna: principal pré-preenchida; edição com `PATCH` e persistência após refresh.
- Login como Theo ou conta nova: formulários vazios; cadastro com `POST` sem dados da Luna.
- Isolamento: carteiras de um usuário não aparecem na sessão do outro.
- Secundária: Adicionar, copiar da principal, salvar e recarregar.
- 401 sem sessão; 422 com endereço/rede inválidos; 409 ao tentar criar segunda principal.
- Sucesso visual apenas após resposta 2xx.

Pendência: uso dessas carteiras no pagamento/checkout fica para outra etapa.
