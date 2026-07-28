import { applyStyleToHome, createEmptyHome, createRoom, furnishRoom } from "./catalog";
import type {
  AgentAction,
  ArchitecturalStyle,
  HomeModel,
  Room,
  RoomType,
} from "./types";

const STYLE_ALIASES: Record<string, ArchitecturalStyle> = {
  modern: "modern",
  contemporary: "modern",
  scandinavian: "scandinavian",
  nordic: "scandinavian",
  minimal: "scandinavian",
  minimalist: "scandinavian",
  industrial: "industrial",
  loft: "industrial",
  mediterranean: "mediterranean",
  spanish: "mediterranean",
  tuscan: "mediterranean",
  japanese: "japanese",
  zen: "japanese",
  coastal: "coastal",
  beach: "coastal",
  seaside: "coastal",
  midcentury: "midcentury",
  "mid-century": "midcentury",
  mcm: "midcentury",
  farmhouse: "farmhouse",
  rustic: "farmhouse",
  cottage: "farmhouse",
};

function detectStyle(text: string): ArchitecturalStyle {
  const lower = text.toLowerCase();
  for (const [alias, style] of Object.entries(STYLE_ALIASES)) {
    if (lower.includes(alias)) return style;
  }
  return "modern";
}

function detectBedroomCount(text: string): number {
  const lower = text.toLowerCase();
  const patterns = [
    /(\d+)\s*-?\s*(?:bed(?:room)?s?)/i,
    /(\d+)\s*-?\s*br\b/i,
    /(one|two|three|four|five)\s*-?\s*bed(?:room)?s?/i,
  ];
  const words: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
  };
  for (const pattern of patterns) {
    const match = lower.match(pattern);
    if (match) {
      const n = words[match[1]] ?? parseInt(match[1], 10);
      if (!Number.isNaN(n)) return Math.min(Math.max(n, 1), 5);
    }
  }
  if (lower.includes("studio")) return 0;
  return 2;
}

function detectBathroomCount(text: string): number {
  const lower = text.toLowerCase();
  const match = lower.match(/(\d+)\s*-?\s*(?:bath(?:room)?s?)/i);
  if (match) return Math.min(Math.max(parseInt(match[1], 10), 1), 4);
  return Math.max(1, Math.ceil(detectBedroomCount(text) / 2));
}

function wants(text: string, ...keys: string[]): boolean {
  const lower = text.toLowerCase();
  return keys.some((k) => lower.includes(k));
}

function layoutRooms(roomSpecs: { type: RoomType; name?: string }[]): Room[] {
  const rooms: Room[] = [];
  let cursorX = 0;
  let cursorZ = 0;
  let rowDepth = 0;
  const maxRowWidth = 14;

  for (const spec of roomSpecs) {
    const room = createRoom(spec.type, spec.name ? { name: spec.name } : {});
    if (cursorX + room.width > maxRowWidth && cursorX > 0) {
      cursorX = 0;
      cursorZ += rowDepth + 0.15;
      rowDepth = 0;
    }
    room.x = cursorX + room.width / 2;
    room.z = cursorZ + room.depth / 2;
    rooms.push(room);
    cursorX += room.width + 0.15;
    rowDepth = Math.max(rowDepth, room.depth);
  }

  // Center the footprint around origin
  if (rooms.length === 0) return rooms;
  const minX = Math.min(...rooms.map((r) => r.x - r.width / 2));
  const maxX = Math.max(...rooms.map((r) => r.x + r.width / 2));
  const minZ = Math.min(...rooms.map((r) => r.z - r.depth / 2));
  const maxZ = Math.max(...rooms.map((r) => r.z + r.depth / 2));
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  return rooms.map((r) => ({ ...r, x: r.x - cx, z: r.z - cz }));
}

