import { getDatabaseUri, getServerURL, isNetlifyRuntime } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUri = getDatabaseUri();

  return Response.json({
    ok: Boolean(databaseUri) || !isNetlifyRuntime(),
    runtime: {
      netlify: isNetlifyRuntime(),
      nodeEnv: process.env.NODE_ENV,
    },
    env: {
      databaseUri: Boolean(databaseUri),
      payloadSecret: Boolean(process.env.PAYLOAD_SECRET),
      adminEmail: Boolean(process.env.ADMIN_EMAIL),
      adminPassword: Boolean(process.env.ADMIN_PASSWORD),
      siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL || process.env.URL),
    },
    serverURL: getServerURL(),
    hint: !databaseUri && isNetlifyRuntime()
      ? "DATABASE_URI missing at runtime. In Netlify set scope to All (not Builds only)."
      : undefined,
  });
}
