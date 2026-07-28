import type {
  ArchitecturalStyle,
  FloorMaterial,
  FurnitureItem,
  FurnitureType,
  Room,
  RoomType,
  StylePalette,
} from "./types";

export const STYLE_PALETTES: Record<ArchitecturalStyle, StylePalette> = {
  modern: {
    id: "modern",
    label: "Modern",
    description: "Clean lines, warm neutrals, open light",
    wall: "#F2EDE6",
    floor: "#C4A484",
    floorMaterial: "wood",
    accent: "#2F4F4F",
    wood: "#8B6914",
    soft: "#D4C4B0",
  },
  scandinavian: {
    id: "scandinavian",
    label: "Scandinavian",
    description: "Pale timber, soft whites, cozy calm",
    wall: "#FAF8F5",
    floor: "#E8DCC8",
    floorMaterial: "wood",
    accent: "#5C6B5A",
    wood: "#D2B48C",
    soft: "#EDE6DC",
  },
  industrial: {
    id: "industrial",
    label: "Industrial",
    description: "Concrete, charcoal metal, raw texture",
    wall: "#D9D4CE",
    floor: "#8A8680",
    floorMaterial: "concrete",
    accent: "#3D3A36",
    wood: "#6B5344",
    soft: "#A39E96",
  },
  mediterranean: {
    id: "mediterranean",
    label: "Mediterranean",
    description: "Sun-washed plaster, terracotta, azure",
    wall: "#F5EFE3",
    floor: "#C9A66B",
    floorMaterial: "tile",
    accent: "#C45C26",
    wood: "#A67C52",
    soft: "#E8C9A0",
  },
  japanese: {
    id: "japanese",
    label: "Japanese",
    description: "Tatami calm, dark wood, quiet space",
    wall: "#F3EFE6",
    floor: "#BFA888",
    floorMaterial: "wood",
    accent: "#2C2C2C",
    wood: "#4A3728",
    soft: "#D9CDB8",
  },
  coastal: {
    id: "coastal",
    label: "Coastal",
    description: "Sea glass, sandy floors, airy blues",
    wall: "#F7F4EF",
    floor: "#E6D5B8",
    floorMaterial: "wood",
    accent: "#5B7C8D",
    wood: "#C4A882",
    soft: "#B8C9C8",
  },
  midcentury: {
    id: "midcentury",
    label: "Mid-Century",
    description: "Walnut tones, mustard, sculptural forms",
    wall: "#EFE8DC",
    floor: "#8B5E3C",
    floorMaterial: "wood",
    accent: "#C4A035",
    wood: "#6B4423",
    soft: "#D4A574",
  },
  farmhouse: {
    id: "farmhouse",
    label: "Farmhouse",
    description: "Cream walls, oak floors, rustic ease",
    wall: "#F8F4EC",
    floor: "#A67B5B",
    floorMaterial: "wood",
    accent: "#5A6B4F",
    wood: "#8B6F47",
    soft: "#D9CBB3",
  },
};

export const ROOM_DEFAULTS: Record<
  RoomType,
  { name: string; width: number; depth: number; windows: number }
> = {
  living: { name: "Living Room", width: 6, depth: 5, windows: 2 },
  kitchen: { name: "Kitchen", width: 4.5, depth: 4, windows: 1 },
  bedroom: { name: "Bedroom", width: 4, depth: 4, windows: 1 },
  bathroom: { name: "Bathroom", width: 2.5, depth: 3, windows: 1 },
  dining: { name: "Dining Room", width: 4, depth: 3.5, windows: 1 },
  office: { name: "Office", width: 3.5, depth: 3.5, windows: 1 },
  garage: { name: "Garage", width: 6, depth: 5, windows: 0 },
  hallway: { name: "Hallway", width: 2, depth: 4, windows: 0 },
  patio: { name: "Patio", width: 5, depth: 4, windows: 0 },
  laundry: { name: "Laundry", width: 2.5, depth: 2.5, windows: 1 },
};

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  living: "Living",
  kitchen: "Kitchen",
  bedroom: "Bedroom",
  bathroom: "Bathroom",
  dining: "Dining",
  office: "Office",
  garage: "Garage",
  hallway: "Hallway",
  patio: "Patio",
  laundry: "Laundry",
};

