import config from "@payload-config";
import "@payloadcms/next/css";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { isDatabaseReady } from "@/lib/setup-database";

import { importMap } from "./admin/importMap.js";

export const maxDuration = 60;

type Args = {
  children: ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

export default async function PayloadLayout({ children }: Args) {
  const ready = await isDatabaseReady();
  if (!ready) {
    redirect("/setup");
  }

  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
