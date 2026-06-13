import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Configuración del sitio",
  admin: {
    description:
      "Video de presentación en la sección Productos y otros ajustes globales.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "collapsible",
      label: "Video de presentación (Productos)",
      fields: [
        {
          name: "videoTitle",
          type: "text",
          label: "Título del video",
          defaultValue: "Presentación GeniFix",
        },
        {
          name: "videoDescription",
          type: "textarea",
          label: "Descripción",
          defaultValue:
            "Vea cómo funciona la strippping GeniFix: montaje rápido con una sola herramienta.",
        },
        {
          name: "presentationVideo",
          type: "upload",
          relationTo: "media",
          label: "Archivo de video (MP4, WebM)",
          admin: {
            description: "Suba el video en Media (tipo video) y selecciónelo aquí.",
          },
        },
      ],
    },
  ],
};
