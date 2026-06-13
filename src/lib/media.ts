import path from "path";
import { fileURLToPath } from "url";

import { isNetlifyRuntime } from "./database";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/** Writable on Netlify serverless; local uploads stay in public/media. */
export function getMediaStaticDir(): string {
  if (isNetlifyRuntime()) {
    return "/tmp/genifix-media";
  }

  return path.resolve(dirname, "../../public/media");
}