export function generateHomeFromPrompt(prompt: string): HomeModel {
  const style = detectStyle(prompt);
  const bedrooms = detectBedroomCount(prompt);
  const bathrooms = detectBathroomCount(prompt);
  const specs: { type: RoomType; name?: string }[] = [];

  if (!wants(prompt, "no living", "without living")) {
    specs.push({ type: "living" });
  }
  // Always include a kitchen for a livable home unless explicitly excluded
  if (!wants(prompt, "no kitchen", "without kitchen")) {
    specs.push({ type: "kitchen" });
  }
  if (wants(prompt, "dining") || bedrooms >= 2) {
    specs.push({ type: "dining" });
  }

  for (let i = 0; i < bedrooms; i++) {
    specs.push({
      type: "bedroom",
      name: i === 0 ? "Primary Bedroom" : `Bedroom ${i + 1}`,
    });
  }
  for (let i = 0; i < bathrooms; i++) {
    specs.push({
      type: "bathroom",
      name: i === 0 ? "Primary Bath" : `Bath ${i + 1}`,
    });
  }

  if (wants(prompt, "office", "study", "work from home", "wfh")) {
    specs.push({ type: "office" });
  }
  if (wants(prompt, "garage")) {
    specs.push({ type: "garage" });
  }
  if (wants(prompt, "patio", "deck", "terrace", "outdoor")) {
    specs.push({ type: "patio" });
  }
  if (wants(prompt, "laundry", "utility")) {
    specs.push({ type: "laundry" });
  }
  if (wants(prompt, "hallway", "corridor") || bedrooms >= 3) {
    specs.push({ type: "hallway" });
  }

  // Always include a kitchen for a livable home unless explicitly excluded
  const rooms = layoutRooms(specs);
  const styled = applyStyleToHome(rooms, style, false);

  const nameMatch = prompt.match(/(?:called|named)\s+["']?([A-Za-z0-9 ]{2,40})["']?/i);
  const home = createEmptyHome(nameMatch?.[1]?.trim() || "Dream Home");
  home.style = style;
  home.rooms = styled;
  home.structureComplete = styled.length > 0;
  return home;
}

export function designInterior(
  home: HomeModel,
  prompt?: string
): HomeModel {
  const style = prompt ? detectStyle(prompt) : home.style;
  const rooms = home.rooms.map((room) => furnishRoom(
    {
      ...room,
      wallColor: room.wallColor,
      floorColor: room.floorColor,
    },
    style
  ));

  // Re-apply palette from style after furnishRoom
  const styledRooms = applyStyleToHome(
    rooms.map((r) => ({ ...r, furniture: r.furniture })),
    style,
    true
  );

  return {
    ...home,
    style,
    rooms: styledRooms,
    interiorDesigned: true,
    structureComplete: true,
  };
}

export function interpretAgentPrompt(
  prompt: string,
  current: HomeModel,
  mode: "structure" | "prompt" | "interior"
): AgentAction[] {
  const lower = prompt.toLowerCase().trim();
  const actions: AgentAction[] = [];

  if (!lower) {
    return [
      {
        type: "message",
        message: "Tell me about the home you imagine — rooms, style, and atmosphere.",
      },
    ];
  }

  // Interior-focused commands
  if (
    mode === "interior" ||
    wants(lower, "interior", "furnish", "decorate", "style the", "furniture")
  ) {
    if (!current.rooms.length) {
      return [
        {
          type: "message",
          message:
            "There's no structure yet. Describe a floor plan first, or add rooms manually, then we can design the interiors.",
        },
      ];
    }
    const updated = designInterior(current, prompt);
    actions.push({
      type: "replace_home",
      payload: updated,
      message: `Interior designed in a ${updated.style} palette — furniture placed across ${updated.rooms.length} rooms. Tweak pieces in the Interior panel or ask for another style.`,
    });
    return actions;
  }

  // Add a single room
  const addMatch = lower.match(
    /add (?:a |an )?(living|kitchen|bedroom|bathroom|dining|office|garage|hallway|patio|laundry)/
  );
  if (addMatch) {
    const type = addMatch[1] as RoomType;
    const room = createRoom(type, {}, current.style);
    // Place to the right of existing footprint
    const maxX = current.rooms.length
      ? Math.max(...current.rooms.map((r) => r.x + r.width / 2))
      : -room.width / 2;
    room.x = maxX + room.width / 2 + 0.2;
    room.z = 0;
    actions.push({
      type: "add_room",
      payload: room,
      message: `Added a ${room.name}. Drag sizing in Manual tools or keep prompting for more rooms.`,
    });
    return actions;
  }

  // Mark complete
  if (wants(lower, "complete", "done", "finish structure", "ready for interior")) {
    if (!current.rooms.length) {
      return [
        {
          type: "message",
          message: "Add at least one room before marking the structure complete.",
        },
      ];
    }
    actions.push({
      type: "replace_home",
      payload: { ...current, structureComplete: true },
      message:
        "Structure marked complete. Switch to Interior mode to furnish and style your rooms — or ask me to decorate.",
    });
    return actions;
  }

  // Full home generation from prompt
  const home = generateHomeFromPrompt(prompt);
  const bedroomCount = home.rooms.filter((r) => r.type === "bedroom").length;
  const bathCount = home.rooms.filter((r) => r.type === "bathroom").length;
  actions.push({
    type: "replace_home",
    payload: home,
    message: `Built a ${home.style} ${bedroomCount}-bed / ${bathCount}-bath layout with ${home.rooms.length} spaces. Refine rooms manually, or say “furnish the interiors” when you're ready.`,
  });
  return actions;
}

export const PROMPT_SUGGESTIONS = [
  "A modern 3-bedroom home with open kitchen, office, and patio",
  "Cozy Scandinavian cottage with 2 bedrooms and a large living room",
  "Industrial loft: open living-kitchen, 1 bedroom, 1 bath",
  "Mediterranean villa with 4 bedrooms, dining room, and patio",
  "Coastal beach house with 3 bedrooms and lots of light",
];

export const INTERIOR_SUGGESTIONS = [
  "Furnish in warm Scandinavian style",
  "Decorate with mid-century furniture",
  "Japanese zen interiors with dark wood",
  "Coastal interiors — soft blues and sandy tones",
  "Industrial loft furniture and concrete floors",
];
