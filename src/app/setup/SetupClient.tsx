"use client";

import { useEffect, useState } from "react";

type SetupState =
  | { phase: "idle" }
  | { phase: "running"; message: string }
  | { phase: "done" }
  | { phase: "error"; message: string };

export function SetupClient() {
  const [state, setState] = useState<SetupState>({ phase: "idle" });

  async function runSetup() {
    setState({ phase: "running", message: "Подключение к Neon…" });

    try {
      const response = await fetch("/api/setup/run", { method: "POST" });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        schema?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "setup failed");
      }

      setState({ phase: "done" });
      window.location.href = "/admin";
    } catch (error) {
      setState({
        phase: "error",
        message: error instanceof Error ? error.message : "setup failed",
      });
    }
  }

  useEffect(() => {
    void runSetup();
  }, []);

  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 560,
        margin: "4rem auto",
        padding: "0 1rem",
        lineHeight: 1.5,
      }}
    >
      <h1>GeniFix — настройка базы данных</h1>

      {state.phase === "running" ? (
        <p>{state.message} Подождите до 1 минуты.</p>
      ) : null}

      {state.phase === "idle" ? (
        <p>
          <button type="button" onClick={() => void runSetup()}>
            Запустить настройку
          </button>
        </p>
      ) : null}

      {state.phase === "error" ? (
        <>
          <p style={{ color: "#b00020" }}>Автонастройка не сработала:</p>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "1rem",
              overflow: "auto",
              fontSize: 14,
            }}
          >
            {state.message}
          </pre>
          <p>
            <button type="button" onClick={() => void runSetup()}>
              Повторить
            </button>
          </p>
          <hr />
          <h2>Ручная настройка (100% работает)</h2>
          <ol>
            <li>
              Откройте{" "}
              <a
                href="https://console.neon.tech"
                target="_blank"
                rel="noreferrer"
              >
                console.neon.tech
              </a>
            </li>
            <li>Проект <strong>genifix-onyx</strong> → SQL Editor</li>
            <li>
              Скачайте{" "}
              <a href="/neon-schema.sql" download>
                neon-schema.sql
              </a>{" "}
              и вставьте в редактор → Run
            </li>
            <li>
              Откройте <a href="/admin">/admin</a>
            </li>
          </ol>
        </>
      ) : null}
    </main>
  );
}
