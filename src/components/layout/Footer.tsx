import Link from "next/link";

import { NAV_LINKS, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-xl font-semibold text-[var(--color-text)]">{SITE.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
            {SITE.description}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
            Navegación
          </p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
            Contacto
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
            <li>
              <a href={SITE.phoneHref} className="hover:text-[var(--color-text)]">
                {SITE.phone}
              </a>
            </li>
            <li>{SITE.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5 py-6 text-center text-sm text-[var(--color-muted)]">
        <p>
          © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
        </p>
        <Link
          href="/admin"
          className="mt-3 inline-block text-xs font-medium uppercase tracking-wider text-[var(--color-muted)] transition hover:text-[var(--color-accent)]"
        >
          Admin Panel
        </Link>
      </div>
    </footer>
  );
}
