import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  external?: boolean;
};

const variants = {
  primary:
    "bg-[var(--color-accent)] text-white hover:bg-[#4a6a78] shadow-lg shadow-[#5b7c8a33]",
  secondary:
    "bg-white/90 text-[var(--color-text)] border border-black/8 hover:bg-white",
  ghost: "bg-transparent text-white border border-white/30 hover:bg-white/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  external,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-300",
    variants[variant],
    className,
  );

  if (!href) {
    return <button type="button" className={classes}>{children}</button>;
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
