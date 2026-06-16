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

  let userCount: number | undefined;
  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUri!);
    const rows = await sql`SELECT count(*)::int AS n FROM users`;
    userCount = (rows[0] as { n: number } | undefined)?.n;
  } catch {
    userCount = undefined;
  }

  return Response.json({
    ok: true,
    runtime: { platform, vercelProject, nodeEnv: process.env.NODE_ENV },
    env,
    serverURL: getServerURL(),
    schemaReady: true,
    userCount,
    hint:
      userCount === 0
        ? "Таблицы есть, админ ещё не создан — откройте /admin (первый вход создаст пользователя)."
        : undefined,
  });
}
