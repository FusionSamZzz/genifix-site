import config from "@payload-config";
import { getPayload } from "payload";

import { type FallbackProduct } from "./constants";
import { isCiBuild } from "./database";
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
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "products",
      sort: "sortOrder",
      depth: 1,
      limit: 50,
    });

    return docs.map((doc) => mapPayloadProduct(doc as Record<string, unknown>));
  } catch (error) {
    console.error("getProducts failed:", error);
    return [];
  }
}
