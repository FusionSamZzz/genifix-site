import config from "@payload-config";
import { getPayload } from "payload";

import { getDatabaseUri, getServerURL, isNetlifyRuntime } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUri = getDatabaseUri();
  let payloadOk = false;
  let payloadError: string | undefined;

  if (databaseUri || !isNetlifyRuntime()) {
    try {
      const payload = await getPayload({ config });
      const users = await payload.find({ collection: "users", limit: 1 });
      payloadOk = true;
      payloadError = users.totalDocs === 0 ? "no admin user yet" : undefined;
    } catch (error) {
      payloadError =
        error instanceof Error ? error.message : "payload init failed";
    }
  }

  const serverURL = getServerURL();
  const expectedUrl = process.env.URL?.replace(/\/$/, "");
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const siteUrlMismatch =
    Boolean(expectedUrl) &&
    Boolean(configuredUrl) &&
    configuredUrl !== expectedUrl;

  return Response.json({
    ok: payloadOk,
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
    serverURL,
    siteUrlMismatch,
    payload: {
      ok: payloadOk,
      error: payloadError,
    },
    hint: !databaseUri && isNetlifyRuntime()
      ? "DATABASE_URI missing at runtime. In Netlify set scope to All (not Builds only)."
      : siteUrlMismatch
        ? `Update NEXT_PUBLIC_SITE_URL to ${expectedUrl}`
        : payloadError,
  });
}
