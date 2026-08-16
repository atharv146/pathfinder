"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FLAG_RESOURCES, type FlagTopic } from "@/lib/ai/flags";

type Message = {
  role: "user" | "assistant";
  content: string;
  flags?: FlagTopic[];
};

const STARTERS = [
  "What does test-optional actually mean for me?",
  "How does financial aid work if my parents aren't citizens?",
  "Do my after-school responsibilities count as activities?",
];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Prior conversation. The route replays history to the model server-side, so
  // without this the assistant would remember a conversation the user can't
  // see — which reads as broken. RLS scopes the read to this user.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("chat_messages")
        .select("role, content, flagged_topics")
        .order("created_at", { ascending: true })
        .limit(40);

      if (!cancelled && data) {
        setMessages(
          data.map((row) => ({
            role: row.role as "user" | "assistant",
            content: row.content,
            flags: (row.flagged_topics ?? []) as FlagTopic[],
          }))
        );
      }
      if (!cancelled) setLoadingHistory(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming]);

  const send = useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || streaming) return;

      setError(null);
      setInput("");
      setMessages((m) => [...m, { role: "user", content: text }]);
      setStreaming(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });

        if (!res.ok || !res.body) {
          const payload = await res.json().catch(() => null);
          setError(
            payload?.error ?? "Something went wrong. Please try again."
          );
          setStreaming(false);
          return;
        }

        const flags = (res.headers.get("X-Pathfinder-Flags") ?? "")
          .split(",")
          .filter(Boolean) as FlagTopic[];

        // Placeholder bubble that fills in as tokens arrive.
        setMessages((m) => [...m, { role: "assistant", content: "", flags }]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let answer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
          setMessages((m) => {
            const next = [...m];
            next[next.length - 1] = {
              role: "assistant",
              content: answer,
              flags,
            };
            return next;
          });
        }
      } catch {
        setError("Lost connection before that finished. Please try again.");
      } finally {
        setStreaming(false);
        inputRef.current?.focus();
      }
    },
    [streaming]
  );

  const isEmpty = messages.length === 0 && !loadingHistory;

  return (
    <div className="flex w-full max-w-2xl flex-col">
      {/* Transcript */}
      <div
        ref={scrollRef}
        className="max-h-[55vh] min-h-[16rem] overflow-y-auto rounded-2xl border border-line bg-panel p-4 sm:p-5"
      >
        {isEmpty && (
          <div className="py-6">
            <p className="text-[0.95rem] leading-relaxed text-ash">
              Ask anything about applying to college in the U.S. — the parts
              nobody explained, in plain language.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border border-line bg-ink px-4 py-3 text-left text-[0.9rem] text-chalk transition-colors hover:border-line-bright"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {messages.map((m, i) => (
            <div key={i}>
              <p className="micro mb-1.5 text-smoke">
                {m.role === "user" ? "You" : "PathFinder"}
              </p>
              <div
                className={
                  m.role === "user"
                    ? "rounded-xl border border-line bg-ink px-4 py-3"
                    : ""
                }
              >
                <p className="whitespace-pre-wrap text-[0.95rem] leading-relaxed text-chalk">
                  {m.content}
                  {streaming &&
                    m.role === "assistant" &&
                    i === messages.length - 1 &&
                    !m.content && (
                      <span className="text-smoke">Thinking…</span>
                    )}
                </p>
              </div>

              {/* Real-human resources, shown alongside the answer rather than
                  instead of it. */}
              {m.role === "assistant" &&
                m.flags?.map((flag) => {
                  const resource = FLAG_RESOURCES[flag];
                  if (!resource) return null;
                  return (
                    <div
                      key={flag}
                      className="mt-3 rounded-xl border border-line-bright bg-ink px-4 py-3"
                    >
                      <p className="micro mb-1.5 text-accent">
                        {resource.label}
                      </p>
                      <p className="text-[0.85rem] leading-relaxed text-ash">
                        {resource.body}
                      </p>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-[0.85rem] leading-snug text-[#ff7a6b]">
          {error}
        </p>
      )}

      {/* Composer */}
      <div className="mt-3 flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Ask a question…"
          disabled={streaming}
          className="max-h-32 min-h-[3rem] flex-1 resize-none rounded-2xl border border-line bg-ink-2 px-4 py-3.5 text-[0.95rem] text-chalk outline-none transition-colors placeholder:text-smoke focus:border-accent disabled:opacity-50"
        />
        <button
          onClick={() => send(input)}
          disabled={streaming || !input.trim()}
          className="rounded-full bg-accent px-5 py-3.5 text-sm font-semibold text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {streaming ? "…" : "Send"}
        </button>
      </div>

      <p className="mt-3 text-[0.78rem] leading-relaxed text-smoke">
        PathFinder can be wrong, and policies change year to year. Confirm
        anything that matters on the school&rsquo;s own site or with a
        counselor. Never a substitute for legal or medical advice.
      </p>
    </div>
  );
}
