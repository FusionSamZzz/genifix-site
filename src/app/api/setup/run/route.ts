import { NextResponse } from "next/server";

import {
  ensureDatabaseSchemaWithRetry,
  isDatabaseReady,
} from "@/lib/setup-database";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  try {
    if (await isDatabaseReady()) {
      return NextResponse.json({ ok: true, schema: "exists" });
    }

    const schema = await ensureDatabaseSchemaWithRetry();
    return NextResponse.json({ ok: true, schema });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "setup failed",
      },
      { status: 500 },
    );
  }
}
