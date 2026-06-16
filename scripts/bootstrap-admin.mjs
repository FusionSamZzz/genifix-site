import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);

function loadEnvLocal() {
  const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx);
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();
  process.env.SKIP_ADMIN_BOOTSTRAP = "1";

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD required in .env.local");
  }

  const { getPayload } = await import("payload");
  const configModule = await import("../payload.config.ts");
  const config = configModule.default;

  const payload = await getPayload({ config });
  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });

  if (existing.totalDocs > 0) {
    console.log("Admin already exists:", email);
  } else {
    await payload.create({
      collection: "users",
      data: { email, password },
    });
    console.log("Admin created:", email);
  }

  await payload.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
