import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE } from "@/lib/constants";

export function DocumentationSection() {
  return (
    <section id="documentacion" className="bg-white py-[var(--spacing-section)]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Documentación técnica"
            title="Planos y archivos para CNC"
            description="Descargue esquemas de mecanizado, instrucciones de montaje y archivos de referencia para su fresadora."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col gap-6 rounded-[28px] border border-black/6 bg-[var(--color-bg)] p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                Google Drive — Tecnic
              </p>
              <p className="mt-2 max-w-xl text-[var(--color-muted)]">
                Carpeta con dibujos técnicos, archivos de mecanizado y material
                de apoyo para integrar GeniFix en su flujo de nesting.
              </p>
            </div>
            <a
              href={SITE.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--color-text)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              Descargar archivos
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
