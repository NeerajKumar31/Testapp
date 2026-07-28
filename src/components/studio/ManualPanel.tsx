"use client";

import {
  ROOM_TYPE_LABELS,
  STYLE_PALETTES,
} from "@/lib/catalog";
import { useHomeStore } from "@/lib/store";
import type { ArchitecturalStyle, RoomType } from "@/lib/types";

const ADDABLE: RoomType[] = [
  "living",
  "kitchen",
  "bedroom",
  "bathroom",
  "dining",
  "office",
  "garage",
  "hallway",
  "patio",
  "laundry",
];

export function ManualPanel() {
  const home = useHomeStore((s) => s.home);
  const selectedRoomId = useHomeStore((s) => s.selectedRoomId);
  const addRoom = useHomeStore((s) => s.addRoom);
  const updateRoom = useHomeStore((s) => s.updateRoom);
  const removeRoom = useHomeStore((s) => s.removeRoom);
  const selectRoom = useHomeStore((s) => s.selectRoom);
  const setStyle = useHomeStore((s) => s.setStyle);
  const setHomeName = useHomeStore((s) => s.setHomeName);
  const markStructureComplete = useHomeStore((s) => s.markStructureComplete);
  const clearHome = useHomeStore((s) => s.clearHome);
  const wallsOpacity = useHomeStore((s) => s.wallsOpacity);
  const setWallsOpacity = useHomeStore((s) => s.setWallsOpacity);
  const roofVisible = useHomeStore((s) => s.roofVisible);
  const toggleRoof = useHomeStore((s) => s.toggleRoof);

  const selected = home.rooms.find((r) => r.id === selectedRoomId) ?? null;

  return (
    <div className="side-panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Manual</p>
          <h2>Structure</h2>
        </div>
      </header>

      <div className="panel-scroll">
        <label className="field">
          <span>Home name</span>
          <input
            value={home.name}
            onChange={(e) => setHomeName(e.target.value)}
            placeholder="Dream Home"
          />
        </label>

        <label className="field">
          <span>Architectural style</span>
          <select
            value={home.style}
            onChange={(e) => setStyle(e.target.value as ArchitecturalStyle)}
          >
            {Object.values(STYLE_PALETTES).map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <section className="panel-section">
          <h3>Add room</h3>
          <div className="room-grid">
            {ADDABLE.map((type) => (
              <button
                key={type}
                type="button"
                className="room-add"
                onClick={() => addRoom(type)}
              >
                {ROOM_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </section>

        <section className="panel-section">
          <h3>Rooms ({home.rooms.length})</h3>
          {home.rooms.length === 0 ? (
            <p className="muted">No rooms yet. Add one above or use a prompt.</p>
          ) : (
            <ul className="room-list">
              {home.rooms.map((room) => (
                <li key={room.id}>
                  <button
                    type="button"
                    className={selectedRoomId === room.id ? "active" : ""}
                    onClick={() => selectRoom(room.id)}
                  >
                    <strong>{room.name}</strong>
                    <span>
                      {room.width.toFixed(1)} × {room.depth.toFixed(1)} m
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {selected && (
          <section className="panel-section">
            <h3>Edit {selected.name}</h3>
            <label className="field">
              <span>Name</span>
              <input
                value={selected.name}
                onChange={(e) => updateRoom(selected.id, { name: e.target.value })}
              />
            </label>
            <div className="field-row">
              <label className="field">
                <span>Width (m)</span>
                <input
                  type="number"
                  min={1.5}
                  max={12}
                  step={0.5}
                  value={selected.width}
                  onChange={(e) =>
                    updateRoom(selected.id, { width: Number(e.target.value) })
                  }
                />
              </label>
              <label className="field">
                <span>Depth (m)</span>
                <input
                  type="number"
                  min={1.5}
                  max={12}
                  step={0.5}
                  value={selected.depth}
                  onChange={(e) =>
                    updateRoom(selected.id, { depth: Number(e.target.value) })
                  }
                />
              </label>
            </div>
            <div className="field-row">
              <label className="field">
                <span>Pos X</span>
                <input
                  type="number"
                  step={0.5}
                  value={selected.x}
                  onChange={(e) =>
                    updateRoom(selected.id, { x: Number(e.target.value) })
                  }
                />
              </label>
              <label className="field">
                <span>Pos Z</span>
                <input
                  type="number"
                  step={0.5}
                  value={selected.z}
                  onChange={(e) =>
                    updateRoom(selected.id, { z: Number(e.target.value) })
                  }
                />
              </label>
            </div>
            <div className="field-row">
              <label className="field">
                <span>Wall</span>
                <input
                  type="color"
                  value={selected.wallColor}
                  onChange={(e) =>
                    updateRoom(selected.id, { wallColor: e.target.value })
                  }
                />
              </label>
              <label className="field">
                <span>Floor</span>
                <input
                  type="color"
                  value={selected.floorColor}
                  onChange={(e) =>
                    updateRoom(selected.id, { floorColor: e.target.value })
                  }
                />
              </label>
            </div>
            <button
              type="button"
              className="btn-ghost danger"
              onClick={() => removeRoom(selected.id)}
            >
              Remove room
            </button>
          </section>
        )}

        <section className="panel-section">
          <h3>View</h3>
          <label className="field">
            <span>Wall opacity</span>
            <input
              type="range"
              min={0.15}
              max={1}
              step={0.05}
              value={wallsOpacity}
              onChange={(e) => setWallsOpacity(Number(e.target.value))}
            />
          </label>
          <button type="button" className="btn-ghost" onClick={toggleRoof}>
            {roofVisible ? "Hide roof" : "Show roof"}
          </button>
        </section>
      </div>

      <footer className="panel-footer">
        <button type="button" className="btn-ghost" onClick={clearHome}>
          Clear
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={!home.rooms.length}
          onClick={markStructureComplete}
        >
          Complete model
        </button>
      </footer>
    </div>
  );
}
