import config from "@payload-config";
import { getPayload } from "payload";

import {
  getDatabaseUri,
  getHostingPlatform,
  getServerURL,
  isServerlessHosted,
} from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUri = getDatabaseUri();
  let payloadOk = false;
  let payloadError: string | undefined;

  if (databaseUri || !isServerlessHosted()) {
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
  const platform = getHostingPlatform();

  return Response.json({
    ok: payloadOk,
    runtime: {
      platform,
      nodeEnv: process.env.NODE_ENV,
    },
    env: {
      databaseUri: Boolean(databaseUri),
      payloadSecret: Boolean(process.env.PAYLOAD_SECRET),
      adminEmail: Boolean(process.env.ADMIN_EMAIL),
      adminPassword: Boolean(process.env.ADMIN_PASSWORD),
      siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL),
    },
    serverURL,
    payload: {
      ok: payloadOk,
      error: payloadError,
    },
    hint: !databaseUri && isServerlessHosted()
      ? "DATABASE_URI missing. Add it in Vercel → Settings → Environment Variables."
      : payloadError,
  });
}
