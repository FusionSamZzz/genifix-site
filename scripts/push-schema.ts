/**
 * Creates Payload tables in Neon before `next build`.
 * Payload only runs pushDevSchema when NODE_ENV !== "production".
 */
async function main() {
  if (!process.env.DATABASE_URI && !process.env.DATABASE_URL) {
    console.log("[db] DATABASE_URI not set — skipping schema push");
    return;
  }

  if (process.env.PAYLOAD_PUSH !== "true") {
    console.log("[db] PAYLOAD_PUSH is not true — skipping schema push");
    return;
  }

  process.env.NODE_ENV = "development";

  console.log("[db] Pushing Payload schema to PostgreSQL…");

  const { getPayload } = await import("payload");
  const { default: config } = await import("../src/payload.config");
  const payload = await getPayload({ config });

  console.log("[db] Schema push complete");

  if (typeof payload.db?.destroy === "function") {
    await payload.db.destroy();
  }
}

main().catch((error) => {
  console.error("[db] Schema push failed:", error);
  process.exit(1);
});
