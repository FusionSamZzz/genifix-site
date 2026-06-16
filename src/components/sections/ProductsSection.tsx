"use client";

import Image from "next/image";
import { useState } from "react";

import { ProductVideo } from "@/components/sections/ProductVideo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PresentationVideo } from "@/lib/getSiteSettings";
import type { ProductItem } from "@/lib/getProducts";
import { formatPrice, whatsappUrl } from "@/lib/utils";

type ProductsSectionProps = {
  products: ProductItem[];
  presentationVideo?: PresentationVideo | null;
};

export function ProductsSection({ products, presentationVideo }: ProductsSectionProps) {
  const [active, setActive] = useState<ProductItem | null>(null);

  const sectionTitle =
    products.length > 0
      ? products.map((product) => product.name).join(" · ")
      : "Productos GeniFix";

  const sectionDescription =
    products.length > 0
      ? "Precios y fotos actualizados desde el panel de administración."
      : "Agregue productos en /admin para mostrarlos aquí.";

  return (
    <section id="productos" className="bg-[var(--color-bg)] py-[var(--spacing-section)]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Productos"
            title={sectionTitle}
            description={sectionDescription}
          />
        </Reveal>

        {products.length === 0 ? (
          <Reveal delay={0.08}>
            <p className="mt-10 rounded-[24px] border border-dashed border-black/15 bg-white px-6 py-10 text-center text-[var(--color-muted)]">
              No hay productos publicados todavía. Entre en{" "}
              <a href="/admin" className="font-medium text-[var(--color-accent)] hover:underline">
                Admin
              </a>{" "}
              y cree al menos uno.
            </p>
          </Reveal>
        ) : null}

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.08}>
              <article className="group overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] transition duration-500 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#eef1f3]">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                      product.inStock
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {product.inStock ? "En stock" : "Próximamente"}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                        {product.sku || "Artículo"}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-[var(--color-text)]">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-lg font-semibold text-[var(--color-accent)]">
                      {formatPrice(product.price, product.currency)}
                    </p>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[var(--color-muted)]">
                    {product.description}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setActive(product)}
                      className="rounded-full border border-black/8 px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--color-bg)]"
                    >
                      Detalles
                    </button>
                    <a
                      href={whatsappUrl(
                        `Hola, me interesa ${product.name} (${product.sku}).`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4a6a78]"
                    >
                      Consultar
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {presentationVideo ? <ProductVideo video={presentationVideo} /> : null}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm"
          onClick={() => setActive(null)}
          onKeyDown={(event) => event.key === "Escape" && setActive(null)}
          role="presentation"
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
          >
            <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-2xl bg-[#eef1f3]">
              <Image
                src={active.imageUrl}
                alt={active.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
              {active.sku}
            </p>
            <h3 id="product-modal-title" className="mt-1 text-2xl font-semibold">
              {active.name}
            </h3>
            <p className="mt-2 text-xl font-semibold text-[var(--color-accent)]">
              {formatPrice(active.price, active.currency)}
            </p>
            <p className="mt-4 text-[var(--color-muted)]">{active.description}</p>
            <div className="mt-6 flex gap-3">
              <a
                href={whatsappUrl(`Hola, quiero consultar por ${active.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
              >
                WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="rounded-full border border-black/8 px-5 py-3 text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
