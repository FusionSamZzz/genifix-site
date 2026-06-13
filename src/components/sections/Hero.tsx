"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { BENEFITS, SITE } from "@/lib/constants";
import { whatsappUrl } from "@/lib/utils";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden bg-[#1a2228]"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <Image
          src="/images/hero-genifix.svg"
          alt="GeniFix furniture connector"
          fill
          priority
          className="object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2228]/30 via-[#1a2228]/55 to-[#F5F5F7]" />
      </motion.div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
            CNC · Nesting · Un solo tool
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">
            {SITE.tagline}
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            La strippping GeniFix se fresa completamente en el CNC. Montaje
            intuitivo, imposible atornillar mal, sin espigas ni taladro en canto.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="#productos" variant="primary">
              Ver productos
            </Button>
            <Button href={whatsappUrl()} variant="ghost" external>
              Consultar por WhatsApp
            </Button>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {BENEFITS.map((benefit, index) => (
            <Reveal key={benefit.title} delay={0.1 + index * 0.06}>
              <article className="group h-full rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:bg-white/15">
                <span className="text-2xl">{benefit.icon}</span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {benefit.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