export const FURNITURE_CATALOG: Record<
  FurnitureType,
  { label: string; w: number; d: number; h: number; rooms: RoomType[] }
> = {
  sofa: { label: "Sofa", w: 2.2, d: 0.9, h: 0.75, rooms: ["living"] },
  chair: {
    label: "Chair",
    w: 0.55,
    d: 0.55,
    h: 0.9,
    rooms: ["living", "dining", "office", "bedroom"],
  },
  table: {
    label: "Table",
    w: 1.4,
    d: 0.8,
    h: 0.75,
    rooms: ["living", "dining", "office"],
  },
  bed: { label: "Bed", w: 2, d: 1.8, h: 0.55, rooms: ["bedroom"] },
  desk: { label: "Desk", w: 1.4, d: 0.7, h: 0.75, rooms: ["office", "bedroom"] },
  cabinet: {
    label: "Cabinet",
    w: 1.2,
    d: 0.5,
    h: 0.9,
    rooms: ["kitchen", "bathroom", "laundry"],
  },
  sink: {
    label: "Sink",
    w: 0.7,
    d: 0.5,
    h: 0.85,
    rooms: ["kitchen", "bathroom", "laundry"],
  },
  stove: { label: "Stove", w: 0.7, d: 0.65, h: 0.9, rooms: ["kitchen"] },
  toilet: { label: "Toilet", w: 0.45, d: 0.65, h: 0.45, rooms: ["bathroom"] },
  bathtub: { label: "Bathtub", w: 1.6, d: 0.75, h: 0.55, rooms: ["bathroom"] },
  lamp: {
    label: "Lamp",
    w: 0.35,
    d: 0.35,
    h: 1.4,
    rooms: ["living", "bedroom", "office"],
  },
  plant: {
    label: "Plant",
    w: 0.4,
    d: 0.4,
    h: 0.9,
    rooms: ["living", "bedroom", "office", "patio", "hallway"],
  },
  rug: {
    label: "Rug",
    w: 2.4,
    d: 1.6,
    h: 0.02,
    rooms: ["living", "bedroom", "dining"],
  },
  bookshelf: {
    label: "Bookshelf",
    w: 1.0,
    d: 0.35,
    h: 1.8,
    rooms: ["living", "office", "bedroom"],
  },
  tv: { label: "TV Console", w: 1.6, d: 0.4, h: 0.5, rooms: ["living"] },
  island: { label: "Island", w: 1.8, d: 0.9, h: 0.9, rooms: ["kitchen"] },
  nightstand: {
    label: "Nightstand",
    w: 0.45,
    d: 0.4,
    h: 0.5,
    rooms: ["bedroom"],
  },
  wardrobe: {
    label: "Wardrobe",
    w: 1.5,
    d: 0.6,
    h: 2.0,
    rooms: ["bedroom"],
  },
};

