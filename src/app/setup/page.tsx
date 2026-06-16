import { redirect } from "next/navigation";

import { isDatabaseReady } from "@/lib/setup-database";

import { SetupClient } from "./SetupClient";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  if (await isDatabaseReady()) {
    redirect("/admin");
  }

  return <SetupClient />;
}
