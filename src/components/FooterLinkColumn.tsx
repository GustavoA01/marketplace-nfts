import { Link } from "@tanstack/react-router";

export const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; to: string }[];
}) => {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 font-mono text-foreground">
      <p className="text-lg font-bold leading-4">{title}</p>
      <ul className="text-sm leading-6">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link
              to={to}
              className="rounded-sm outline-none transition-colors hover:text-primary-light focus-visible:ring-2 focus-visible:ring-ring"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
