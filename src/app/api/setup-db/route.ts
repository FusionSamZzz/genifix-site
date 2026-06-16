import {
  getHostingPlatform,
  getServerURL,
  isServerlessHosted,
} from "@/lib/database";
import { ensureDatabaseSchema, getDirectDatabaseUri } from "@/lib/setup-database";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  const expected = process.env.PAYLOAD_SECRET;

  if (!expected || secret !== expected) {
    return Response.json(
      {
        ok: false,
        hint: "Add ?secret=YOUR_PAYLOAD_SECRET to the URL (same value as in Vercel env).",
      },
      { status: 401 },
    );
  }

  const databaseUri = getDirectDatabaseUri();
  if (!databaseUri && isServerlessHosted()) {
    return Response.json({
      ok: false,
      hint: "DATABASE_URI is missing in Vercel environment variables.",
    });
  }

  try {
    const schema = await ensureDatabaseSchema();

    const { default: config } = await import("@payload-config");
    const { getPayload } = await import("payload");
    const payload = await getPayload({ config });

    const users = await payload.find({ collection: "users", limit: 1 });

    return Response.json({
      ok: true,
      schema,
      adminReady: users.totalDocs > 0,
      runtime: { platform: getHostingPlatform(), nodeEnv: process.env.NODE_ENV },
      serverURL: getServerURL(),
      next: users.totalDocs > 0 ? "Open /admin" : "Open /admin to finish admin bootstrap",
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "setup failed",
        hint:
          "If this timed out, wait 30 seconds and open this URL again. Neon may be waking up.",
      },
      { status: 500 },
    );
  }
}
