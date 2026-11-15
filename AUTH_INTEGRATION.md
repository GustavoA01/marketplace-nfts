# Autenticação, cadastro, perfil e carteiras

O cadastro já utiliza Axios, TanStack Query e MSW para validar e persistir usuários na simulação. Login, consulta e encerramento de sessão também estão integrados. Perfil e carteiras ainda têm dados e salvamentos demonstrativos.

## Como executar o cadastro

Use `VITE_ENABLE_MOCKS=true` e `VITE_API_URL=/api` em `.env.local`. Reinicie o Vite após configurar o ambiente e abra `/cadastro`, ou a aba Criar conta no diálogo do Header.

O cadastro não autentica automaticamente. Após criar a conta, a interface orienta o usuário a entrar. O login consulta a mesma base do cadastro, verifica a senha e cria uma sessão vinculada ao usuário.

## De onde vem a lista de usuários

- `src/data/mocks/fixtures/users.ts`: dados iniciais de dois usuários fictícios.
- `src/data/mocks/database/users.ts`: base compartilhada que consulta, cria, persiste e restaura usuários.
- `src/data/mocks/utils/password.ts`: gera hash e salt de uma senha.
- `src/data/mocks/handlers/auth.ts`: recebe a requisição, valida os dados e chama `createUser`.
- `src/services/auth/sign-up.ts`: faz a chamada Axios e retorna a resposta tipada.
- `src/features/Auth/container/SignUpForm.tsx`: executa a mutation e associa erros da API aos campos.

O handler não contém uma lista isolada de usuários. Ele consulta a base compartilhada. Essa mesma base poderá ser usada pelo login na próxima etapa.

## Contrato implementado

`POST /api/auth/register` recebe JSON com `username`, `email`, `password` e `confirmPassword`.

| Status | Resultado                                                    |
| ------ | ------------------------------------------------------------ |
| 201    | Conta criada; retorna `{ user: { id, username, email } }`    |
| 400    | JSON malformado                                              |
| 422    | Dados inválidos; retorna mensagem e erros por campo          |
| 409    | E-mail já cadastrado; retorna erro associado ao campo e-mail |
| 503    | Não foi possível salvar o cadastro                           |

E-mails são normalizados com remoção de espaços nas extremidades e conversão para minúsculas. A duplicidade é conferida novamente após o hash para impedir que duas requisições simultâneas no mesmo contexto criem contas com o mesmo e-mail.

O formulário mostra sucesso somente após a resposta 201, bloqueia o botão durante a requisição e exibe erros do servidor. A mutation não realiza retries automáticos.

## Persistência e senhas

No navegador, os usuários ficam na chave `marketplace-nfts:mock-users:v1` do localStorage e sobrevivem ao refresh. `resetUsers()` restaura as fixtures. Em execução Node sem navegador, a base utiliza memória.

As senhas são representadas por PBKDF2 com SHA-256, 600.000 iterações e salt aleatório por cadastro, usando Web Crypto. Os registros guardam apenas hash e salt; a resposta pública não inclui senha, confirmação, hash ou salt. Esta base é exclusiva da simulação, não um backend de produção.

Credenciais fictícias iniciais para a futura integração de login:

| E-mail           | Senha de demonstração |
| ---------------- | --------------------- |
| luna@example.com | Colecionador123!      |
| theo@example.com | Colecionador123!      |

Referências: [Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveBits), [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2).

## Interfaces e validações já existentes

- Login: página e diálogo, validação local, Axios/TanStack Query, conferência de credenciais na base compartilhada e mensagens de sucesso/erro.
- Cadastro: mesmos recursos, com envio à API simulada e tratamento dos erros retornados.
- Perfil: dados, ENS, apelido, alteração de senha e mudança visual de avatar; integração com a API simulada.
- Carteiras: principal e secundária integradas à API simulada; detalhes em `WALLETS_INTEGRATION.md`.
- Navegação de conta e navegação inferior mobile compartilhadas.

A lógica e a composição de perfil e carteiras ficam nos respectivos `index.tsx`, e seus componentes exclusivos nas pastas `-components`. A feature Auth continua compartilhada entre login, cadastro e diálogo do Header.

## Sessão por cookie

