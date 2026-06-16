import { redirect } from "next/navigation";

import {
  bootstrapPayloadAdmin,
  ensureDatabaseSchemaWithRetry,
  isDatabaseReady,
} from "@/lib/setup-database";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function SetupPage() {
  if (await isDatabaseReady()) {
    redirect("/admin");
  }

  let schema: "created" | "exists" = "exists";
  let adminReady = false;
  let error: string | undefined;

  try {
    schema = await ensureDatabaseSchemaWithRetry();
    try {
      adminReady = await bootstrapPayloadAdmin();
    } catch {
      // Admin bootstrap can run on first /admin visit after schema exists.
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "setup failed";
  }

  if (!error && (await isDatabaseReady())) {
    redirect("/admin");
  }

  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 520,
        margin: "4rem auto",
        padding: "0 1rem",
        lineHeight: 1.5,
      }}
    >
      <h1>GeniFix — настройка базы данных</h1>
      {error ? (
        <>
          <p style={{ color: "#b00020" }}>
            Не удалось подключиться к Neon или создать таблицы:
          </p>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "1rem",
              overflow: "auto",
              fontSize: 14,
            }}
          >
            {error}
          </pre>
          <p>
            Подождите 30 секунд и{" "}
            <a href="/setup">нажмите сюда, чтобы повторить</a>.
          </p>
        </>
      ) : (
        <p>Настройка… если страница не обновилась, откройте <a href="/setup">/setup</a> снова.</p>
      )}
      {adminReady ? <p>Админ уже создан — можно открыть <a href="/admin">/admin</a>.</p> : null}
    </main>
  );
}
