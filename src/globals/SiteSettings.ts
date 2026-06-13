import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Configuración del sitio",
  admin: {
    description:
      "Imagen del inicio (hero), video en Productos y otros ajustes globales.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "collapsible",
      label: "Imagen de inicio (Hero)",
      fields: [
        {
          name: "heroImage",
          type: "upload",
          relationTo: "media",
          label: "Foto de fondo",
          admin: {
            description:
              "Suba una foto en Media (JPG/PNG/WebP) y selecciónela aquí. Se muestra detrás del texto en la página principal.",
          },
        },
      ],
    },
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
            description:
              "El bloque de video aparece en Productos solo cuando sube un archivo aquí.",
          },
        },
      ],
    },
  ],
};
