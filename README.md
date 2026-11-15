# Kurio — Marketplace de NFTs

Aplicação React e TypeScript para descoberta de NFTs, compra e conta do colecionador, com layouts desktop e mobile baseados no Figma. A API REST, autenticação, carteiras, pagamentos e eventos Socket.IO são simulados na camada de rede com MSW.

## Executar localmente

Requisitos: Node.js 24 ou superior e npm.

A partir da raiz do repositório:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Abra o endereço informado pelo Vite.

| Variável            | Valor de demonstração | Finalidade                                                                        |
| ------------------- | --------------------- | --------------------------------------------------------------------------------- |
| `VITE_ENABLE_MOCKS` | `true`                | Habilita as APIs e os eventos simulados. Deve estar ativa também durante o build. |
| `VITE_API_URL`      | `/api`                | Prefixo das chamadas REST.                                                        |
| `VITE_SOCKET_URL`   | Vazio                 | Usada para um servidor externo somente com os mocks desligados.                   |

## Credenciais fictícias

| E-mail             | Senha              | Estado inicial                          |
| ------------------ | ------------------ | --------------------------------------- |
| `luna@example.com` | `Colecionador123!` | Possui uma carteira principal Ethereum. |
| `theo@example.com` | `Colecionador123!` | Sem carteiras cadastradas.              |

Também é possível criar uma conta em `/cadastro`. Novas contas começam sem carteiras. Usuários e alterações permanecem após refresh na mesma origem do navegador.

## Roteiro de avaliação

1. No início (`/`), utilize busca, filtros, ordenação e paginação e abra um NFT. O detalhe também aceita acesso direto, por exemplo `/nfts/emerald-ape-042`.
2. Selecione edição e quantidade e clique em Comprar. No carrinho, altere quantidades, remova itens e experimente os cupons abaixo.
3. Clique em Conectar e finalizar. Se necessário, faça login para continuar no pagamento.
4. Selecione/conecte uma carteira compatível, confira os dados e os valores e marque a revisão antes de confirmar a compra.
5. Aguarde o resultado do pedido. A confirmação apresenta os itens, a transação, a taxa e o total do snapshot da compra.
6. Consulte `/perfil`, `/carteiras` e `/favoritos` para avaliar os fluxos da conta. Sem carteira compatível, o checkout oferece acesso ao cadastro com retorno ao pagamento.

O carrinho de visitante é preservado ao autenticar. Favoritos, perfil, carteiras e pedidos pertencem à conta autenticada. A compra de NFTs de redes diferentes deve ser feita separadamente.

## Cupons para avaliação

| Código     | Resultado esperado                                                             |
| ---------- | ------------------------------------------------------------------------------ |
| `KURIO10`  | Desconto de 10% sobre o subtotal dos NFTs, antes da taxa de rede.              |
| `EXPIRADO` | Erro de cupom expirado.                                                        |
| `TESTE123` | Erro de cupom inválido; qualquer código não cadastrado tem esse comportamento. |

Os códigos ignoram espaços nas extremidades e diferenças entre maiúsculas/minúsculas. A taxa não recebe desconto. As taxas da demonstração são Ethereum `0.003` ETH, Polygon `0.0001` ETH e Solana `0.00005` ETH.

## Cenários reproduzíveis

Abra os caminhos abaixo pela barra de endereço, na origem local ou publicada. A configuração é aplicada ao carregar a aplicação e permanece na aba durante a navegação.

