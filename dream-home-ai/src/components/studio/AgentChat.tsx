"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  INTERIOR_SUGGESTIONS,
  PROMPT_SUGGESTIONS,
} from "@/lib/agent";
import { useHomeStore } from "@/lib/store";

export function AgentChat() {
  const messages = useHomeStore((s) => s.messages);
  const isThinking = useHomeStore((s) => s.isThinking);
  const mode = useHomeStore((s) => s.mode);
  const sendPrompt = useHomeStore((s) => s.sendPrompt);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const suggestions =
    mode === "interior" ? INTERIOR_SUGGESTIONS : PROMPT_SUGGESTIONS;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    if (!value || isThinking) return;
    setInput("");
    await sendPrompt(value);
  };

  return (
    <div className="agent-chat">
      <header className="panel-header">
        <div>
          <p className="eyebrow">AI Agent</p>
          <h2>Hearth</h2>
        </div>
        <span className="agent-status">{isThinking ? "Thinking…" : "Ready"}</span>
      </header>

      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble ${m.role}`}>
            {m.content}
          </div>
        ))}
        {isThinking && (
          <div className="chat-bubble agent thinking">
            <span />
            <span />
            <span />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="suggestions">
        {suggestions.slice(0, 3).map((s) => (
          <button
            key={s}
            type="button"
            className="chip"
            disabled={isThinking}
            onClick={() => sendPrompt(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <form className="chat-form" onSubmit={onSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "interior"
              ? "Describe the interior mood or style…"
              : "Describe your dream home…"
          }
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void onSubmit(e);
            }
          }}
        />
        <button type="submit" className="btn-primary" disabled={isThinking || !input.trim()}>
          Design
        </button>
      </form>
    </div>
  );
}
