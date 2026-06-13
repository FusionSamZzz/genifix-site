import config from "@payload-config";
import { getPayload } from "payload";

import { normalizeImageUrl } from "./utils";

export type PresentationVideo = {
  url: string;
  title: string;
  description: string;
};

function getMediaUrl(
  field: { url?: string | null } | string | number | null | undefined,
): string | null {
  if (field && typeof field === "object" && "url" in field && field.url) {
    return normalizeImageUrl(field.url);
  }
  return null;
}

export async function getSiteSettings(): Promise<{
  heroImageUrl: string | null;
  presentationVideo: PresentationVideo | null;
}> {
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 1,
    });

    const heroImageUrl = getMediaUrl(
      settings.heroImage as
        | { url?: string | null }
        | string
        | number
        | null
        | undefined,
    );

    const videoUrl = getMediaUrl(
      settings.presentationVideo as
        | { url?: string | null }
        | string
        | number
        | null
        | undefined,
    );

    const presentationVideo = videoUrl
      ? {
          url: videoUrl,
          title: String(settings.videoTitle || "Presentación GeniFix"),
          description: String(
            settings.videoDescription ||
              "Vea cómo funciona la strippping GeniFix.",
          ),
        }
      : null;

    return { heroImageUrl, presentationVideo };
  } catch {
    return { heroImageUrl: null, presentationVideo: null };
  }
}

export async function getPresentationVideo(): Promise<PresentationVideo | null> {
  const { presentationVideo } = await getSiteSettings();
  return presentationVideo;
}

export async function getHeroImageUrl(): Promise<string | null> {
  const { heroImageUrl } = await getSiteSettings();
  return heroImageUrl;
}
