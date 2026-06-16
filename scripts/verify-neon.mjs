import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { Client } = require("pg");

function loadUri() {
  const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of content.split("\n")) {
    if (line.startsWith("DATABASE_URI=")) {
      return line.slice("DATABASE_URI=".length).trim();
    }
  }
  throw new Error("DATABASE_URI not found in .env.local");
}

const uri = loadUri();
const client = new Client({
  connectionString: uri,
  connectionTimeoutMillis: 20000,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  const ping = await client.query("SELECT 1 AS ok");
  const users = await client.query(
    "SELECT to_regclass('public.users') AS users_table",
  );
  const count = await client.query("SELECT count(*)::int AS n FROM users");
  console.log(
    JSON.stringify(
      {
        ok: true,
        ping: ping.rows[0]?.ok === 1,
        usersTable: Boolean(users.rows[0]?.users_table),
        userCount: count.rows[0]?.n ?? 0,
        host: uri.includes("-pooler.") ? "pooler" : "direct",
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.log(
    JSON.stringify(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exit(1);
} finally {
  await client.end();
}
