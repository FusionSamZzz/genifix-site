/**
 * Runs during `next build` inside the Next.js process (not a standalone script).
 * Payload creates DB tables only when NODE_ENV !== "production" and push is enabled.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;
  if (process.env.GENIFIX_SCHEMA_PUSHED === "1") return;
  if (process.env.PAYLOAD_PUSH !== "true") return;
  if (!process.env.DATABASE_URI && !process.env.DATABASE_URL) return;

  process.env.GENIFIX_SCHEMA_PUSHED = "1";

  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";

  try {
    console.log("[db] Creating Payload tables in PostgreSQL…");

    const { getPayload } = await import("payload");
    const { default: config } = await import("./payload.config");
    const payload = await getPayload({ config });

    console.log("[db] Database schema ready");

    if (typeof payload.db?.destroy === "function") {
      await payload.db.destroy();
    }
  } catch (error) {
    console.error("[db] Schema setup failed:", error);
    throw error;
  } finally {
    process.env.NODE_ENV = previousNodeEnv;
  }
}
