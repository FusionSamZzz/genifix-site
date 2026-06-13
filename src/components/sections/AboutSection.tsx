import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE } from "@/lib/constants";

export function AboutSection() {
  return (
    <section id="nosotros" className="bg-white py-[var(--spacing-section)]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Nosotros"
              title="Tecnología CNC para muebles modernos"
              description="GeniFix nace para simplificar la producción en nesting: una sola operación en el fresador, montaje final con una herramienta y cero errores de orientación."
            />
            <div className="mt-8 space-y-4 text-[var(--color-muted)]">
              <p>
                Inspirado en soluciones premium como Lamello Cabineo, GeniFix
                ofrece una unión oculta, estética y resistente — ideal para
                fabricantes de muebles y marketplaces donde el cliente arma en casa.
              </p>
              <p>
                Todo el mecanizado se realiza en el CNC. No se requiere máquina de
                taladro en canto ni espigas adicionales. Después de instalar la
                strippping, el mueble queda listo para el armado.
              </p>
              <p className="font-medium text-[var(--color-text)]">{SITE.address}</p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="overflow-hidden rounded-[28px] border border-black/6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)]">
              <iframe
                title="Ubicación ONYX MUEBLES"
                src={SITE.mapsEmbed}
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-medium text-[var(--color-accent)] hover:underline"
            >
              Abrir en Google Maps →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
