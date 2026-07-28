"use client";

import { useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  FURNITURE_CATALOG,
  STYLE_PALETTES,
  isCabinetType,
  itemsByCategory,
} from "@/lib/catalog";
import { useHomeStore } from "@/lib/store";
import type {
  ArchitecturalStyle,
  FurnitureType,
  ItemCategory,
} from "@/lib/types";

const CATEGORIES: ItemCategory[] = ["appliance", "furniture", "utensil"];

export function InteriorPanel() {
  const home = useHomeStore((s) => s.home);
  const selectedRoomId = useHomeStore((s) => s.selectedRoomId);
  const selectedFurnitureId = useHomeStore((s) => s.selectedFurnitureId);
  const selectRoom = useHomeStore((s) => s.selectRoom);
  const selectFurniture = useHomeStore((s) => s.selectFurniture);
  const addFurniture = useHomeStore((s) => s.addFurniture);
  const updateFurniture = useHomeStore((s) => s.updateFurniture);
  const removeFurniture = useHomeStore((s) => s.removeFurniture);
  const runInteriorDesign = useHomeStore((s) => s.runInteriorDesign);
  const setStyle = useHomeStore((s) => s.setStyle);
  const markStructureComplete = useHomeStore((s) => s.markStructureComplete);
  const setWallsOpacity = useHomeStore((s) => s.setWallsOpacity);
  const [category, setCategory] = useState<ItemCategory>("furniture");

  const selected = home.rooms.find((r) => r.id === selectedRoomId) ?? null;
  const selectedItem =
    selected?.furniture.find((f) => f.id === selectedFurnitureId) ?? null;

  const selectedCabinet =
    selectedItem && isCabinetType(selectedItem.type)
      ? selectedItem
      : selected?.furniture.find(
          (f) =>
            selectedItem?.parentId === f.id ||
            (f.id === selectedFurnitureId && isCabinetType(f.type))
        ) ?? null;

  const cabinetContents = useMemo(() => {
    if (!selected || !selectedCabinet) return [];
    return selected.furniture.filter((f) => f.parentId === selectedCabinet.id);
  }, [selected, selectedCabinet]);

  if (!home.structureComplete) {
    return (
      <div className="side-panel">
        <header className="panel-header">
          <div>
            <p className="eyebrow">Interior</p>
            <h2>Locked</h2>
          </div>
        </header>
        <div className="panel-scroll lock-state">
          <p>
            Finish your structure first — add rooms manually or generate a layout
            with the agent — then unlock interior design.
          </p>
          <button
            type="button"
            className="btn-primary"
            disabled={!home.rooms.length}
            onClick={() => {
              markStructureComplete();
              setWallsOpacity(0.35);
            }}
          >
            Mark structure complete
          </button>
        </div>
      </div>
    );
  }

  const catalogItems = selected
    ? itemsByCategory(category, selected.type)
    : itemsByCategory(category);

  const freeItems =
    selected?.furniture.filter((f) => !f.parentId) ?? [];

  return (
    <div className="side-panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Interior</p>
          <h2>Design</h2>
        </div>
      </header>

      <div className="panel-scroll">
        <section className="panel-section">
          <h3>One-click styles</h3>
          <div className="style-grid">
            {Object.values(STYLE_PALETTES).map((p) => (
              <button
                key={p.id}
                type="button"
                className={`style-card ${home.style === p.id ? "active" : ""}`}
                onClick={() => {
                  setStyle(p.id as ArchitecturalStyle);
                  runInteriorDesign(p.label);
                  setWallsOpacity(0.35);
                }}
              >
                <span
                  className="swatch"
                  style={{
                    background: `linear-gradient(135deg, ${p.wall}, ${p.floor} 55%, ${p.accent})`,
                  }}
                />
                <strong>{p.label}</strong>
                <em>{p.description}</em>
              </button>
            ))}
          </div>
        </section>

        <section className="panel-section">
          <h3>Select room</h3>
          <div className="room-grid">
            {home.rooms.map((room) => (
              <button
                key={room.id}
                type="button"
                className={`room-add ${selectedRoomId === room.id ? "active" : ""}`}
                onClick={() => selectRoom(room.id)}
              >
                {room.name}
              </button>
            ))}
          </div>
        </section>

        {selected && (
          <section className="panel-section">
            <h3>Add to {selected.name}</h3>
            <div className="category-tabs" role="tablist" aria-label="Item category">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={category === c}
                  className={category === c ? "active" : ""}
                  onClick={() => setCategory(c)}
                >
                  {CATEGORY_LABELS[c]}
                </button>
              ))}
            </div>

            {category === "utensil" && (
              <p className="category-hint">
                {selectedCabinet
                  ? `Adding into ${FURNITURE_CATALOG[selectedCabinet.type].label}. Select another cabinet to change target.`
                  : "Select a kitchen cabinet, upper cabinet, pantry, or island first — utensils stock that cabinet."}
              </p>
            )}

            <div className="room-grid">
              {catalogItems.length === 0 ? (
                <p className="muted">Nothing in this category for this room.</p>
              ) : (
                catalogItems.map(([type, meta]) => {
                  const needsCabinet = category === "utensil" && meta.forCabinets;
                  const disabled = needsCabinet && !selectedCabinet;
                  return (
                    <button
                      key={type}
                      type="button"
                      className="room-add"
                      disabled={disabled}
                      title={
                        disabled
                          ? "Select a cabinet first"
                          : `Add ${meta.label}`
                      }
                      onClick={() => {
                        if (needsCabinet && selectedCabinet) {
                          addFurniture(selected.id, type, selectedCabinet.id);
                        } else if (!needsCabinet) {
                          addFurniture(selected.id, type);
                          if (isCabinetType(type)) {
                            // Keep furniture tab useful; cabinets are furniture
                          }
                        }
                      }}
                    >
                      {meta.label}
                    </button>
                  );
                })
              )}
            </div>

            {selected.type === "kitchen" && category === "furniture" && (
              <p className="category-hint">
                Tip: add Base / Upper cabinets or an Island, then switch to Utensils to stock them.
              </p>
            )}

            {freeItems.length > 0 && (
              <ul className="room-list tight">
                {freeItems.map((f) => {
                  const childCount = selected.furniture.filter(
                    (c) => c.parentId === f.id
                  ).length;
                  return (
                    <li key={f.id}>
                      <button
                        type="button"
                        className={selectedFurnitureId === f.id ? "active" : ""}
                        onClick={() => selectFurniture(f.id)}
                      >
                        <strong>{FURNITURE_CATALOG[f.type].label}</strong>
                        <span>
                          {isCabinetType(f.type) && childCount > 0
                            ? `${childCount} utensils`
                            : "rotate / move"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {selected && selectedCabinet && (
          <section className="panel-section">
            <h3>
              Cabinet contents — {FURNITURE_CATALOG[selectedCabinet.type].label}
            </h3>
            {cabinetContents.length === 0 ? (
              <p className="muted">
                Empty. Open Utensils and add plates, pots, cutlery, and more.
              </p>
            ) : (
              <ul className="room-list tight">
                {cabinetContents.map((f) => (
                  <li key={f.id}>
                    <button
                      type="button"
                      className={selectedFurnitureId === f.id ? "active" : ""}
                      onClick={() => selectFurniture(f.id)}
                    >
                      <strong>{FURNITURE_CATALOG[f.type].label}</strong>
                      <span>in cabinet</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="room-grid" style={{ marginTop: "0.65rem" }}>
              {itemsByCategory("utensil", selected.type).map(([type, meta]) => (
                <button
                  key={`cab-${type}`}
                  type="button"
                  className="room-add"
                  onClick={() =>
                    addFurniture(selected.id, type as FurnitureType, selectedCabinet.id)
                  }
                >
                  + {meta.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {selected && selectedItem && (
          <section className="panel-section">
            <h3>Edit {FURNITURE_CATALOG[selectedItem.type].label}</h3>
            {selectedItem.parentId && (
              <p className="category-hint">Stored in a kitchen cabinet.</p>
            )}
            <div className="field-row">
              <label className="field">
                <span>X</span>
                <input
                  type="number"
                  step={0.1}
                  value={Number(selectedItem.x.toFixed(2))}
                  onChange={(e) =>
                    updateFurniture(selected.id, selectedItem.id, {
                      x: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Z</span>
                <input
                  type="number"
                  step={0.1}
                  value={Number(selectedItem.z.toFixed(2))}
                  onChange={(e) =>
                    updateFurniture(selected.id, selectedItem.id, {
                      z: Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            <label className="field">
              <span>Rotation</span>
              <input
                type="range"
                min={0}
                max={Math.PI * 2}
                step={0.1}
                value={selectedItem.rotation}
                onChange={(e) =>
                  updateFurniture(selected.id, selectedItem.id, {
                    rotation: Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="field">
              <span>Color</span>
              <input
                type="color"
                value={
                  selectedItem.color.startsWith("#")
                    ? selectedItem.color
                    : "#8B6914"
                }
                onChange={(e) =>
                  updateFurniture(selected.id, selectedItem.id, {
                    color: e.target.value,
                  })
                }
              />
            </label>
            <button
              type="button"
              className="btn-ghost danger"
              onClick={() => removeFurniture(selected.id, selectedItem.id)}
            >
              Remove piece
            </button>
          </section>
        )}
      </div>

      <footer className="panel-footer">
        <button
          type="button"
          className="btn-primary wide"
          onClick={() => {
            runInteriorDesign(home.style);
            setWallsOpacity(0.35);
          }}
        >
          Auto-furnish all rooms
        </button>
      </footer>
    </div>
  );
}
