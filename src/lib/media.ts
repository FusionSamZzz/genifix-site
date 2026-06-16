import path from "path";
import { fileURLToPath } from "url";

import { isServerlessHosted } from "./database.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/** Writable on Vercel/Netlify serverless; local uploads stay in public/media. */
export function getMediaStaticDir(): string {
  if (isServerlessHosted()) {
    return "/tmp/genifix-media";
  }

  return path.resolve(dirname, "../../public/media");
}
