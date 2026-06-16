import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { neon } from "@neondatabase/serverless";

function loadDatabaseUri() {
  if (process.env.DATABASE_URI) return process.env.DATABASE_URI;
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf8");

    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const [key, ...rest] = trimmed.split("=");
      if (key === "DATABASE_URI" || key === "DATABASE_URL") {
        const value = rest.join("=").trim().replace(/^["']|["']$/g, "");
        if (value) return value;
      }
    }
  } catch {
    // .env.local missing
  }

  return undefined;
}

function normalizeUri(uri) {
  let normalized = uri.includes("-pooler.")
    ? uri.replace("-pooler.", ".")
    : uri;

  if (normalized.includes("neon.tech") && !normalized.includes("sslmode=")) {
    normalized += normalized.includes("?") ? "&" : "?";
    normalized += "sslmode=require";
  }

  return normalized;
}

async function main() {
  const rawUri = loadDatabaseUri();
  if (!rawUri) {
    console.error(
      "DATABASE_URI пустой.\n\n" +
        "1. Vercel → genifix-site → Settings → Environment Variables\n" +
        "2. Скопируйте DATABASE_URI (иконка глаза)\n" +
        "3. Вставьте в d:\\genifix\\.env.local как DATABASE_URI=postgresql://...\n" +
        "4. Запустите снова: npm run db:setup",
    );
    process.exit(1);
  }

  const sqlPath = resolve(process.cwd(), "public", "neon-schema.sql");
  const schemaSql = readFileSync(sqlPath, "utf8");
  const sql = neon(normalizeUri(rawUri));

  console.log("Подключение к Neon…");
  await sql`SELECT 1`;
  console.log("Создание таблиц…");
  await sql.query(schemaSql);
  console.log("Готово! Таблицы созданы.");
  console.log("Откройте: https://genifix-site.vercel.app/admin");
}

main().catch((error) => {
  console.error("Ошибка:", error instanceof Error ? error.message : error);
  process.exit(1);
});
