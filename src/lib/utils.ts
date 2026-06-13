import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { SITE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function whatsappUrl(message?: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message ?? SITE.whatsappMessage)}`;
}

export function normalizeImageUrl(url: string): string {
  if (url.startsWith("/")) return url;

  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}
export function formatPrice(price: number, currency: "ARS" | "USD") {
  if (price <= 0) return "Consultar precio";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}
