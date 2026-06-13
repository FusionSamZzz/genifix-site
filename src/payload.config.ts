import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Media } from "./collections/Media";
import { Products } from "./collections/Products";
import { Users } from "./collections/Users";
import { SiteSettings } from "./globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const usePostgres = Boolean(process.env.DATABASE_URI);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — GeniFix Admin",
    },
  },
  collections: [Users, Media, Products],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-in-production",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: usePostgres
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URI,
        },
      })
    : sqliteAdapter({
        client: {
          url: `file:${path.resolve(dirname, "../data.db")}`,
        },
      }),
  sharp,
  upload: {
    limits: {
      fileSize: 100_000_000,
    },
  },
  onInit: async (payload) => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return;

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
  },
});
