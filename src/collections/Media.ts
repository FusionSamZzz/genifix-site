import type { CollectionConfig } from "payload";

import { getMediaStaticDir } from "../lib/media";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  upload: {
    staticDir: getMediaStaticDir(),
    mimeTypes: ["image/*", "video/mp4", "video/webm", "video/quicktime"],
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 400,
        position: "centre",
      },
      {
        name: "card",
        width: 800,
        height: 800,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Descripción / alt",
    },
  ],
};
