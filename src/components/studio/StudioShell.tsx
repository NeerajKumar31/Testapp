"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AgentChat } from "./AgentChat";
import { InteriorPanel } from "./InteriorPanel";
import { ManualPanel } from "./ManualPanel";
import { useHomeStore } from "@/lib/store";
import type { StudioMode } from "@/lib/types";

const HomeCanvas = dynamic(
  () => import("./HomeCanvas").then((m) => m.HomeCanvas),
  {
    ssr: false,
    loading: () => <div className="home-canvas loading-canvas">Loading 3D studio…</div>,
  }
);

const MODES: { id: StudioMode; label: string; hint: string }[] = [
  { id: "prompt", label: "Prompt", hint: "Design with text" },
  { id: "structure", label: "Manual", hint: "Place rooms" },
  { id: "interior", label: "Interior", hint: "Furnish & style" },
];

export function StudioShell() {
  const mode = useHomeStore((s) => s.mode);
  const setMode = useHomeStore((s) => s.setMode);
  const home = useHomeStore((s) => s.home);
  const setWallsOpacity = useHomeStore((s) => s.setWallsOpacity);

  const onModeChange = (next: StudioMode) => {
    setMode(next);
    if (next === "interior") setWallsOpacity(0.35);
    if (next === "structure" || next === "prompt") setWallsOpacity(0.92);
  };

  return (
    <div className="studio-shell">
      <header className="studio-topbar">
        <Link href="/" className="brand-lockup">
          <span className="brand-mark" aria-hidden />
          <span>
            <strong>Hearth</strong>
            <em>Dream Home Agent</em>
          </span>
        </Link>

        <nav className="mode-tabs" aria-label="Studio modes">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={mode === m.id ? "active" : ""}
              onClick={() => onModeChange(m.id)}
              disabled={m.id === "interior" && !home.structureComplete && !home.rooms.length}
              title={m.hint}
            >
              <span>{m.label}</span>
              <small>{m.hint}</small>
            </button>
          ))}
        </nav>

        <div className="topbar-meta">
          <span className="home-pill">{home.name}</span>
          <span className={`status-dot ${home.structureComplete ? "ok" : ""}`}>
            {home.structureComplete
              ? home.interiorDesigned
                ? "Interior ready"
                : "Structure complete"
              : `${home.rooms.length} rooms`}
          </span>
        </div>
      </header>

      <div className="studio-body">
        <aside className="studio-left">
          {mode === "structure" ? (
            <ManualPanel />
          ) : mode === "interior" ? (
            <InteriorPanel />
          ) : (
            <AgentChat />
          )}
        </aside>

        <main className="studio-viewport">
          <HomeCanvas />
          <div className="viewport-hint">
            Drag to orbit · Scroll to zoom · Click a room to select
          </div>
        </main>

        {mode !== "prompt" && (
          <aside className="studio-right">
            <AgentChat />
          </aside>
        )}
      </div>
    </div>
  );
}