- `src/data/mocks/database/sessions.ts`: sessões com identificador aleatório, usuário e expiração de 30 minutos; persistência em `marketplace-nfts:mock-sessions:v1` e função `resetSessions()`.
- `POST /api/auth/login`: retorna o usuário público e define `authToken` com identificador único, `Path=/`, `SameSite=Lax` e `Max-Age=1800`. HTTPS acrescenta `Secure`. O login bem-sucedido substitui a sessão anterior daquele cookie.
- `GET /api/auth/session`: usa o cookie para consultar a sessão e o usuário; retorna `{ user }` ou 401 quando ausente, inválida ou expirada. Falhas da base retornam 503.
- `DELETE /api/auth/logout`: invalida a sessão, expira o cookie e retorna 204. Repetir logout sem sessão é permitido.
- `src/services/auth/session.ts` e `logout.ts`: chamadas Axios. Apenas o 401 da consulta é convertido em visitante (`null`); erro de rede/503 continua sendo erro.

O MSW simula os cookies no navegador. Isso não equivale à proteção de um cookie HttpOnly emitido por um backend real; esta limitação deve permanecer explícita na entrega. Referência: [cookies no MSW](https://mswjs.io/docs/http/mocking-responses/cookies).

## TanStack Query e navegação

`useSession()` retorna a query cujo `data` é o usuário público, `null` para visitante e `undefined` no carregamento inicial. Header e layout utilizam o mesmo cache pelo QueryClientProvider já existente; não há AuthProvider separado.

As chaves estão em `src/data/query-keys.ts`. A sessão tem staleTime de 30 segundos, reconferência periódica de 30 segundos e reconferência ao retornar o foco à janela. A entrada em rotas privadas sempre consulta novamente a API.

O login atualiza a query da sessão. O Header mostra o username e desmonta o diálogo de autenticação. Login por página retorna ao destino interno informado em `redirect`, com a Home como destino padrão no mobile e `/perfil` no desktop. Endereços externos e retorno para login/cadastro não são aceitos.

Perfil, carteiras, pagamento e confirmação possuem `beforeLoad` com validação de sessão. Visitantes vão para `/login` com o destino preservado. Se a sessão desaparecer durante a navegação, o layout também solicita novo login. Isso preserva o destino, não implementa ainda persistência dos formulários de checkout.

Logout navega ao início e publica `null` na query. Login/troca de usuário, logout e perda de sessão cancelam requisições e limpam queries fora da sessão e o cache de mutations. A política atual é conservadora e também remove caches públicos; as bases canônicas dos mocks permanecem. Respostas 401 de outras queries/mutations encerram o estado de autenticação; erros de credenciais no próprio login não apagam uma sessão válida anterior.

O botão Sair usa `useLogout()`. Socket.IO e limpeza das suas futuras subscriptions serão implementados na etapa de tempo real.

## Próximas etapas

- Completar favoritos, carrinho, cotações e pedidos.
- Integrar as carteiras salvas ao pagamento/checkout.
- Completar cenários determinísticos de falha, Socket.IO, testes Playwright e baselines visuais.

OAuth e blockchain reais não fazem parte da entrega. Atividade, ofertas, downloads e suporte não exigem páginas completas.

## Verificação do cadastro

Foram verificadas chamadas HTTP passando pelos handlers MSW: JSON inválido, validação de campos, criação, conflito com usuário inicial, normalização de e-mail, tentativas simultâneas, resposta pública sem credenciais, hash, armazenamento e reset.

Os testes E2E permanentes continuam como etapa separada. Os comandos gerais de verificação são `npm run lint`, `npm run build` e `npm run format:check`.

Também foram verificados login correto/incorreto, cookies distintos, isolamento de sessões, troca de usuário, expiração, logout, limpeza de cache, proteção de rotas e validação do destino de retorno.

## Perfil sem carteira

Novos usuários começam com apelido da carteira e nome ENS vazios. O sufixo `.eth` é somente a opção inicial do seletor e não representa um ENS registrado ou uma carteira criada. Apelido e ENS são metadados opcionais do perfil e não impedem salvar dados pessoais, avatar ou senha. Preencher esses campos não cadastra uma carteira; os registros utilizados no pagamento continuam na API de carteiras.

Para perfis persistidos pelo cadastro antigo, a resposta do perfil trata o valor automático `Carteira principal` como vazio quando não existe carteira principal cadastrada para aquele usuário. Nomes personalizados e os demais dados são preservados; não é necessário limpar a base de usuários. Os dados pessoais continuam vindo do cadastro da própria conta.
