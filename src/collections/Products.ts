import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "sku", "price", "inStock", "updatedAt"],
    description:
      "Agregue productos con foto, precio y descripción. GeniFix 8mm y 12mm comparten el mismo cuerpo.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nombre",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL amigable, ej: genifix-12mm",
      },
    },
    {
      name: "sku",
      type: "text",
      label: "Artículo / SKU",
    },
    {
      name: "price",
      type: "number",
      required: true,
      label: "Precio",
      min: 0,
    },
    {
      name: "currency",
      type: "select",
      label: "Moneda",
      defaultValue: "ARS",
      options: [
        { label: "ARS (Peso argentino)", value: "ARS" },
        { label: "USD (Dólar)", value: "USD" },
      ],
    },
    {
      name: "description",
      type: "textarea",
      label: "Descripción",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Foto principal",
    },
    {
      name: "inStock",
      type: "checkbox",
      label: "En stock",
      defaultValue: true,
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Destacado",
      defaultValue: false,
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Orden",
      defaultValue: 0,
      admin: {
        description: "Menor número = aparece primero",
      },
    },
  ],
};
