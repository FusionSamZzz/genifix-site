import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { Client } = require("pg");

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

function getPoolerUri() {
  let uri = process.env.DATABASE_URI || process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URI is not set");
  uri = uri.replace(/[&?]channel_binding=[^&]+/g, "");
  uri = uri.replace(/\?&/, "?").replace(/\?$/, "");
  if (uri.includes(".neon.tech") && !uri.includes("-pooler.")) {
    uri = uri.replace(/(@ep-[^.]+)(\.)/, "$1-pooler$2");
  }
  return uri;
}

async function hashPassword(password) {
  const saltBuffer = await new Promise((resolveSalt, reject) => {
    crypto.randomBytes(32, (err, buf) => (err ? reject(err) : resolveSalt(buf)));
  });
  const salt = saltBuffer.toString("hex");
  const hashRaw = await new Promise((resolveHash, reject) => {
    crypto.pbkdf2(password, salt, 25000, 512, "sha256", (err, buf) =>
      err ? reject(err) : resolveHash(buf),
    );
  });
  return { salt, hash: hashRaw.toString("hex") };
}

async function main() {
  loadEnvLocal();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD required in .env.local");
  }

  const client = new Client({
    connectionString: getPoolerUri(),
    connectionTimeoutMillis: 30000,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const existing = await client.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [email],
  );

  if (existing.rowCount > 0) {
    console.log("Admin already exists:", email);
  } else {
    const { salt, hash } = await hashPassword(password);
    await client.query(
      `INSERT INTO users (email, salt, hash, created_at, updated_at)
       VALUES ($1, $2, $3, now(), now())`,
      [email, salt, hash],
    );
    console.log("Admin created:", email);
  }

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
