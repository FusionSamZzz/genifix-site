"use client";

import { Reveal } from "@/components/ui/Reveal";
import type { PresentationVideo } from "@/lib/getSiteSettings";

type ProductVideoProps = {
  video: PresentationVideo;
};

export function ProductVideo({ video }: ProductVideoProps) {
  return (
    <Reveal delay={0.1}>
      <div className="mt-20 overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-[0_24px_80px_-40px_rgba(0,0,0,0.2)]">
        <div className="border-b border-black/5 px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Video
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
            {video.title}
          </h3>
          {video.description ? (
            <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
              {video.description}
            </p>
          ) : null}
        </div>
        <div className="bg-[#0f1418] p-4 sm:p-6">
          <video
            controls
            playsInline
            preload="metadata"
            className="mx-auto w-full max-w-4xl rounded-2xl"
            src={video.url}
          >
            Su navegador no soporta reproducción de video.
          </video>
        </div>
      </div>
    </Reveal>
  );
}
