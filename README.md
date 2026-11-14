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

## Organização

- `src/components`: componentes compartilhados entre páginas.
- `src/pages/(inicio)/-components`: componentes exclusivos do Início. O prefixo `-` exclui esses arquivos do roteamento automático.
- `src/features/<NomeDaFeature>/container`: lógica, hooks e composição de funcionalidades maiores.
- `src/features/<NomeDaFeature>/components`: apresentação por props, sem regras de negócio.
- `hooks`, `tests` e `utils`: pastas opcionais dentro de cada feature, conforme a necessidade.

Cada feature possui container e components; componentes simples fora de features não exigem essa estrutura. Componentes usam PascalCase e arrow functions; evite arquivos muito grandes e divida responsabilidades quando necessário, sem limite rígido de linhas.

Header e Hero usam Roboto Mono local e assets exportados da cópia do Figma. Os textos auxiliares do Hero seguem 14px conforme o arquivo de design. A largura máxima de 1264px inclui 64px de padding horizontal, preservando os 1200px de conteúdo do frame desktop junto à classe container.

## Catálogo visual

Os dados temporários do catálogo e dos filtros são arrays de objetos em `src/mocks/catalogue.ts` e `src/mocks/catalogue-filters.ts`. As imagens exportadas do Figma ficam em `public/mocks`.

`src/components/NFTCard.tsx` é compartilhado: o mesmo padrão visual aparece no Início e nas recomendações de Detalhes e Carrinho. Ele recebe os dados por props. O fundo retangular das imagens foi preservado conforme as camadas do Figma.

Os filtros de apresentação ficam em `src/features/CatalogueFilters/components`, e a entrada que fornece os dados fica em `src/features/CatalogueFilters/container`; a composição da seção, toolbar, banner e paginação fica em `src/pages/(inicio)/-components`. No mobile, o painel abre em um Dialog shadcn/ui.

A seção ainda não consulta API nem filtra, ordena ou pagina os dados. Os controles são a base visual para a futura integração. A seleção visual de ordenação não altera a lista. O oitavo card não exibe título nem preço porque esses elementos estão ausentes no frame de referência. O controle de ordenação tem espaço adicional para evitar a sobreposição de texto e ícone presente no desenho.
