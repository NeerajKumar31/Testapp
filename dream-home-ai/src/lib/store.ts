"use client";

import { create } from "zustand";
import { designInterior, interpretAgentPrompt } from "./agent";
import { createEmptyHome, createRoom } from "./catalog";
import type {
  ArchitecturalStyle,
  ChatMessage,
  FurnitureItem,
  FurnitureType,
  HomeModel,
  Room,
  RoomType,
  StudioMode,
} from "./types";
import { FURNITURE_CATALOG, STYLE_PALETTES } from "./catalog";

interface HomeStore {
  home: HomeModel;
  mode: StudioMode;
  selectedRoomId: string | null;
  selectedFurnitureId: string | null;
  messages: ChatMessage[];
  isThinking: boolean;
  roofVisible: boolean;
  wallsOpacity: number;

  setMode: (mode: StudioMode) => void;
  setHomeName: (name: string) => void;
  setStyle: (style: ArchitecturalStyle) => void;
  selectRoom: (id: string | null) => void;
  selectFurniture: (id: string | null) => void;
  toggleRoof: () => void;
  setWallsOpacity: (opacity: number) => void;

  addRoom: (type: RoomType) => void;
  updateRoom: (id: string, patch: Partial<Room>) => void;
  removeRoom: (id: string) => void;
  clearHome: () => void;
  markStructureComplete: () => void;

  addFurniture: (roomId: string, type: FurnitureType) => void;
  updateFurniture: (
    roomId: string,
    furnitureId: string,
    patch: Partial<FurnitureItem>
  ) => void;
  removeFurniture: (roomId: string, furnitureId: string) => void;
  runInteriorDesign: (prompt?: string) => void;

  sendPrompt: (prompt: string) => Promise<void>;
  replaceHome: (home: HomeModel) => void;
}

function msg(role: "user" | "agent", content: string): ChatMessage {
  return {
    id: `msg_${Math.random().toString(36).slice(2, 10)}`,
    role,
    content,
    timestamp: Date.now(),
  };
}

