# Marketplace NFTs

Marketplace de NFTs com React, TypeScript, Vite e API simulada com MSW.

## Executar no Ubuntu

```bash
cd ~/Projetos/marketplace-nfts
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

## Páginas

O plugin do TanStack Router lê `src/pages` e gera `src/routeTree.gen.ts` ao iniciar o Vite.
As pastas organizam as rotas; `index.tsx` representa a página de cada pasta.
O grupo `(inicio)` organiza a página inicial sem adicionar um segmento à URL.

| Pasta em src/pages | URL                   | Tela                   |
| ------------------ | --------------------- | ---------------------- |
| (inicio)           | /                     | Início                 |
| nfts/$nftId        | /nfts/emerald-ape-042 | Detalhes do NFT        |
| carrinho           | /carrinho             | Carrinho de NFTs       |
| pagamento          | /pagamento            | Pagamento              |
| confirmacao-pedido | /confirmacao-pedido   | Confirmação de pedido  |
| login              | /login                | Login                  |
| cadastro           | /cadastro             | Cadastro               |
| perfil             | /perfil               | Perfil do colecionador |
| carteiras          | /carteiras            | Carteiras              |
| favoritos          | /favoritos            | Favoritos              |

## Stack e preparação

- React e TypeScript para as páginas; Vite para desenvolvimento e build.
- TanStack Router com rotas por arquivo em `src/pages`.
- TanStack Query com provider e cliente em `src/lib/query-client.ts`.
- Axios com cliente REST em `src/lib/http.ts` e serviços de autenticação e NFTs em `src/services`.
- Socket.IO com cliente em `src/lib/socketio.ts`, eventos de NFT/pedido, isolamento por sessão e reconciliação REST. O MSW simula o protocolo pela mesma origem, sem servidor adicional.
- Tailwind CSS e componentes oficiais shadcn/ui em `src/components/ui`. Os estilos auxiliares gerados estão em `src/styles/shadcn.css`; o CLI pode ser executado com `npx shadcn@latest add <componente>`.
- MSW configurado em `src/data/mocks`, ativado por `VITE_ENABLE_MOCKS=true`. O worker está em `public/mockServiceWorker.js`. Conta, catálogo, favoritos, carrinho, cotações, perfil, carteiras e pedidos possuem handlers com estado consistente. A flag também deve estar ativa no build de demonstração.
- Playwright configurado em `playwright.config.ts`, com testes E2E em `tests/e2e` e relatório HTML/traces. Baselines visuais ainda precisam ser adicionadas (marcar testes visuais com `@visual`). Instalar o navegador com `npx playwright install chromium` antes de executar os testes.
- Lighthouse instalado para auditorias locais. Com o preview rodando, executar `npm run audit:lighthouse`. Requer Chrome/Chromium instalado; definir `CHROME_PATH` se necessário.

O cadastro utiliza Axios, TanStack Query e MSW, com persistência local dos usuários simulados. Login e sessão por cookie também estão integrados. Compras, perfil/carteiras e eventos Socket.IO estão integrados. Veja as decisões e limitações em [ARCHITECTURE.md](./ARCHITECTURE.md).
Há testes E2E permanentes de favoritos para desktop e mobile. A cobertura dos demais fluxos e as baselines visuais continuam pendentes.

## Comandos

```bash
npm run build
npm run typecheck
npm run lint
npm run preview -- --host 127.0.0.1
npm run test:e2e
npm run test:visual
npm run audit:lighthouse
```

Copie `.env.example` para `.env.local` para ativar a API simulada e reinicie o Vite. Variáveis `VITE_` ficam públicas no navegador e não devem conter segredos.

## Tema

A paleta está em `src/index.css`, com tokens CSS e utilitários Tailwind como `bg-primary`, `bg-primary-light`, `bg-surface-card`, `border-border-soft` e `text-success`. O tema escuro usa Ink como fundo principal; Background Elevated fica disponível como token independente. Primary, Primary Light e Primary Dark seguem os valores fornecidos; as demais cores foram amostradas do centro dos círculos da imagem de referência.

Funções e componentes seguem o padrão arrow function.

## Organização

- `src/components`: componentes compartilhados entre páginas.
- `src/pages/(inicio)/-components`: componentes exclusivos do Início. O prefixo `-` exclui esses arquivos do roteamento automático.
- `src/features/<NomeDaFeature>/container`: lógica, hooks e composição de funcionalidades maiores.
- `src/features/<NomeDaFeature>/components`: apresentação por props, sem regras de negócio.
- `hooks`, `tests` e `utils`: pastas opcionais dentro de cada feature, conforme a necessidade.

Cada feature possui container e components; componentes simples fora de features não exigem essa estrutura. Componentes usam PascalCase e arrow functions; evite arquivos muito grandes e divida responsabilidades quando necessário, sem limite rígido de linhas.

Header e Hero usam Roboto Mono local e assets exportados da cópia do Figma. Os textos auxiliares do Hero seguem 14px conforme o arquivo de design. A largura máxima de 1264px inclui 64px de padding horizontal, preservando os 1200px de conteúdo do frame desktop junto à classe container.

## Catálogo visual

Os dados temporários do catálogo e dos filtros são arrays de objetos em `src/data/mocks/temporary/catalogue.ts` e `src/data/mocks/temporary/catalogue-filters.ts`. As imagens exportadas do Figma ficam em `public/mocks`.

`src/components/NFTCard.tsx` é compartilhado: o mesmo padrão visual aparece no Início e nas recomendações de Detalhes e Carrinho. Ele recebe os dados por props. O fundo retangular das imagens foi preservado conforme as camadas do Figma.

Os filtros, a composição do catálogo, toolbar, banner e paginação ficam em `src/pages/(inicio)/-components`, pois são exclusivos dessa página. No mobile, o painel abre em um Dialog shadcn/ui.

A seção consulta a API MSW, combina filtros e mantém busca, ordenação e paginação na URL. Os cards recebem os dados retornados pelos serviços Axios. O controle de ordenação tem espaço adicional para evitar a sobreposição de texto e ícone presente no desenho.

## Formatação e pre-commit

Prettier utiliza ponto e vírgula, aspas duplas e finais de linha LF.

- `npm run format`: formata todos os arquivos suportados do projeto.
- `npm run format:check`: verifica a formatação de todos os arquivos suportados.

O Husky configura os hooks por meio do script `prepare` durante a instalação. O pre-commit executa `npm run format:check` e bloqueia o commit se houver arquivos fora do padrão. Execute `npm run format`, revise e adicione as alterações desejadas ao Git antes de tentar novamente.

Assets em public, dependências, artefatos de build, relatórios e a árvore de rotas gerada estão excluídos da formatação.

## Cadastro com MSW

Copie `.env.example` para `.env.local`, mantenha `VITE_ENABLE_MOCKS=true` e reinicie o Vite. Acesse `/cadastro`, preencha os dados e envie o formulário. O cadastro utiliza Axios e TanStack Query; o MSW valida e salva o usuário na base local da simulação.

Tentar cadastrar novamente o mesmo e-mail retorna conflito 409 e uma mensagem no campo. Os cadastros permanecem após refresh. Há dois usuários iniciais: `luna@example.com` e `theo@example.com`, com senha fictícia `Colecionador123!`. Os hashes e salts estão em `src/data/mocks/fixtures/users.ts`; o estado fica em `src/data/mocks/database/users.ts`. Login consulta a mesma base e mantém sessão por cookie; logout encerra a sessão. Consulte `AUTH_INTEGRATION.md` para contratos e limitações.

## Sessão e acesso à conta

Entre com `luna@example.com` ou `theo@example.com` e senha fictícia `Colecionador123!`. O nome aparece no Header e a sessão continua após refresh. O botão Sair no perfil/carteiras encerra a sessão.

Perfil, carteiras, favoritos, pagamento e confirmação exigem login. O destino é preservado para retorno após autenticação. A sessão dura 30 minutos; uma sessão inválida ou expirada recebe 401 na simulação. `resetUsers()` e `resetSessions()` restauram as respectivas bases para testes. Não há AuthProvider adicional: `useSession()` compartilha a query da sessão com o QueryClientProvider existente.

## Catálogo e detalhes dos NFTs

Catálogo e detalhe consultam a API simulada com Axios e TanStack Query. Busca, filtros, ordenação e paginação são mantidos na URL com TanStack Router. Veja [contratos, cache, cenários de falha e validação](./NFT_CATALOGUE.md).

## Carrinho

Detalhe e carrinho estão integrados à API simulada: adicionar, alterar quantidade, remover, persistir e unir os itens do visitante ao fazer login. Os carrinhos e os caches são separados por usuário. A remoção possui atualização otimista com rollback. Veja [contratos, estoque, cenários, reset e próximos passos](./CART_API.md).

## Cotação e cupom

O resumo do carrinho consulta subtotal, desconto, taxa estimada e total na API. Use `KURIO10` para aplicar 10% de desconto e `EXPIRADO` para exercitar erro de validade. A seleção persiste após refresh e os valores são recalculados ao alterar os itens. Veja [contratos, validade e cenários](./QUOTES_API.md). Pagamento e pedidos usam essa cotação antes de confirmar a compra.

## Pagamento e pedidos

Pagamento integrado ao carrinho, perfil, carteiras e cotação, com conexão simulada, revisão antes do envio, pedido idempotente e recuperação após timeout/refresh. Recibo apenas para pedido confirmado, com snapshot dos valores e baixa das quantidades compradas. Veja [fluxo, endpoints, cenários e limitações](./PAYMENT_FLOW.md).

## Favoritos

Favoritos exigem login e persistem por conta pela API MSW. Os corações do detalhe e dos cards compartilham o cache, com atualização otimista, rollback em falha e bloqueio de cliques repetidos. A lista está em `/favoritos`, acessível pelo menu da conta e pelo atalho mobile. Veja [contratos, cenários, reset e testes E2E](./FAVORITES_API.md).

## Tempo real e cenários de demonstração

Com `VITE_ENABLE_MOCKS=true`, abra `/?scenario=price-change`, adicione um NFT e entre no carrinho/pagamento: após cinco segundos, Socket.IO informa o novo preço e exige revisar a cotação novamente. `stock-change`, `duplicate-events`, `old-events`, `disconnect-order`, `payment-declined` e `pending` exercitam os outros cenários. `/?scenario=normal` desativa efeitos especiais em novas operações; `/?scenario=reset` restaura os dados locais do projeto e encerra a sessão.

Os links funcionam tanto localmente quanto no build publicado. Consulte [REALTIME.md](./REALTIME.md) para passos completos, eventos, transporte, controles determinísticos e limitações. Não é necessário subir um servidor na porta 3000 ou 5174. `VITE_SOCKET_URL` só é usado quando os mocks estão desligados.

Execute `npx playwright test realtime` para os testes desta integração ou `npm run test:e2e` para toda a cobertura existente. `npm run typecheck`, `npm run lint`, `npm run format:check` e `npm run build` verificam o código. `npm run preview -- --host 127.0.0.1` serve o build com os mocks incorporados, desde que a flag tenha sido ativada no build.