| Caminho                                | Como avaliar                                                                                                                                                          |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/?scenario=normal`                    | Desarma cenários especiais sem limpar os dados; não é necessário no primeiro acesso.                                                                                  |
| `/?scenario=price-change`              | Adicione um NFT e abra carrinho/pagamento: após cinco segundos, seu preço aumenta 0.30 ETH, com aviso e atualização do resumo. Uma revisão anterior perde a validade. |
| `/?scenario=stock-change`              | No mesmo ponto do fluxo, o NFT fica esgotado e o pagamento é bloqueado até ajustar o carrinho.                                                                        |
| `/?scenario=duplicate-events`          | Altera o preço e repete o evento; o cliente evita reaplicar a atualização.                                                                                            |
| `/?scenario=old-events`                | Altera o preço e depois entrega uma versão antiga; o preço atual é preservado.                                                                                        |
| `/pagamento?scenario=disconnect-order` | Com itens e sessão, confirme a compra. A conexão é interrompida por 5,5 segundos, com toast; a reconexão recupera o pedido sem nova compra.                           |
| `/pagamento?scenario=payment-declined` | A compra termina recusada, preservando os itens do carrinho.                                                                                                          |
| `/pagamento?scenario=pending`          | Mantém o pedido pendente por aproximadamente um minuto; permite avaliar refresh e consulta de estado.                                                                 |
| `/?scenario=reset`                     | Restaura as fixtures e limpa os dados/cenários locais do projeto, incluindo a sessão.                                                                                 |

O cenário de mercado dispara uma vez por conta e cenário em cada carregamento. Use `nft=emerald-ape-042` como parâmetro adicional para escolher um NFT específico que esteja no carrinho. Para repetir com estado conhecido, use primeiro `/?scenario=reset`. O modo `normal` só desarma efeitos especiais; não desfaz compras nem alterações de preço anteriores.

### Lentidão e falhas HTTP

Se um cenário especial estiver ativo, abra `/?scenario=normal` antes. Navegue até a tela desejada e, no console do navegador, configure uma das chaves abaixo; depois atualize a página sem o parâmetro `scenario`:

| Chave do localStorage                 | Valores disponíveis                                                                |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| `marketplace-nfts:catalogue-scenario` | `empty`, `slow`, `out-of-order`, `error`, `offline`, `timeout`                     |
| `marketplace-nfts:cart-scenario`      | `slow`, `error`, `mutation-error`, `offline`                                       |
| `marketplace-nfts:favorite-scenario`  | `slow`, `error`, `mutation-error`, `slow-mutation-error`, `offline`                |
| `marketplace-nfts:wallet-scenario`    | `slow`, `error`, `mutation-error`, `offline`                                       |
| `marketplace-nfts:payment-scenario`   | `wallet-refused`, `timeout-after-create`, `offline`, `payment-declined`, `pending` |

Exemplo para observar o skeleton do catálogo:

```js
localStorage.setItem("marketplace-nfts:catalogue-scenario", "slow");
location.reload();
```

`slow` usa dois segundos de latência; `error` retorna HTTP 503; `offline` gera erro de rede; `mutation-error` falha somente nas escritas. No catálogo, `out-of-order` faz buscas curtas demorarem mais que buscas longas. `timeout` demora 16 segundos, ultrapassando os 15 segundos do Axios.

Para avaliar timeout depois de criar o pedido, já com itens no carrinho:

```js
localStorage.setItem(
  "marketplace-nfts:payment-scenario",
  "timeout-after-create",
);
location.assign("/pagamento");
```

Conecte, revise e confirme. Após o timeout, a tela recupera a tentativa existente. Para restaurar, remova a chave e tente novamente, ou use o reset completo. A expiração de sessão também pode ser observada removendo o cookie `authToken` e recarregando uma rota privada.

## Testes e verificações

Instale o Chromium utilizado pela versão do Playwright do projeto:

```bash
npx playwright install chromium
npm run test:e2e
```

| Comando                                    | Finalidade                                                                         |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| `npm run test:e2e -- --headed --workers=1` | Executa os casos com o navegador visível, um por vez.                              |
| `npm run test:e2e -- --ui`                 | Abre a interface visual do Playwright.                                             |
| `npm run test:visual`                      | Compara início, detalhe, carrinho e pagamento com as oito referências versionadas. |
| `npx playwright show-report`               | Abre o relatório HTML da execução.                                                 |
| `npm run typecheck`                        | Verifica os tipos TypeScript.                                                      |
| `npm run lint`                             | Executa o lint.                                                                    |
| `npm run format:check`                     | Verifica a formatação.                                                             |
| `npm run format`                           | Aplica a formatação Prettier.                                                      |

O Playwright inicia o Vite de testes na porta 4173 com MSW ativado explicitamente no servidor de testes. Relatórios ficam em `playwright-report`; traces e screenshots de falhas, em `test-results`. Os testes estão agrupados por fluxo em `tests/e2e`; por exemplo, `npx playwright test realtime` executa tempo real e `npx playwright test cart` executa carrinho/cupons. A cobertura, limitações e verificações ainda pendentes estão descritas em [ARCHITECTURE.md](./ARCHITECTURE.md#verificação-e-limitações-da-entrega).

## Build e preview

Mantenha `VITE_ENABLE_MOCKS=true` durante o build da demonstração:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

O preview fica em `http://127.0.0.1:4173`; use a porta livre de outro servidor de testes. Com o preview ativo e Chrome/Chromium disponível, `npm run audit:lighthouse` executa a auditoria básica local e grava `reports/lighthouse.html`. Configure `CHROME_PATH` se o navegador não for encontrado automaticamente. A configuração atual desse comando não gera, sozinha, todas as medições exigidas pelo enunciado.

Na publicação, a hospedagem deve servir `dist`, disponibilizar `/mockServiceWorker.js` e redirecionar rotas da SPA para `index.html`, permitindo acesso direto e refresh. Os dados são separados por origem: o estado do localhost não é transferido ao deploy.

Contratos REST/eventos, política de sessão, cache, estado do carrinho, decisões de UX e desvios do Figma estão centralizados em [ARCHITECTURE.md](./ARCHITECTURE.md).

As baselines visuais foram geradas em Chromium no Linux/WSL. Para atualizar referências após uma mudança de layout revisada, execute `npm run test:visual -- --update-snapshots` e versione os PNGs alterados.
