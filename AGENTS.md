Não adicione comentários ao código.
Siga o padrão do projeto e boas práticas de programação.
Utilize os componentes de src/components/ui (shadcn/ui).
Prefira ícones do lucide-react quando existirem; use SVGs locais só para marcas ou assets sem equivalente.
As rotas são geradas pelo TanStack Router a partir de src/pages.
Não edite src/routeTree.gen.ts manualmente.
Utilize arrow functions para funções e componentes.
Nomeie arquivos de componentes TSX em PascalCase, como Header.tsx e DeskHero.tsx. Preserve os nomes convencionais dos arquivos de entrada e rotas do TanStack Router.

Organize componentes compartilhados entre páginas em src/components.
Organize componentes exclusivos de uma página na pasta -components dessa página; o prefixo evita que o TanStack Router os registre como rotas.
Organize funcionalidades maiores e preferencialmente compartilhadas em src/features/<NomeDaFeature>, com nomes em PascalCase (CamelCase iniciado em maiúscula), como CatalogueFilters e Auth.
Cada feature deve conter as pastas container e components no mesmo nível. container é a entrada da feature e concentra obtenção de dados, lógica e chamadas de hooks. components contém os componentes de apresentação, que recebem dados e callbacks por props, sem regras de negócio. hooks, tests e utils podem existir no mesmo nível quando necessários.
Não coloque lógica ou chamadas de hooks de negócio nos componentes de apresentação. Componentes simples fora de features não precisam de containers; dentro de features, preserve a divisão container/components. Crie hooks, tests e utils somente quando necessários.
Evite arquivos muito grandes e separe responsabilidades quando isso melhorar a clareza. Não há limite rígido de linhas; mantenha componentes simples, como o Header, em um único arquivo quando fizer sentido.
Use classes usuais do Tailwind e flex quando suficiente; valores específicos são permitidos para reproduzir medidas do Figma.
Não adicione aria-label sem solicitação; preserve a semântica HTML e alternativas textuais necessárias.
Use ponto e vírgula e aspas duplas em JavaScript, TypeScript e JSX, conforme .prettierrc.json. Execute npm run format após alterações.