const ROOM_FURNITURE: Record<RoomType, FurnitureType[]> = {
  living: ["rug", "sofa", "table", "tv", "lamp", "plant", "bookshelf"],
  kitchen: ["cabinet", "sink", "stove", "island"],
  bedroom: ["bed", "nightstand", "wardrobe", "lamp", "rug"],
  bathroom: ["toilet", "sink", "bathtub"],
  dining: ["table", "chair", "chair", "chair", "chair", "plant"],
  office: ["desk", "chair", "bookshelf", "lamp", "plant"],
  garage: [],
  hallway: ["plant"],
  patio: ["chair", "table", "plant"],
  laundry: ["cabinet", "sink"],
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyHome(name = "Untitled Home"): import("./types").HomeModel {
  return {
    name,
    style: "modern",
    wallHeight: 2.8,
    rooms: [],
    structureComplete: false,
    interiorDesigned: false,
  };
}

export function createRoom(
  type: RoomType,
  overrides: Partial<Room> = {},
  style: ArchitecturalStyle = "modern"
): Room {
  const defaults = ROOM_DEFAULTS[type];
  const palette = STYLE_PALETTES[style];
  return {
    id: uid("room"),
    name: defaults.name,
    type,
    x: 0,
    z: 0,
    width: defaults.width,
    depth: defaults.depth,
    height: 2.8,
    wallColor: palette.wall,
    floorColor: palette.floor,
    floorMaterial: palette.floorMaterial,
    furniture: [],
    windows: defaults.windows,
    ...overrides,
  };
}

function placeFurniture(
  type: FurnitureType,
  room: Room,
  index: number,
  total: number,
  palette: StylePalette
): FurnitureItem {
  const catalog = FURNITURE_CATALOG[type];
  const margin = 0.4;
  const usableW = Math.max(0.5, room.width - margin * 2);
  const usableD = Math.max(0.5, room.depth - margin * 2);

  let x = 0;
  let z = 0;
  let rotation = 0;
  let color = palette.wood;

  switch (type) {
    case "sofa":
      x = 0;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      color = palette.accent;
      break;
    case "tv":
      x = 0;
      z = room.depth / 2 - catalog.d / 2 - margin;
      color = palette.accent;
      break;
    case "bed":
      x = 0;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      color = palette.soft;
      break;
    case "wardrobe":
      x = room.width / 2 - catalog.w / 2 - margin;
      z = room.depth / 2 - catalog.d / 2 - margin;
      color = palette.wood;
      break;
    case "desk":
      x = -room.width / 2 + catalog.w / 2 + margin;
      z = room.depth / 2 - catalog.d / 2 - margin;
      color = palette.wood;
      break;
    case "island":
      x = 0;
      z = 0;
      color = palette.wood;
      break;
    case "cabinet":
      x = -room.width / 2 + catalog.w / 2 + margin;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      color = palette.accent;
      break;
    case "stove":
    case "sink":
      x = room.width / 2 - catalog.w / 2 - margin - (type === "stove" ? 0.9 : 0);
      z = -room.depth / 2 + catalog.d / 2 + margin;
      color = "#C0C0C0";
      break;
    case "toilet":
      x = -room.width / 2 + catalog.w / 2 + margin;
      z = 0;
      color = "#F5F5F5";
      break;
    case "bathtub":
      x = room.width / 2 - catalog.w / 2 - margin;
      z = room.depth / 2 - catalog.d / 2 - margin;
      color = "#F5F5F5";
      break;
    case "rug":
      x = 0;
      z = 0;
      color = palette.soft;
      break;
    case "chair": {
      const angle = (index / Math.max(total, 1)) * Math.PI * 2;
      x = Math.cos(angle) * Math.min(usableW * 0.35, 1.1);
      z = Math.sin(angle) * Math.min(usableD * 0.35, 1.1);
      rotation = -angle + Math.PI;
      color = palette.wood;
      break;
    }
    case "table":
      x = 0;
      z = type === "table" ? 0.2 : 0;
      color = palette.wood;
      break;
    case "plant":
      x = room.width / 2 - 0.5;
      z = -room.depth / 2 + 0.5;
      color = "#3D5A45";
      break;
    case "lamp":
      x = -room.width / 2 + 0.5;
      z = -room.depth / 2 + 0.5;
      color = palette.accent;
      break;
    case "bookshelf":
      x = room.width / 2 - catalog.w / 2 - margin;
      z = 0;
      color = palette.wood;
      break;
    case "nightstand":
      x = -room.width / 2 + catalog.w / 2 + margin + 0.3;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      color = palette.wood;
      break;
    default:
      x = ((index % 3) - 1) * (usableW / 3);
      z = (Math.floor(index / 3) - 0.5) * (usableD / 3);
      color = palette.wood;
  }

  return {
    id: uid("furn"),
    type,
    x,
    z,
    rotation,
    color,
    scale: 1,
  };
}

export function furnishRoom(room: Room, style: ArchitecturalStyle): Room {
  const palette = STYLE_PALETTES[style];
  const types = ROOM_FURNITURE[room.type];
  const furniture = types.map((type, index) =>
    placeFurniture(type, room, index, types.length, palette)
  );
  return {
    ...room,
    wallColor: palette.wall,
    floorColor: palette.floor,
    floorMaterial: palette.floorMaterial as FloorMaterial,
    furniture,
  };
}

export function applyStyleToHome(
  rooms: Room[],
  style: ArchitecturalStyle,
  withFurniture: boolean
): Room[] {
  return rooms.map((room) => {
    const styled = {
      ...room,
      wallColor: STYLE_PALETTES[style].wall,
      floorColor: STYLE_PALETTES[style].floor,
      floorMaterial: STYLE_PALETTES[style].floorMaterial,
    };
    return withFurniture ? furnishRoom(styled, style) : { ...styled, furniture: [] };
  });
}
