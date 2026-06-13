/**
 * Database helpers for local dev, Netlify, and Neon.
 */
export function getDatabaseUri(): string | undefined {
  const uri = process.env.DATABASE_URI || process.env.DATABASE_URL;
  if (!uri) return undefined;

  const isServerless = Boolean(
    process.env.NETLIFY ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY_DEV,
  );

  if (!isServerless) return uri;
  if (!uri.includes(".neon.tech") || uri.includes("-pooler.")) return uri;

  // Neon pooler is required for Netlify serverless functions.
  return uri.replace(/(@ep-[^.]+)(\.)/, "$1-pooler$2");
}

export function getServerURL(): string {
  const netlifyUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;
  const configured = process.env.NEXT_PUBLIC_SITE_URL;

  const url =
    isNetlifyRuntime() && netlifyUrl
      ? netlifyUrl
      : configured || netlifyUrl || "http://localhost:3000";

  return url.replace(/\/$/, "");
}

export function isNetlifyRuntime(): boolean {
  return Boolean(
    process.env.NETLIFY ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY_DEV,
  );
}
