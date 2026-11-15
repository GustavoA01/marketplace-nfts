# Orientações de manutenção

- Siga os padrões existentes e não adicione comentários ao código.
- Use arrow functions e nomes PascalCase para componentes TSX. Preserve os nomes convencionais de entradas e rotas do TanStack Router.
- Use os componentes shadcn/ui de `src/components/ui`, os tokens do tema e ícones lucide-react quando disponíveis.
- Preserve semântica HTML, labels, foco visível e acessibilidade dos componentes.
- Use classes usuais do Tailwind; prefira flex quando suficiente. Medidas específicas são permitidas para reproduzir o Figma.
- Mantenha funções e blocos de responsabilidade separados por linhas em branco. Divida arquivos quando isso melhorar a clareza, sem impor um limite rígido de linhas.
- Mantenha componentes compartilhados em `src/components` e componentes exclusivos em `src/pages/<pagina>/-components`.
- Nas páginas, concentre composição e lógica no `index.tsx`; não crie containers que apenas repassem props ou wrappers sem responsabilidade.
- Reserve `src/features/<NomeDaFeature>` para funcionalidades compartilhadas ou transversais. Use `container` para lógica/composição e `components` para apresentação por props; adicione hooks e utils conforme a necessidade.
- Não edite `src/routeTree.gen.ts` manualmente; a árvore é gerada pelo TanStack Router.
- Centralize REST nos serviços Axios e estado remoto no TanStack Query. Preserve isolamento por usuário, cancelamento de consultas e consistência entre REST e Socket.IO.
- Mantenha respostas e cenários simulados na camada MSW. Preserve os dados visuais provisórios em `src/data/mocks/temporary`, separados da infraestrutura e dos mocks de testes.
- Use ponto e vírgula e aspas duplas conforme o Prettier. Execute `npm run format` após alterações e verificações adequadas ao escopo.
- Mantenha o README voltado a setup e avaliação. Documente contratos, cache, sessão, limitações e decisões de UX em `ARCHITECTURE.md`, evitando notas paralelas desatualizadas.
