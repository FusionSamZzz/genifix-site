import { getServerURL, isCiBuild } from "./database";

export async function payloadFetch<T>(path: string): Promise<T> {
  if (isCiBuild()) {
    throw new Error("Payload API is unavailable during CI build");
  }

  const url = `${getServerURL()}${path}`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Payload API ${path} failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