export const useHomeStore = create<HomeStore>((set, get) => ({
  home: createEmptyHome("Dream Home"),
  mode: "prompt",
  selectedRoomId: null,
  selectedFurnitureId: null,
  messages: [
    msg(
      "agent",
      "I'm Hearth, your dream-home agent. Describe a floor plan — bedrooms, style, extras — or switch to Manual to place rooms yourself. When the structure feels right, unlock Interior design."
    ),
  ],
  isThinking: false,
  roofVisible: false,
  wallsOpacity: 0.92,

  setMode: (mode) => set({ mode }),
  setHomeName: (name) =>
    set((s) => ({ home: { ...s.home, name } })),
  setStyle: (style) =>
    set((s) => ({
      home: {
        ...s.home,
        style,
        rooms: s.home.rooms.map((r) => ({
          ...r,
          wallColor: STYLE_PALETTES[style].wall,
          floorColor: STYLE_PALETTES[style].floor,
          floorMaterial: STYLE_PALETTES[style].floorMaterial,
        })),
      },
    })),
  selectRoom: (id) => set({ selectedRoomId: id, selectedFurnitureId: null }),
  selectFurniture: (id) => set({ selectedFurnitureId: id }),
  toggleRoof: () => set((s) => ({ roofVisible: !s.roofVisible })),
  setWallsOpacity: (wallsOpacity) => set({ wallsOpacity }),

  addRoom: (type) => {
    const { home } = get();
    const room = createRoom(type, {}, home.style);
    const maxX = home.rooms.length
      ? Math.max(...home.rooms.map((r) => r.x + r.width / 2))
      : -room.width / 2;
    room.x = maxX + room.width / 2 + 0.25;
    room.z = 0;
    set({
      home: {
        ...home,
        rooms: [...home.rooms, room],
        structureComplete: false,
        interiorDesigned: false,
      },
      selectedRoomId: room.id,
    });
  },

  updateRoom: (id, patch) =>
    set((s) => ({
      home: {
        ...s.home,
        rooms: s.home.rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        interiorDesigned: false,
      },
    })),

  removeRoom: (id) =>
    set((s) => ({
      home: {
        ...s.home,
        rooms: s.home.rooms.filter((r) => r.id !== id),
        structureComplete: false,
        interiorDesigned: false,
      },
      selectedRoomId: s.selectedRoomId === id ? null : s.selectedRoomId,
    })),

  clearHome: () =>
    set({
      home: createEmptyHome("Dream Home"),
      selectedRoomId: null,
      selectedFurnitureId: null,
    }),

  markStructureComplete: () => {
    const { home } = get();
    if (!home.rooms.length) return;
    set({
      home: { ...home, structureComplete: true },
      mode: "interior",
      messages: [
        ...get().messages,
        msg(
          "agent",
          "Structure complete. Interior mode is open — place furniture manually or ask me to style the rooms."
        ),
      ],
    });
  },

  addFurniture: (roomId, type) => {
    const { home } = get();
    const room = home.rooms.find((r) => r.id === roomId);
    if (!room) return;
    const catalog = FURNITURE_CATALOG[type];
    const item: FurnitureItem = {
      id: `furn_${Math.random().toString(36).slice(2, 10)}`,
      type,
      x: 0,
      z: 0,
      rotation: 0,
      color: STYLE_PALETTES[home.style].wood,
      scale: 1,
    };
    // Keep within room bounds roughly
    item.x = Math.min(room.width / 2 - catalog.w / 2, 0);
    set({
      home: {
        ...home,
        rooms: home.rooms.map((r) =>
          r.id === roomId ? { ...r, furniture: [...r.furniture, item] } : r
        ),
        interiorDesigned: true,
      },
      selectedFurnitureId: item.id,
    });
  },

  updateFurniture: (roomId, furnitureId, patch) =>
    set((s) => ({
      home: {
        ...s.home,
        rooms: s.home.rooms.map((r) =>
          r.id !== roomId
            ? r
            : {
                ...r,
                furniture: r.furniture.map((f) =>
                  f.id === furnitureId ? { ...f, ...patch } : f
                ),
              }
        ),
      },
    })),

  removeFurniture: (roomId, furnitureId) =>
    set((s) => ({
      home: {
        ...s.home,
        rooms: s.home.rooms.map((r) =>
          r.id !== roomId
            ? r
            : {
                ...r,
                furniture: r.furniture.filter((f) => f.id !== furnitureId),
              }
        ),
      },
      selectedFurnitureId:
        s.selectedFurnitureId === furnitureId ? null : s.selectedFurnitureId,
    })),

  runInteriorDesign: (prompt) => {
    const updated = designInterior(get().home, prompt);
    set((s) => ({
      home: updated,
      mode: "interior",
      messages: [
        ...s.messages,
        msg(
          "agent",
          `Interiors styled as ${updated.style}. Explore the 3D view and refine pieces in the Interior panel.`
        ),
      ],
    }));
  },

  replaceHome: (home) =>
    set({
      home,
      selectedRoomId: home.rooms[0]?.id ?? null,
      selectedFurnitureId: null,
    }),

  sendPrompt: async (prompt) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    set((s) => ({
      messages: [...s.messages, msg("user", trimmed)],
      isThinking: true,
    }));

    // Brief delay so the agent feels responsive
    await new Promise((r) => setTimeout(r, 450 + Math.random() * 400));

    const { home, mode } = get();
    const actions = interpretAgentPrompt(trimmed, home, mode);

    for (const action of actions) {
      if (action.type === "replace_home" && action.payload) {
        const next = action.payload as HomeModel;
        set({
          home: next,
          selectedRoomId: next.rooms[0]?.id ?? null,
          selectedFurnitureId: null,
          mode: next.interiorDesigned ? "interior" : get().mode,
        });
      } else if (action.type === "add_room" && action.payload) {
        const room = action.payload as Room;
        set((s) => ({
          home: {
            ...s.home,
            rooms: [...s.home.rooms, room],
            structureComplete: false,
            interiorDesigned: false,
          },
          selectedRoomId: room.id,
        }));
      }
      set((s) => ({
        messages: [...s.messages, msg("agent", action.message)],
      }));
    }

    set({ isThinking: false });
  },
}));

