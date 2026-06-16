/**
 * Database and hosting helpers for local dev, Vercel, Netlify, and Neon.
 */

import { getDirectDatabaseUri } from "./setup-database";

/** Vercel/Netlify production build — not a live serverless request. */
export function isCiBuild(): boolean {
  return (
    process.env.CI === "1" ||
    process.env.CI === "true" ||
    process.env.NEXT_PHASE === "phase-production-build"
  );
}

export function getDatabaseUri(): string | undefined {
  return getDirectDatabaseUri();
}

export { getDirectDatabaseUri };

export function isServerlessHosted(): boolean {
  return Boolean(
    process.env.VERCEL ||
      process.env.NETLIFY ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY_DEV,
  );
}

/** @deprecated Use isServerlessHosted */
export function isNetlifyRuntime(): boolean {
  return isServerlessHosted();
}

export function getHostingPlatform(): "vercel" | "netlify" | "local" {
  if (process.env.VERCEL) return "vercel";
  if (process.env.NETLIFY) return "netlify";
  return "local";
}

export function getServerURL(): string {
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const vercelUrl = vercelHost ? `https://${vercelHost}` : undefined;
  const netlifyUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;
  const configured = process.env.NEXT_PUBLIC_SITE_URL;

  const url =
    process.env.VERCEL && (vercelUrl || configured)
      ? vercelUrl || configured!
      : process.env.NETLIFY && netlifyUrl
        ? netlifyUrl
        : configured || vercelUrl || netlifyUrl || "http://localhost:3000";

  return url.replace(/\/$/, "");
}
