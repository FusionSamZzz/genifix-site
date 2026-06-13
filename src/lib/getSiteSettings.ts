import config from "@payload-config";
import { getPayload } from "payload";

export type PresentationVideo = {
  url: string;
  title: string;
  description: string;
};

export async function getPresentationVideo(): Promise<PresentationVideo | null> {
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 1,
    });

    const videoField = settings.presentationVideo as
      | { url?: string | null; mimeType?: string | null }
      | string
      | number
      | null
      | undefined;

    const url =
      videoField &&
      typeof videoField === "object" &&
      "url" in videoField &&
      videoField.url
        ? videoField.url
        : null;

    if (!url) return null;

    return {
      url,
      title: String(settings.videoTitle || "Presentación GeniFix"),
      description: String(
        settings.videoDescription ||
          "Vea cómo funciona la strippping GeniFix.",
      ),
    };
  } catch {
    return null;
  }
}
