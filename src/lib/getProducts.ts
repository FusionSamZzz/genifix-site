import { type FallbackProduct } from "./constants";
import { isCiBuild } from "./database";
import { payloadFetch } from "./payload-api";
import { normalizeImageUrl } from "./utils";

export type ProductItem = FallbackProduct;

function mapPayloadProduct(doc: Record<string, unknown>): ProductItem {
  const imageField = doc.image as
    | { url?: string | null }
    | string
    | number
    | null
    | undefined;

  const image =
    imageField &&
    typeof imageField === "object" &&
    "url" in imageField &&
    imageField.url
      ? imageField.url
      : "/images/hero-genifix.svg";

  return {
    id: String(doc.id),
    name: String(doc.name || ""),
    slug: String(doc.slug || ""),
    sku: String(doc.sku || ""),
    price: Number(doc.price || 0),
    currency: (doc.currency as "ARS" | "USD") || "ARS",
    description: String(doc.description || ""),
    imageUrl: normalizeImageUrl(image),
    inStock: Boolean(doc.inStock),
    featured: Boolean(doc.featured),
  };
}

export async function getProducts(): Promise<ProductItem[]> {
  if (isCiBuild()) return [];

  try {
    const data = await payloadFetch<{ docs: Record<string, unknown>[] }>(
      "/api/products?limit=50&depth=1&sort=sortOrder",
    );

    return data.docs.map((doc) => mapPayloadProduct(doc));
  } catch (error) {
    console.error("getProducts failed:", error);
    return [];
  }
}
