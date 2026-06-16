import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Media } from "./src/collections/Media.ts";
import { Products } from "./src/collections/Products.ts";
import { Users } from "./src/collections/Users.ts";
import { SiteSettings } from "./src/globals/SiteSettings.ts";
import {
  getDatabaseUri,
  getServerURL,
  isCiBuild,
  isServerlessHosted,
} from "./src/lib/database.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const srcDir = path.resolve(dirname, "src");

const databaseUri = getDatabaseUri();
const migrationsDir = path.resolve(srcDir, "migrations");

if (isServerlessHosted() && !databaseUri) {
  console.error(
    "DATABASE_URI is missing in production. Add it in Vercel → Project → Settings → Environment Variables.",
  );
}

export default buildConfig({
  serverURL: getServerURL(),
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — GeniFix Admin",
    },
    importMap: {
      autoGenerate: true,
      importMapFile: path.resolve(
        srcDir,
        "app/(payload)/admin/importMap.js",
      ),
    },
  },
  collections: [Users, Media, Products],
  globals: [SiteSettings],
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-in-production",
  typescript: {
    outputFile: path.resolve(srcDir, "payload-types.ts"),
  },
  db: databaseUri
    ? postgresAdapter({
        pool: {
          connectionString: databaseUri,
          max: 1,
          idleTimeoutMillis: 0,
          connectionTimeoutMillis: 30000,
          ssl: databaseUri.includes("neon.tech")
            ? { rejectUnauthorized: false }
            : undefined,
        },
        push: false,
        migrationDir: migrationsDir,
      })
    : sqliteAdapter({
        client: {
          url: `file:${path.resolve(dirname, "data.db")}`,
        },
        push: true,
        migrationDir: migrationsDir,
      }),
  sharp,
  upload: {
    limits: {
      fileSize: 100_000_000,
    },
  },
  onInit: async (payload) => {
    if (isCiBuild() || process.env.SKIP_ADMIN_BOOTSTRAP === "1") return;

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return;

    try {
      const existing = await payload.find({
        collection: "users",
        where: { email: { equals: email } },
        limit: 1,
      });

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: "users",
          data: { email, password },
        });
      }
    } catch (error) {
      console.error("Admin bootstrap skipped:", error);
    }
  },
});
