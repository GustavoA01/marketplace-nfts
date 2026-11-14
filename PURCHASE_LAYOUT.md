# Layouts do catálogo e do fluxo de compra

## Escopo entregue

- Início: versões desktop e mobile, catálogo, filtros visuais, destaques promocionais, conteúdo editorial e navegação inferior mobile.
- `/nfts/emerald-ape-042`: galeria, informações, edições, quantidade, descrição e recomendações. Os demais cards abrem prévias usando seus nomes, preços e imagens.
- `/carrinho`: tabela desktop, cards mobile, cupom, resumo e recomendações.
- `/pagamento`: dados do colecionador, revisão e opções de carteira/rede. No celular, os dados e a revisão ficam em um Accordion do shadcn/ui, com espaçamento antes do botão de confirmação.
- `/confirmacao-pedido`: modal de prévia do recibo, acessível diretamente pela URL. A compra ainda não abre esse recibo automaticamente.

Os layouts usam dados demonstrativos locais. Comprar, favoritar, alterar quantidades, remover itens, aplicar cupom, conectar carteiras e confirmar pedido ainda não processam operações. A navegação entre rotas, abertura dos filtros, ampliação da imagem, seleção nativa de campos e fechamento do recibo funcionam apenas como interface. Não existe transação financeira.

As páginas de autenticação, perfil e carteiras têm escopo separado; consulte `AUTH_INTEGRATION.md`.

O rodapé aparece apenas no início, conforme o Figma.

## Organização

- `src/mocks/temporary/purchase.ts`: itens, resumos e metadados do recibo.
- `src/mocks/temporary/nft-details.ts`: conteúdo da prévia de detalhes.
- `src/mocks/temporary/home-content.ts`: banners e conteúdo editorial.
- `public/mocks` e `public/icons`: assets locais do Figma.
- `src/features/Checkout/container/Checkout.tsx`: compõe diretamente o checkout com os dados da etapa atual, sem wrapper intermediário `CheckoutPage`.
- `src/features/Checkout/components`: campos, formulário, opções de carteira e composição visual.
- `src/pages/carrinho/index.tsx`: compõe a tela e fornece os dados demonstrativos do carrinho e dos resumos.
- `src/pages/carrinho/-components`: itens, cupom e resumo exclusivos do carrinho.
- `src/pages/(inicio)/-components`: catálogo, filtros desktop/mobile e demais seções exclusivas do início.
- `index.tsx` de cada página: composição, hooks e lógica específicos da tela.
- Pastas `-components` nas páginas: componentes exclusivos de cada tela, ignorados pelo gerador de rotas. A divisão `container`/`components` fica apenas nas features.
- Componentes compartilhados: `NFTCard`, `NFTRecommendations`, `NFTLineItem`, `QuantitySelector`, `OrderTotals` e `PurchaseBreadcrumb`.

## Decisões sobre o protótipo

- Os exemplos desktop e mobile do Figma mostram carrinhos diferentes. Ambos foram preservados como mocks separados.
- O carrinho mobile soma 8.14 ETH; com taxa de 0.016 ETH, o total demonstrativo é 8.156 ETH. O subtotal 8.92 exibido no protótipo não corresponde à soma dos quatro itens.
- Os rótulos de contrato e licença nos detalhes foram associados ao conteúdo correspondente.
- A confirmação identifica explicitamente que os dados são demonstrativos.
- O recibo tem rolagem em telas menores, e o checkout mobile permite expandir os campos que não aparecem no frame inicial do protótipo.

## Próxima etapa, feita com o candidato

MSW, integração Axios/TanStack Query, persistência, regras do carrinho, autenticação, envio de pedido, Socket.IO e testes E2E ainda precisam ser implementados. A separação entre containers e apresentação permite substituir os mocks sem reescrever o layout.

Uma sequência possível é criar um primeiro handler MSW para o catálogo, consumi-lo com Axios e TanStack Query, implementar os estados de carregamento/erro/vazio e então avançar pelo fluxo de compra. Os testes Playwright devem vir depois do comportamento de cada fluxo existir.

## Verificação desta etapa

- `npm run lint`
- `npm run build`
- `npm run format:check`
- Inspeção visual no navegador em celular, tablet e desktop.

Não foram criados testes E2E nesta etapa.
