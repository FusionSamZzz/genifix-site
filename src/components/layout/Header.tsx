"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn, whatsappUrl } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-black/5 bg-white/85 py-3 shadow-sm backdrop-blur-xl"
          : "bg-transparent py-5",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link
          href="#inicio"
          className={cn(
            "text-xl font-semibold tracking-tight transition-colors",
            scrolled ? "text-[var(--color-text)]" : "text-white",
          )}
        >
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:opacity-70",
                scrolled ? "text-[var(--color-text)]" : "text-white/90",
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4a6a78]"
          >
            Escribir
          </a>
        </nav>

        <button
          type="button"
          aria-label="Abrir menú"
          className={cn(
            "relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden",
            scrolled ? "text-[var(--color-text)]" : "text-white",
          )}
          onClick={() => setOpen((value) => !value)}
        >
          <span
            className={cn(
              "h-0.5 w-6 bg-current transition-transform",
              open && "translate-y-2 rotate-45",
            )}
          />
          <span
            className={cn(
              "h-0.5 w-6 bg-current transition-opacity",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "h-0.5 w-6 bg-current transition-transform",
              open && "-translate-y-2 -rotate-45",
            )}
          />
        </button>
      </div>

      <motion.nav
        initial={false}
        animate={open ? "open" : "closed"}
        variants={{
          open: { height: "auto", opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        className="overflow-hidden border-t border-black/5 bg-white md:hidden"
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-medium text-[var(--color-text)] hover:bg-[var(--color-bg)]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-full bg-[var(--color-accent)] px-4 py-3 text-center text-sm font-medium text-white"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </motion.nav>
    </header>
  );
}
