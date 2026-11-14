# Marketplace NFTs

Base React + TypeScript + Vite, sem funcionalidades de negócio e sem navegação entre telas.
As nove páginas exibem apenas seus títulos em um componente shadcn/ui.

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

| Pasta em src/pages | URL | Tela |
| --- | --- | --- |
| (inicio) | / | Início |
| nfts/$nftId | /nfts/1 | Detalhes do NFT |
| carrinho | /carrinho | Carrinho de NFTs |
| pagamento | /pagamento | Pagamento |
| confirmacao-pedido | /confirmacao-pedido | Confirmação de pedido |
| login | /login | Login |
| cadastro | /cadastro | Cadastro |
| perfil | /perfil | Perfil do colecionador |
| carteiras | /carteiras | Carteiras |

## Stack e preparação

- React e TypeScript para as páginas; Vite para desenvolvimento e build.
- TanStack Router com rotas por arquivo em `src/pages`.
- TanStack Query com provider e cliente em `src/lib/query-client.ts`.
- Axios com cliente REST em `src/lib/http.ts`, sem chamadas implementadas.
- Socket.IO com cliente em `src/lib/socket.ts`, sem conexão automática ou eventos.
- Tailwind CSS e componentes oficiais shadcn/ui em `src/components/ui`. Os estilos auxiliares gerados estão em `src/styles/shadcn.css`; o CLI pode ser executado com `npx shadcn@latest add <componente>`.
- MSW com handlers vazios em `src/mocks`, sem worker iniciado. Para futura ativação, gerar o arquivo do worker com `npx msw init public --save` e iniciar o worker apenas em desenvolvimento.
- Playwright configurado em `playwright.config.ts`, com pasta para futuros testes E2E e visuais (marcar testes visuais com `@visual`). Instalar o navegador com `npx playwright install chromium` antes de executar os testes.
- Lighthouse instalado para auditorias locais. Com o preview rodando, executar `npm run audit:lighthouse`. Requer Chrome/Chromium instalado; definir `CHROME_PATH` se necessário.

Query, REST, Socket.IO e MSW estão preparados para a próxima etapa; não há consultas, autenticação, compras ou persistência nesta base.
Ainda não há testes E2E nem baselines visuais, pois as telas são placeholders.

## Comandos

```bash
npm run build
npm run lint
npm run preview -- --host 127.0.0.1
npm run test:e2e
npm run test:visual
npm run audit:lighthouse
```

Copie `.env.example` para `.env.local` quando houver serviços reais. Variáveis `VITE_` ficam públicas no navegador e não devem conter segredos.

## Tema

A paleta está em `src/index.css`, com tokens CSS e utilitários Tailwind como `bg-primary`, `bg-primary-light`, `bg-surface-card`, `border-border-soft` e `text-success`. O tema escuro usa Ink como fundo principal; Background Elevated fica disponível como token independente. Primary, Primary Light e Primary Dark seguem os valores fornecidos; as demais cores foram amostradas do centro dos círculos da imagem de referência.

Funções e componentes seguem o padrão arrow function.
