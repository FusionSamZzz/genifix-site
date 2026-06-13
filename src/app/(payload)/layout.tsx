import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@payloadcms/next/css";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return children;
}
