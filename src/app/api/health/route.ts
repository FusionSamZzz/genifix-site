import {
  getDatabaseUri,
  getHostingPlatform,
  getServerURL,
  isServerlessHosted,
} from "@/lib/database";
import { isDatabaseReady } from "@/lib/setup-database";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  const databaseUri = getDatabaseUri();
  const platform = getHostingPlatform();
  const vercelProject = process.env.VERCEL_URL;

  const env = {
    databaseUri: Boolean(databaseUri),
    payloadSecret: Boolean(process.env.PAYLOAD_SECRET),
    adminEmail: Boolean(process.env.ADMIN_EMAIL),
    adminPassword: Boolean(process.env.ADMIN_PASSWORD),
    siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL),
  };

  if (!databaseUri && isServerlessHosted()) {
    return Response.json({
      ok: false,
      runtime: { platform, vercelProject, nodeEnv: process.env.NODE_ENV },
      env,
      serverURL: getServerURL(),
      hint:
        "DATABASE_URI не задан в Vercel. Откройте проект genifix-site → Settings → Environment Variables и добавьте все 4–5 переменных. Затем Redeploy.",
    });
  }

  const schemaReady = await isDatabaseReady();

  if (!schemaReady) {
    return Response.json({
      ok: false,
      runtime: { platform, vercelProject, nodeEnv: process.env.NODE_ENV },
      env,
      serverURL: getServerURL(),
      schemaReady: false,
      hint:
        "Таблицы в Neon ещё не созданы. Один раз откройте https://genifix-site.vercel.app/setup и подождите до 1–2 минут.",
    });
  }

  let payloadOk = false;
  let payloadError: string | undefined;

  try {
    const { default: config } = await import("@payload-config");
    const { getPayload } = await import("payload");
    const payload = await getPayload({ config });
    const users = await payload.find({ collection: "users", limit: 1 });
    payloadOk = true;
    payloadError = users.totalDocs === 0 ? "no admin user yet — open /admin once" : undefined;
  } catch (error) {
    payloadError =
      error instanceof Error ? error.message : "payload init failed";
  }

  return Response.json({
    ok: payloadOk,
    runtime: { platform, vercelProject, nodeEnv: process.env.NODE_ENV },
    env,
    serverURL: getServerURL(),
    schemaReady: true,
    payload: { ok: payloadOk, error: payloadError },
    hint: payloadError,
  });
}
