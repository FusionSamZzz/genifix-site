import { neon } from "@neondatabase/serverless";

const MIGRATION_NAME = "20260616_014745_initial";

/** Neon DDL requires a direct connection; pooler breaks migrations. */
export function getDirectDatabaseUri(): string | undefined {
  let uri = process.env.DATABASE_URI || process.env.DATABASE_URL;
  if (!uri) return undefined;

  if (uri.includes("-pooler.")) {
    uri = uri.replace("-pooler.", ".");
  }

  if (uri.includes("neon.tech") && !uri.includes("sslmode=")) {
    const separator = uri.includes("?") ? "&" : "?";
    uri = `${uri}${separator}sslmode=require`;
  }

  return uri;
}

export function getDatabaseUri(): string | undefined {
  return getDirectDatabaseUri();
}

const INITIAL_SCHEMA_SQL = `
CREATE TYPE "public"."enum_products_currency" AS ENUM('ARS', 'USD');

CREATE TABLE "users_sessions" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "created_at" timestamp(3) with time zone,
  "expires_at" timestamp(3) with time zone NOT NULL
);

CREATE TABLE "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "email" varchar NOT NULL,
  "reset_password_token" varchar,
  "reset_password_expiration" timestamp(3) with time zone,
  "salt" varchar,
  "hash" varchar,
  "login_attempts" numeric DEFAULT 0,
  "lock_until" timestamp(3) with time zone
);

CREATE TABLE "media" (
  "id" serial PRIMARY KEY NOT NULL,
  "alt" varchar NOT NULL,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "url" varchar,
  "thumbnail_u_r_l" varchar,
  "filename" varchar,
  "mime_type" varchar,
  "filesize" numeric,
  "width" numeric,
  "height" numeric,
  "focal_x" numeric,
  "focal_y" numeric,
  "sizes_thumbnail_url" varchar,
  "sizes_thumbnail_width" numeric,
  "sizes_thumbnail_height" numeric,
  "sizes_thumbnail_mime_type" varchar,
  "sizes_thumbnail_filesize" numeric,
  "sizes_thumbnail_filename" varchar,
  "sizes_card_url" varchar,
  "sizes_card_width" numeric,
  "sizes_card_height" numeric,
  "sizes_card_mime_type" varchar,
  "sizes_card_filesize" numeric,
  "sizes_card_filename" varchar
);

CREATE TABLE "products" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "slug" varchar NOT NULL,
  "sku" varchar,
  "price" numeric NOT NULL,
  "currency" "enum_products_currency" DEFAULT 'ARS',
  "description" varchar,
  "image_id" integer NOT NULL,
  "in_stock" boolean DEFAULT true,
  "featured" boolean DEFAULT false,
  "sort_order" numeric DEFAULT 0,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "payload_kv" (
  "id" serial PRIMARY KEY NOT NULL,
  "key" varchar NOT NULL,
  "data" jsonb NOT NULL
);

CREATE TABLE "payload_locked_documents" (
  "id" serial PRIMARY KEY NOT NULL,
  "global_slug" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "payload_locked_documents_rels" (
  "id" serial PRIMARY KEY NOT NULL,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" varchar NOT NULL,
  "users_id" integer,
  "media_id" integer,
  "products_id" integer
);

CREATE TABLE "payload_preferences" (
  "id" serial PRIMARY KEY NOT NULL,
  "key" varchar,
  "value" jsonb,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "payload_preferences_rels" (
  "id" serial PRIMARY KEY NOT NULL,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" varchar NOT NULL,
  "users_id" integer
);

CREATE TABLE "payload_migrations" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar,
  "batch" numeric,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "site_settings" (
  "id" serial PRIMARY KEY NOT NULL,
  "hero_image_id" integer,
  "video_title" varchar DEFAULT 'Presentación GeniFix',
  "video_description" varchar DEFAULT 'Vea cómo funciona la strippping GeniFix: montaje rápido con una sola herramienta.',
  "presentation_video_id" integer,
  "updated_at" timestamp(3) with time zone,
  "created_at" timestamp(3) with time zone
);

ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_presentation_video_id_media_id_fk" FOREIGN KEY ("presentation_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
CREATE INDEX "site_settings_hero_image_idx" ON "site_settings" USING btree ("hero_image_id");
CREATE INDEX "site_settings_presentation_video_idx" ON "site_settings" USING btree ("presentation_video_id");
`;

function getCheckDatabaseUri(): string | undefined {
  const uri = process.env.DATABASE_URI || process.env.DATABASE_URL;
  if (!uri) return undefined;

  if (
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY
  ) {
    return uri;
  }

  return getDirectDatabaseUri();
}

function getNeonSql() {
  const connectionString = getCheckDatabaseUri();
  if (!connectionString) {
    throw new Error("DATABASE_URI is not configured");
  }
  return neon(connectionString);
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`database timeout after ${ms}ms`)), ms);
    }),
  ]);
}

export async function isDatabaseReady(): Promise<boolean> {
  try {
    return await withTimeout(
      (async () => {
        const sql = getNeonSql();
        const rows = await sql`SELECT to_regclass('public.users') AS exists`;
        const row = rows[0] as { exists: string | null } | undefined;
        return row?.exists != null;
      })(),
      10_000,
    );
  } catch {
    return false;
  }
}

export async function ensureDatabaseSchema(): Promise<"created" | "exists"> {
  if (await isDatabaseReady()) {
    return "exists";
  }

  const sql = getNeonSql();

  await sql`SELECT 1`;
  await sql.query(INITIAL_SCHEMA_SQL);
  await sql.query(
    `INSERT INTO payload_migrations (name, batch, created_at, updated_at)
     SELECT $1, 1, now(), now()
     WHERE NOT EXISTS (
       SELECT 1 FROM payload_migrations WHERE name = $1
     )`,
    [MIGRATION_NAME],
  );

  return "created";
}

export async function ensureDatabaseSchemaWithRetry(
  attempts = 2,
): Promise<"created" | "exists"> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await withTimeout(ensureDatabaseSchema(), 45_000);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("database setup failed");
}

export async function bootstrapPayloadAdmin(): Promise<boolean> {
  const { default: config } = await import("@payload-config");
  const { getPayload } = await import("payload");
  const payload = await getPayload({ config });
  const users = await payload.find({ collection: "users", limit: 1 });
  return users.totalDocs > 0;
}
