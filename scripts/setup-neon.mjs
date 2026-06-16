import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { Client } = require("pg");

function loadDatabaseUri() {
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

  if (process.env.DATABASE_URI) return process.env.DATABASE_URI;
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

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
  const client = new Client({
    connectionString: normalizeUri(rawUri),
    connectionTimeoutMillis: 30000,
    ssl: rawUri.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
  });

  console.log("Подключение к Neon…");
  await client.connect();
  try {
    const ready = await client.query(
      `SELECT to_regclass('public.users') AS exists`,
    );
    if (ready.rows[0]?.exists) {
      console.log("Готово! Таблицы уже существуют.");
      console.log("Откройте: https://genifix-site.vercel.app/admin");
      return;
    }

    const partial = await client.query(
      `SELECT 1 FROM pg_type WHERE typname = 'enum_products_currency' LIMIT 1`,
    );
    if (partial.rowCount > 0) {
      console.log("Сброс незавершённой схемы…");
      await client.query(`
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO neondb_owner;
        GRANT ALL ON SCHEMA public TO public;
      `);
    }

    console.log("Создание таблиц…");
    await client.query(schemaSql);
    console.log("Готово! Таблицы созданы.");
    console.log("Откройте: https://genifix-site.vercel.app/admin");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Ошибка:", error);
  process.exit(1);
});
