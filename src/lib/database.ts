/**
 * On Netlify/serverless use Neon pooler endpoint if a direct connection string was pasted.
 */
export function getDatabaseUri(): string | undefined {
  const uri = process.env.DATABASE_URI;
  if (!uri) return uri;

  const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (!isServerless) return uri;
  if (!uri.includes(".neon.tech") || uri.includes("-pooler.")) return uri;

  return uri.replace(/(@ep-[^.]+)(\.)/, "$1-pooler$2");
}

export function getServerURL(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
