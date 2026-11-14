# Integração de autenticação, perfil e carteiras

Os fluxos de login, cadastro, perfil e carteiras nesta etapa são **somente visuais**. Validação local, alternância de abas, exibição de senha e edição de campos funcionam no cliente. Nenhuma operação conclui com sucesso real: não há autenticação, persistência, conexão de carteira nem salvamento até a futura API simulada (MSW/HTTP).

## Telas e interações locais concluídas

- **Login** (`/login` e diálogo no Header): abas Entrar/Criar conta, formulário com RHF+Zod, mostrar/ocultar senha, erros por campo, estado `submitting` breve sem `success`, links sociais e “Esqueceu a senha?” apenas registram no console.
- **Cadastro** (`/cadastro` e mesma abas do diálogo/painel): mesmos padrões do login, com usuário, e-mail, senha e confirmação.
- **Perfil do colecionador** (`/perfil`): sidebar de conta, formulário de dados, ENS, apelido, avatar (edição visual local), bloco Alterar senha, validação e status de formulário preparados.
- **Carteiras** (`/carteiras`): carteira principal com selects e campos do Figma; seção secundária com estado vazio, “Adicionar”, “Igual à carteira principal” (cópia visual dos valores) e formulário de edição; salvamento sem sucesso de API.

## Dados demonstrativos (`src/mocks`)

- `src/mocks/temporary/collector-profile.ts` — `collectorProfileMock`, `collectorAvatarMock`
- `src/mocks/temporary/wallets.ts` — `mainWalletMock`, `secondaryWalletMock` (`null`), `networkOptions`, `walletTypeOptions`

Schemas: `src/data/schemas/auth.ts`, `profile.ts`, `wallets.ts`. Status: `src/data/types/form-status.ts`.

## Props e callbacks preparados para integração

| Área      | Container                  | Callbacks / estado prontos                                             |
| --------- | -------------------------- | ---------------------------------------------------------------------- |
| Auth      | `LoginForm` / `SignUpForm` | `onSubmit`, `status` (`idle` \| `submitting` \| `error` \| `success`)  |
| Auth      | `AuthDialog` / `AuthPage`  | `onGoogleClick`, `onFacebookClick`; `initialMode` apenas em `AuthPage` |
| Perfil    | página `/perfil`           | submit com payload tipado, avatar change/remove, `status`              |
| Carteiras | página `/carteiras`        | submit principal/secundária, adicionar, copiar da principal, `status`  |
| Sidebar   | `AccountSidebar`           | logout via `console.log` (sem sessão)                                  |

`FormStatusMessage` já cobre idle/submitting/error/success para a UI futura.

## O que a futura API deverá fornecer

- Login / cadastro / logout e sessão (token ou cookie).
- Recuperação de senha por e-mail (hoje só UI).
- OAuth Google/Facebook (hoje só UI).
- GET/PATCH do perfil do colecionador (incluindo avatar).
- GET/POST/PATCH/DELETE de carteiras principal e secundária; validação on-chain ou de endereço no backend.
- Mensagens de erro e sucesso reais para preencher `status` e `FormStatusMessage`.

## Arquivos compartilhados que precisam de ajustes

Não alterados nesta etapa (coordenação com Codex):

- `src/main.tsx`, `src/router.ts`, `src/pages/__root.tsx`, `src/routeTree.gen.ts`
- `src/index.css`, `src/lib/http.ts`, `src/lib/query-client.ts`, `src/lib/socket.ts`
- `src/mocks/browser.ts`, `src/mocks/handlers.ts`
- Vite/Playwright, `package.json` / lockfile
- `Header.tsx`, `Footer.tsx`

**Ajustes feitos em arquivos compartilhados (após pedido de responsividade mobile):**

1. **`src/pages/__root.tsx`** — em `/perfil` e `/carteiras`, oculta o Header no mobile (`lg+` mantém) e aplica `pb-32` para a bottom nav.
2. **`src/components/Footer.tsx`** (+ `FooterLinkColumn`) — tipografia e grid mais compactos no mobile.
3. **`src/components/MobileBottomNavigation.tsx`** — bottom nav compartilhada; home utiliza diretamente `MobileBottomNavigation`.

**Ainda pendentes / opcionais:**

1. **Header** — após sessão, trocar “Entrar” por acesso a `/perfil`; links diretos `/login` e `/cadastro` se desejado.
2. **`index.css`** — token opcional `text-coral` (`#f0805f`).
3. **MSW/handlers** — endpoints de auth, perfil e carteiras.

## Comandos executados e resultados

```text
npm run format   # OK
npm run lint     # OK (oxlint, sem findings)
npm run build    # OK (vite build && tsc -b)
```

## Pendências reais

- Integração HTTP + MSW + TanStack Query (responsável do projeto + Codex).
- Persistência de sessão, perfil e carteiras.
- Provedores sociais e recuperação de senha reais.
- Conexão blockchain / WalletConnect etc.
- Testes E2E/Playwright e baselines visuais.
- Após API: setar `status` para `error` ou `success` de verdade (hoje volta a `idle` após brief `submitting`).
- Itens desabilitados da sidebar (Atividade, Lista de interesse, Ofertas, Arquivos baixados, Suporte).

**Lembrete:** login, cadastro, conexão de carteira e salvamento **não** devem ser tratados como concluídos até a resposta da API simulada.

## Organização das páginas

A lógica e a composição de perfil e carteiras ficam em `src/pages/perfil/index.tsx` e `src/pages/carteiras/index.tsx`. Seus componentes exclusivos ficam nas respectivas pastas `-components`. Essas telas não possuem mais features próprias. A feature `Auth` continua compartilhada entre login, cadastro e diálogo do Header.

A autenticação ainda não dispara callbacks de sucesso. Os formulários apenas validam e controlam o estado local; a futura API simulada deverá determinar o resultado da operação.
