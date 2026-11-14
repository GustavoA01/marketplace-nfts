import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { features, profileLinks, helpLinks, collectionLinks, socialLinks } from "@/data/constants/footer"


export const FooterLinkColumn = ({ title, links }: { title: string; links: readonly { label: string; to: string }[] }) => {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 font-mono text-foreground">
      <p className="text-lg font-bold leading-4">{title}</p>
      <ul className="text-sm leading-6">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link to={to}
              className="rounded-sm outline-none transition-colors hover:text-primary-light focus-visible:ring-2 focus-visible:ring-ring"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const Footer = () => {
  return (
    <footer className="mt-auto bg-background font-mono text-foreground">
      <div className="container mx-auto px-5 sm:px-8 xl:max-w-316">
        <div className="bg-surface-card px-4 py-8 sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
            <div className="grid flex-1 gap-8 sm:grid-cols-3">
              {features.map(({ letter, title, description }, index) => (
                <div
                  key={letter}
                  className="relative flex flex-col gap-3 px-4 sm:px-4"
                >
                  {index > 0 && (
                    <span
                      aria-hidden
                      className="absolute top-0 bottom-0 left-0 hidden w-px bg-primary sm:block"
                    />
                  )}
                  <div className="flex size-18.5 items-center justify-center rounded-full bg-primary text-2xl font-bold text-ink">
                    {letter}
                  </div>
                  <p className="text-[17px] font-bold leading-4">{title}</p>
                  <p className="max-w-51 text-sm leading-5.5 text-[#CFB28C]">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative flex w-full flex-col gap-3 px-4 lg:w-89.25 lg:shrink-0">
              <span
                aria-hidden
                className="absolute top-0 bottom-0 left-0 hidden w-px bg-primary lg:block"
              />
              <div className="flex flex-col gap-4">
                <p className="text-lg font-bold leading-4">
                  Antecipe-se ao próximo lançamento
                </p>
                <form
                  className="flex h-10 overflow-hidden rounded-md bg-surface-dark shadow-[0_0_10px_rgba(10,6,4,0.45)]"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <Input
                    type="email"
                    name="email"
                    placeholder="digite seu e-mail..."
                    className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 font-mono text-sm shadow-none placeholder:text-secondary focus-visible:ring-0"
                  />
                  <Button
                    type="submit"
                    className="h-full w-21.25 shrink-0 rounded-none rounded-r-md px-4 font-mono text-lg font-bold"
                  >
                    Enviar
                  </Button>
                </form>
              </div>
              <p className="text-[13px] leading-5.5 text-[#CFB28C]">
                Receba lançamentos selecionados, histórias de criadores e
                novidades do mercado.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-surface-dark px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-5">
          <Link
            to="/"
            className="w-fit rounded-sm text-sm font-bold tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            KURIO
          </Link>
          <p className="text-sm leading-5.5">
            Feito para colecionadores,
            <br />
            criadores e cultura
          </p>
          <a
            href="mailto:contato@email.com"
            className="rounded-sm text-sm leading-5.5 outline-none transition-colors hover:text-primary-light focus-visible:ring-2 focus-visible:ring-ring"
          >
            contato@email.com
          </a>
          <a
            href="tel:+551140028922"
            className="rounded-sm text-sm leading-5.5 outline-none transition-colors hover:text-primary-light focus-visible:ring-2 focus-visible:ring-ring sm:w-57"
          >
            +55 11 4002 8922
          </a>
        </div>

        <div className="bg-surface-card px-4 py-8 sm:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-31">
            <FooterLinkColumn title="Meu perfil" links={profileLinks} />
            <FooterLinkColumn title="Central de ajuda" links={helpLinks} />
            <FooterLinkColumn title="Coleções" links={collectionLinks} />

            <div className="flex w-full flex-col gap-8 lg:w-57 lg:shrink-0">
              <div className="flex flex-col gap-5">
                <p className="text-lg font-bold leading-4">Redes sociais</p>
                <div className="flex items-center gap-2.5">
                  {socialLinks.map(({ label, src }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <img src={src} alt="" width={32} height={32} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-lg font-bold leading-4">
                  Carteiras compatíveis
                </p>
                <div className="flex h-6.5 items-center justify-center rounded-md border border-border-soft bg-surface-dark px-2">
                  <p className="text-[9px] font-bold tracking-[0.1px] text-[#E89B55]">
                    METAMASK · WALLETCONNECT · COINBASE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="py-1.5 text-center text-sm leading-7.5">
          © 2026 Kurio. Propriedade digital para todos.
        </p>
      </div>
    </footer>
  )
}
