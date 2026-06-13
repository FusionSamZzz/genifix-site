"use client";

import { FormEvent, useState } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE } from "@/lib/constants";
import { whatsappUrl } from "@/lib/utils";

export function ContactsSection() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const phone = String(data.get("phone") || "");
    const message = String(data.get("message") || "");
    const text = `Hola, soy ${name}. Tel: ${phone}. ${message}`;
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <section id="contactos" className="bg-[var(--color-bg)] py-[var(--spacing-section)]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Contactos"
            title="Hablemos de su producción"
            description="Llámenos o envíenos un mensaje. Respondemos consultas sobre precios, fichas técnicas y pedidos."
          />
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal delay={0.08}>
            <div className="rounded-[28px] border border-black/6 bg-white p-8">
              <h3 className="text-lg font-semibold">Datos de contacto</h3>
              <ul className="mt-6 space-y-4 text-[var(--color-muted)]">
                <li>
                  <span className="block text-xs uppercase tracking-wider text-[var(--color-text)]">
                    Teléfono
                  </span>
                  <a
                    href={SITE.phoneHref}
                    className="text-lg font-medium text-[var(--color-accent)] hover:underline"
                  >
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wider text-[var(--color-text)]">
                    WhatsApp
                  </span>
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    +54 9 2233 39-0267
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wider text-[var(--color-text)]">
                    Dirección
                  </span>
                  {SITE.address}
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <form
              onSubmit={handleSubmit}
              className="rounded-[28px] border border-black/6 bg-white p-8"
            >
              <h3 className="text-lg font-semibold">Dejar consulta</h3>
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm text-[var(--color-muted)]">Nombre</span>
                  <input
                    name="name"
                    required
                    className="w-full rounded-2xl border border-black/8 bg-[var(--color-bg)] px-4 py-3 outline-none ring-[var(--color-accent)] focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-[var(--color-muted)]">Teléfono</span>
                  <input
                    name="phone"
                    required
                    className="w-full rounded-2xl border border-black/8 bg-[var(--color-bg)] px-4 py-3 outline-none ring-[var(--color-accent)] focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-[var(--color-muted)]">Mensaje</span>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full rounded-2xl border border-black/8 bg-[var(--color-bg)] px-4 py-3 outline-none ring-[var(--color-accent)] focus:ring-2"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-[var(--color-accent)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4a6a78]"
              >
                Enviar por WhatsApp
              </button>
              {sent ? (
                <p className="mt-3 text-sm text-emerald-600">
                  Se abrió WhatsApp con su mensaje.
                </p>
              ) : null}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
