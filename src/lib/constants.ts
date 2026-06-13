export const SITE = {
  name: "GeniFix",
  tagline: "Conexión inteligente para muebles",
  description:
    "Stripping para muebles de anidamiento CNC. Un solo tool, montaje intuitivo, sin espigas ni taladro en canto.",
  phone: "02233390267",
  phoneHref: "tel:+542233390267",
  whatsapp: "5492233390267",
  whatsappMessage: "Hola, me interesa GeniFix",
  email: "info@genifix.com.ar",
  address: "ONYX MUEBLES, Mar del Plata, Argentina",
  mapsUrl:
    "https://www.google.com/maps/place/ONYX+MUEBLES/@-38.0620221,-57.5689158,17z",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3142.5!2d-57.566741!3d-38.062022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584df2d06dc4229%3A0x1fbe2a6167ae1f84!2sONYX%20MUEBLES!5e0!3m2!1ses!2sar!4v1718300000000!5m2!1ses!2sar",
  driveUrl:
    "https://drive.google.com/drive/folders/1N98bIfrM7IJSxZIpcR1bSKlDo6015RSM?usp=sharing",
} as const;

export const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#productos", label: "Productos" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contactos", label: "Contactos" },
  { href: "#documentacion", label: "Documentación" },
] as const;

export const BENEFITS = [
  {
    title: "Montaje rápido",
    description:
      "Un solo movimiento con llave Allen. La unión queda lista en segundos.",
    icon: "⚡",
  },
  {
    title: "Conexión resistente",
    description:
      "Fijación metálica precisa. No se afloja con el uso diario del mueble.",
    icon: "🔩",
  },
  {
    title: "Sin taladro en canto",
    description:
      "Todo se fresa en el CNC. No necesita máquina de taladro lateral.",
    icon: "🎯",
  },
  {
    title: "Sin espigas",
    description:
      "Elimina dowels y operaciones extra. Menos piezas, menos errores.",
    icon: "✦",
  },
  {
    title: "Listo para armar",
    description:
      "Después de instalar la strippping, el mueble queda preparado para el montaje final.",
    icon: "✓",
  },
] as const;

export type FallbackProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  currency: "ARS" | "USD";
  description: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
};

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  {
    id: "1",
    name: "GeniFix 12mm",
    slug: "genifix-12mm",
    sku: "GF-12",
    price: 0,
    currency: "ARS",
    description:
      "Stripping de 12 mm para tableros estándar. Fresado CNC completo, montaje con una sola herramienta.",
    imageUrl: "/images/hero-genifix.svg",
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "GeniFix 8mm",
    slug: "genifix-8mm",
    sku: "GF-08",
    price: 0,
    currency: "ARS",
    description:
      "Mismo cuerpo que la versión 12 mm. Difiere únicamente en el perno incluido.",
    imageUrl: "/images/hero-genifix.svg",
    inStock: true,
    featured: true,
  },
];
