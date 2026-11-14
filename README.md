# Marketplace NFTs

Base React + TypeScript + Vite

## Executar no Ubuntu

```bash
cd ~/Projetos/marketplace-nfts
nvm use
npm ci
npm run dev
```

## Páginas

O plugin do TanStack Router lê `src/pages` e gera `src/routeTree.gen.ts` ao iniciar o Vite.
As pastas organizam as rotas; `index.tsx` representa a página de cada pasta.
O grupo `(inicio)` organiza a página inicial sem adicionar um segmento à URL.

| Pasta em src/pages | URL                 | Tela                   |
| ------------------ | ------------------- | ---------------------- |
| (inicio)           | /                   | Início                 |
| nfts/$nftId        | /nfts/1             | Detalhes do NFT        |
| carrinho           | /carrinho           | Carrinho de NFTs       |
| pagamento          | /pagamento          | Pagamento              |
| confirmacao-pedido | /confirmacao-pedido | Confirmação de pedido  |
| login              | /login              | Login                  |
| cadastro           | /cadastro           | Cadastro               |
| perfil             | /perfil             | Perfil do colecionador |
| carteiras          | /carteiras          | Carteiras              |

## Stack e preparação

- React e TypeScript para as páginas; Vite para desenvolvimento e build.
- TanStack Router com rotas por arquivo em `src/pages`.
- TanStack Query com provider e cliente em `src/lib/query-client.ts`.
- Axios com cliente REST em `src/lib/http.ts`, sem chamadas implementadas.
- Socket.IO com cliente em `src/lib/socket.ts`, sem conexão automática ou eventos.
- Tailwind CSS e componentes oficiais shadcn/ui em `src/components/ui`. Os estilos auxiliares gerados estão em `src/styles/shadcn.css`; o CLI pode ser executado com `npx shadcn@latest add <componente>`.
- MSW configurado em `src/data/mocks`, ativado por `VITE_ENABLE_MOCKS=true`. O worker está em `public/mockServiceWorker.js`. O cadastro já possui handler funcional; os demais recursos estão em implementação. A flag também deve estar ativa no build de demonstração.
- Playwright configurado em `playwright.config.ts`, com pasta para futuros testes E2E e visuais (marcar testes visuais com `@visual`). Instalar o navegador com `npx playwright install chromium` antes de executar os testes.
- Lighthouse instalado para auditorias locais. Com o preview rodando, executar `npm run audit:lighthouse`. Requer Chrome/Chromium instalado; definir `CHROME_PATH` se necessário.

O cadastro utiliza Axios, TanStack Query e MSW, com persistência local dos usuários simulados. Login e sessão por cookie também estão integrados. Compras, recursos privados de perfil/carteiras e Socket.IO ainda precisam ser concluídos.
Ainda não há testes E2E permanentes nem baselines visuais.

## Comandos

```bash
npm run build
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

A seção ainda não consulta API nem filtra, ordena ou pagina os dados. Os controles são a base visual para a futura integração. A seleção visual de ordenação não altera a lista. O oitavo card não exibe título nem preço porque esses elementos estão ausentes no frame de referência. O controle de ordenação tem espaço adicional para evitar a sobreposição de texto e ícone presente no desenho.

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

Perfil, carteiras, pagamento e confirmação exigem login. O destino é preservado para retorno após autenticação. A sessão dura 30 minutos; uma sessão inválida ou expirada recebe 401 na simulação. `resetUsers()` e `resetSessions()` restauram as respectivas bases para testes. Não há AuthProvider adicional: `useSession()` compartilha a query da sessão com o QueryClientProvider existente.
