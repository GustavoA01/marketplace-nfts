# Arquitetura e decisões

## Estrutura

React e TypeScript são compilados pelo Vite. O TanStack Router gera rotas a partir de `src/pages`; busca, filtros, ordenação e paginação pertencem à URL. As páginas concentram a composição e usam `-components` para componentes exclusivos. Componentes compartilhados ficam em `src/components`, com shadcn/ui adaptado ao tema Tailwind. As features Auth, Checkout e Realtime concentram lógica reutilizada ou transversal, com `container`, `components` e helpers quando necessários.

Os formulários usam React Hook Form e Zod. As chamadas HTTP passam por `src/services` e pelo Axios central. Os mocks ficam exclusivamente na camada de rede MSW, com contratos compartilhados e modelos de dados próprios. A interface não importa respostas fictícias como alternativa às consultas. Assets locais e dados visuais provisórios ficam em `public/mocks` e `src/data/mocks/temporary`.

## Estado e cache

TanStack Query gerencia o estado remoto. O padrão global usa staleTime de 60 segundos e uma tentativa adicional nas consultas; a sessão usa 30 segundos, revalidação por foco e sem retry. Mutations de compra não são repetidas automaticamente. Chaves de catálogo incluem seus parâmetros; carrinhos, favoritos e pedidos incluem a conta. As consultas recebem AbortSignal. Logout e troca de conta cancelam consultas e removem dados privados; callbacks assíncronos conferem o proprietário ativo antes de gravar resultados.

Favoritos e remoção de itens têm atualização otimista com rollback em falha. Carrinho e cotação são recursos distintos: os totais calculados pela API são a referência para confirmar, e alterações de itens ou mercado exigem nova cotação e revisão. ETH trafega em strings decimais; os cálculos monetários usam BigInt em wei.

## Sessão e persistência

O cookie identifica uma sessão de 30 minutos na base MSW. A persistência em localStorage permite recuperar usuários, sessões, favoritos, carteiras, carrinhos, alterações de mercado e pedidos após refresh. A lista de sessões no armazenamento é o lado servidor da simulação; sua existência isolada não autentica o cliente sem o cookie. Senhas fictícias são verificadas por hash com salt. Esta persistência não fornece as garantias de um servidor real nem cookies HttpOnly.

Rotas privadas preservam o destino de retorno ao exigir login. O carrinho de visitante é unido ao da conta na autenticação, respeitando estoque. Novos usuários não recebem uma carteira fictícia; as contas iniciais têm fixtures próprias. Detalhes em [AUTH_INTEGRATION.md](./AUTH_INTEGRATION.md), [CART_API.md](./CART_API.md) e [FAVORITES_API.md](./FAVORITES_API.md).

## Compra e tempo real

Uma tentativa de compra salva UUID e corpo original em sessionStorage, separados por conta. A API aceita Idempotency-Key: a mesma chave e conteúdo recuperam o pedido existente; conteúdo diferente gera conflito. Antes de criar, revalida propriedade da carteira, conexão, rede, cotação, estoque, cupom e total. O pedido preserva um snapshot, e a confirmação aplica a baixa de estoque/carrinho uma única vez. Estados terminais não regridem. O recibo exige resposta de pedido confirmado.

Socket.IO participa efetivamente: MSW e `@mswjs/socket.io-binding` interceptam WebSocket e entregam `nft.updated` e `order.updated` ao cliente real. Identidade e versão permitem descartar duplicatas e eventos antigos. A integração consulta REST depois de eventos e reconexão, filtra assinaturas por sessão e libera listeners ao trocar de usuário. A consulta periódica do pedido é apenas fallback de desconexão. Transporte, contratos, limitações, reset e cenários reproduzíveis estão em [REALTIME.md](./REALTIME.md); detalhes da compra em [PAYMENT_FLOW.md](./PAYMENT_FLOW.md) e [QUOTES_API.md](./QUOTES_API.md).

## Decisões de interface e limites

- O footer aparece apenas no início, seguindo a decisão de fidelidade ao Figma.
- O desktop usa modal para login iniciado pelo carrinho; o mobile navega para a página de login. Ambos preservam o destino. Expiração em rota privada usa a página de login para retomada.
- O formulário mobile de dados e revisão usa Accordion shadcn/ui. A revisão explícita, estados pendentes, erros e feedback de reconexão complementam os frames estáticos.
- Uma compra utiliza uma rede. Carrinhos com redes diferentes permanecem editáveis, mas exigem ajuste antes da cotação. Carteiras incompatíveis não são oferecidas para conexão.
- Valores e taxas seguem ETH e fixtures do desafio. Não há conversão, bridge, extensão de carteira, gateway ou execução blockchain. Links de exploradores usam identificadores fictícios e não terão uma transação real registrada.
- Imagens e fontes são locais; o fundo retangular dos cards segue as camadas do Figma. Página editorial, atividade, ofertas, downloads e suporte ficam fora dos fluxos obrigatórios.

## Validação e trabalho restante

Os testes permanentes existentes cobrem favoritos, compatibilidade e troca de carteira na compra, defaults de perfil e os cenários de tempo real descritos acima. Isso não representa cobertura completa de todos os cenários do enunciado: busca/histórico, conta e formulários completos, timeout de envio, teclado, skeletons e baselines de regressão visual ainda exigem cobertura específica. Os comandos Lighthouse existentes precisam gerar as medições e evidências finais. Deploy e verificação da URL pública também fazem parte da entrega restante.
