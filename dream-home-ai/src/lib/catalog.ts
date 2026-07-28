import type {
  ArchitecturalStyle,
  CatalogItem,
  FloorMaterial,
  FurnitureItem,
  FurnitureType,
  HomeModel,
  ItemCategory,
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

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  appliance: "Appliances",
  furniture: "Furniture",
  utensil: "Utensils",
};

export const CABINET_TYPES: FurnitureType[] = [
  "cabinet",
  "upper_cabinet",
  "pantry",
  "island",
];

export const FURNITURE_CATALOG: Record<FurnitureType, CatalogItem> = {
  // Furniture
  sofa: { label: "Sofa", w: 2.2, d: 0.9, h: 0.75, rooms: ["living"], category: "furniture" },
  chair: {
    label: "Chair",
    w: 0.55,
    d: 0.55,
    h: 0.9,
    rooms: ["living", "dining", "office", "bedroom", "kitchen"],
    category: "furniture",
  },
  table: {
    label: "Table",
    w: 1.4,
    d: 0.8,
    h: 0.75,
    rooms: ["living", "dining", "office"],
    category: "furniture",
  },
  bed: { label: "Bed", w: 2, d: 1.8, h: 0.55, rooms: ["bedroom"], category: "furniture" },
  desk: {
    label: "Desk",
    w: 1.4,
    d: 0.7,
    h: 0.75,
    rooms: ["office", "bedroom"],
    category: "furniture",
  },
  cabinet: {
    label: "Base Cabinet",
    w: 1.2,
    d: 0.55,
    h: 0.9,
    rooms: ["kitchen", "bathroom", "laundry"],
    category: "furniture",
  },
  upper_cabinet: {
    label: "Upper Cabinet",
    w: 1.0,
    d: 0.35,
    h: 0.7,
    rooms: ["kitchen"],
    category: "furniture",
  },
  pantry: {
    label: "Pantry",
    w: 0.7,
    d: 0.6,
    h: 2.1,
    rooms: ["kitchen"],
    category: "furniture",
  },
  island: {
    label: "Kitchen Island",
    w: 1.8,
    d: 0.9,
    h: 0.9,
    rooms: ["kitchen"],
    category: "furniture",
  },
  bar_stool: {
    label: "Bar Stool",
    w: 0.4,
    d: 0.4,
    h: 0.95,
    rooms: ["kitchen", "dining"],
    category: "furniture",
  },
  kitchen_table: {
    label: "Kitchen Table",
    w: 1.3,
    d: 0.8,
    h: 0.75,
    rooms: ["kitchen", "dining"],
    category: "furniture",
  },
  bookshelf: {
    label: "Bookshelf",
    w: 1.0,
    d: 0.35,
    h: 1.8,
    rooms: ["living", "office", "bedroom"],
    category: "furniture",
  },
  tv: { label: "TV Console", w: 1.6, d: 0.4, h: 0.5, rooms: ["living"], category: "furniture" },
  nightstand: {
    label: "Nightstand",
    w: 0.45,
    d: 0.4,
    h: 0.5,
    rooms: ["bedroom"],
    category: "furniture",
  },
  wardrobe: {
    label: "Wardrobe",
    w: 1.5,
    d: 0.6,
    h: 2.0,
    rooms: ["bedroom"],
    category: "furniture",
  },
  lamp: {
    label: "Lamp",
    w: 0.35,
    d: 0.35,
    h: 1.4,
    rooms: ["living", "bedroom", "office"],
    category: "furniture",
  },
  plant: {
    label: "Plant",
    w: 0.4,
    d: 0.4,
    h: 0.9,
    rooms: ["living", "bedroom", "office", "patio", "hallway", "kitchen"],
    category: "furniture",
  },
  rug: {
    label: "Rug",
    w: 2.4,
    d: 1.6,
    h: 0.02,
    rooms: ["living", "bedroom", "dining"],
    category: "furniture",
  },

  // Appliances
  sink: {
    label: "Sink",
    w: 0.7,
    d: 0.5,
    h: 0.85,
    rooms: ["kitchen", "bathroom", "laundry"],
    category: "appliance",
  },
  stove: { label: "Stove", w: 0.7, d: 0.65, h: 0.9, rooms: ["kitchen"], category: "appliance" },
  fridge: {
    label: "Refrigerator",
    w: 0.85,
    d: 0.7,
    h: 1.85,
    rooms: ["kitchen"],
    category: "appliance",
  },
  dishwasher: {
    label: "Dishwasher",
    w: 0.65,
    d: 0.6,
    h: 0.85,
    rooms: ["kitchen"],
    category: "appliance",
  },
  microwave: {
    label: "Microwave",
    w: 0.55,
    d: 0.4,
    h: 0.35,
    rooms: ["kitchen"],
    category: "appliance",
  },
  oven: { label: "Oven", w: 0.7, d: 0.65, h: 0.7, rooms: ["kitchen"], category: "appliance" },
  range_hood: {
    label: "Range Hood",
    w: 0.8,
    d: 0.45,
    h: 0.35,
    rooms: ["kitchen"],
    category: "appliance",
  },
  coffee_maker: {
    label: "Coffee Maker",
    w: 0.3,
    d: 0.28,
    h: 0.4,
    rooms: ["kitchen"],
    category: "appliance",
  },
  toaster: {
    label: "Toaster",
    w: 0.28,
    d: 0.2,
    h: 0.22,
    rooms: ["kitchen"],
    category: "appliance",
  },
  washer: {
    label: "Washer",
    w: 0.7,
    d: 0.7,
    h: 0.9,
    rooms: ["laundry"],
    category: "appliance",
  },
  dryer: {
    label: "Dryer",
    w: 0.7,
    d: 0.7,
    h: 0.9,
    rooms: ["laundry"],
    category: "appliance",
  },
  toilet: {
    label: "Toilet",
    w: 0.45,
    d: 0.65,
    h: 0.45,
    rooms: ["bathroom"],
    category: "appliance",
  },
  bathtub: {
    label: "Bathtub",
    w: 1.6,
    d: 0.75,
    h: 0.55,
    rooms: ["bathroom"],
    category: "appliance",
  },

  // Utensils for kitchen cabinets
  plates: {
    label: "Plate Stack",
    w: 0.28,
    d: 0.28,
    h: 0.12,
    rooms: ["kitchen"],
    category: "utensil",
    forCabinets: true,
  },
  bowls: {
    label: "Bowl Set",
    w: 0.25,
    d: 0.25,
    h: 0.14,
    rooms: ["kitchen"],
    category: "utensil",
    forCabinets: true,
  },
  cups: {
    label: "Cups / Mugs",
    w: 0.22,
    d: 0.22,
    h: 0.16,
    rooms: ["kitchen"],
    category: "utensil",
    forCabinets: true,
  },
  pots: {
    label: "Pots",
    w: 0.32,
    d: 0.32,
    h: 0.2,
    rooms: ["kitchen"],
    category: "utensil",
    forCabinets: true,
  },
  pans: {
    label: "Pans",
    w: 0.35,
    d: 0.35,
    h: 0.08,
    rooms: ["kitchen"],
    category: "utensil",
    forCabinets: true,
  },
  cutlery: {
    label: "Cutlery Tray",
    w: 0.35,
    d: 0.22,
    h: 0.06,
    rooms: ["kitchen"],
    category: "utensil",
    forCabinets: true,
  },
  utensil_jar: {
    label: "Utensil Jar",
    w: 0.16,
    d: 0.16,
    h: 0.28,
    rooms: ["kitchen"],
    category: "utensil",
    forCabinets: true,
  },
  spice_rack: {
    label: "Spice Rack",
    w: 0.35,
    d: 0.12,
    h: 0.22,
    rooms: ["kitchen"],
    category: "utensil",
    forCabinets: true,
  },
  cutting_board: {
    label: "Cutting Board",
    w: 0.35,
    d: 0.22,
    h: 0.03,
    rooms: ["kitchen"],
    category: "utensil",
    forCabinets: true,
  },
  storage_bin: {
    label: "Storage Bin",
    w: 0.3,
    d: 0.25,
    h: 0.22,
    rooms: ["kitchen", "laundry"],
    category: "utensil",
    forCabinets: true,
  },
};

const ROOM_FURNITURE: Record<RoomType, FurnitureType[]> = {
  living: ["rug", "sofa", "table", "tv", "lamp", "plant", "bookshelf"],
  kitchen: [
    "cabinet",
    "upper_cabinet",
    "sink",
    "stove",
    "range_hood",
    "fridge",
    "dishwasher",
    "island",
    "microwave",
    "bar_stool",
  ],
  bedroom: ["bed", "nightstand", "wardrobe", "lamp", "rug"],
  bathroom: ["toilet", "sink", "bathtub"],
  dining: ["table", "chair", "chair", "chair", "chair", "plant"],
  office: ["desk", "chair", "bookshelf", "lamp", "plant"],
  garage: [],
  hallway: ["plant"],
  patio: ["chair", "table", "plant"],
  laundry: ["cabinet", "sink", "washer", "dryer"],
};

const DEFAULT_CABINET_UTENSILS: FurnitureType[] = [
  "plates",
  "bowls",
  "cups",
  "cutlery",
  "pots",
  "pans",
  "spice_rack",
  "utensil_jar",
];

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isCabinetType(type: FurnitureType): boolean {
  return CABINET_TYPES.includes(type);
}

export function itemsByCategory(
  category: ItemCategory,
  roomType?: RoomType
): [FurnitureType, CatalogItem][] {
  return (
    Object.entries(FURNITURE_CATALOG) as [FurnitureType, CatalogItem][]
  ).filter(
    ([, meta]) =>
      meta.category === category &&
      (!roomType || meta.rooms.includes(roomType))
  );
}

export function createEmptyHome(name = "Untitled Home"): HomeModel {
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

function defaultColor(type: FurnitureType, palette: StylePalette): string {
  const metal = "#C5C8CC";
  const white = "#F2F2F0";
  switch (type) {
    case "fridge":
    case "dishwasher":
    case "stove":
    case "oven":
    case "microwave":
    case "range_hood":
    case "washer":
    case "dryer":
    case "sink":
    case "toaster":
      return metal;
    case "coffee_maker":
      return "#2A2A2A";
    case "toilet":
    case "bathtub":
      return white;
    case "sofa":
    case "tv":
      return palette.accent;
    case "bed":
    case "rug":
      return palette.soft;
    case "plant":
      return "#3D5A45";
    case "plates":
    case "bowls":
    case "cups":
      return "#F5F0E8";
    case "pots":
    case "pans":
      return "#6E747A";
    case "cutlery":
      return "#A8ADB2";
    case "utensil_jar":
      return "#D9CBB3";
    case "spice_rack":
      return palette.wood;
    case "cutting_board":
      return "#C4A484";
    case "storage_bin":
      return "#E8DFD2";
    default:
      return palette.wood;
  }
}

function placeFurniture(
  type: FurnitureType,
  room: Room,
  index: number,
  total: number,
  palette: StylePalette
): FurnitureItem {
  const catalog = FURNITURE_CATALOG[type];
  const margin = 0.35;
  const usableW = Math.max(0.5, room.width - margin * 2);
  const usableD = Math.max(0.5, room.depth - margin * 2);

  let x = 0;
  let z = 0;
  let rotation = 0;
  const color = defaultColor(type, palette);

  switch (type) {
    case "sofa":
      x = 0;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      break;
    case "tv":
      x = 0;
      z = room.depth / 2 - catalog.d / 2 - margin;
      break;
    case "bed":
      x = 0;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      break;
    case "wardrobe":
    case "pantry":
      x = room.width / 2 - catalog.w / 2 - margin;
      z = room.depth / 2 - catalog.d / 2 - margin;
      break;
    case "desk":
      x = -room.width / 2 + catalog.w / 2 + margin;
      z = room.depth / 2 - catalog.d / 2 - margin;
      break;
    case "island":
      x = 0.15;
      z = 0.2;
      break;
    case "cabinet":
      x = -room.width / 2 + catalog.w / 2 + margin;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      break;
    case "upper_cabinet":
      x = -room.width / 2 + catalog.w / 2 + margin + 0.2;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      break;
    case "fridge":
      x = room.width / 2 - catalog.w / 2 - margin;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      break;
    case "dishwasher":
      x = room.width / 2 - catalog.w / 2 - margin - 1.0;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      break;
    case "stove":
    case "oven":
      x = 0.2;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      break;
    case "range_hood":
      x = 0.2;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      break;
    case "sink":
      x = -0.7;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      break;
    case "microwave":
    case "coffee_maker":
    case "toaster":
      x = ((index % 3) - 1) * 0.55;
      z = -room.depth / 2 + catalog.d / 2 + margin + 0.15;
      break;
    case "bar_stool":
      x = -0.7 + (index % 3) * 0.45;
      z = 0.75;
      break;
    case "kitchen_table":
      x = room.width / 2 - 1.2;
      z = room.depth / 2 - 1.1;
      break;
    case "washer":
      x = -room.width / 2 + catalog.w / 2 + margin;
      z = 0;
      break;
    case "dryer":
      x = room.width / 2 - catalog.w / 2 - margin;
      z = 0;
      break;
    case "toilet":
      x = -room.width / 2 + catalog.w / 2 + margin;
      z = 0;
      break;
    case "bathtub":
      x = room.width / 2 - catalog.w / 2 - margin;
      z = room.depth / 2 - catalog.d / 2 - margin;
      break;
    case "rug":
      x = 0;
      z = 0;
      break;
    case "chair": {
      const angle = (index / Math.max(total, 1)) * Math.PI * 2;
      x = Math.cos(angle) * Math.min(usableW * 0.35, 1.1);
      z = Math.sin(angle) * Math.min(usableD * 0.35, 1.1);
      rotation = -angle + Math.PI;
      break;
    }
    case "table":
      x = 0;
      z = 0.2;
      break;
    case "plant":
      x = room.width / 2 - 0.5;
      z = -room.depth / 2 + 0.5;
      break;
    case "lamp":
      x = -room.width / 2 + 0.5;
      z = -room.depth / 2 + 0.5;
      break;
    case "bookshelf":
      x = room.width / 2 - catalog.w / 2 - margin;
      z = 0;
      break;
    case "nightstand":
      x = -room.width / 2 + catalog.w / 2 + margin + 0.3;
      z = -room.depth / 2 + catalog.d / 2 + margin;
      break;
    default:
      x = ((index % 3) - 1) * (usableW / 3);
      z = (Math.floor(index / 3) - 0.5) * (usableD / 3);
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

function placeUtensilInCabinet(
  type: FurnitureType,
  cabinet: FurnitureItem,
  slot: number,
  palette: StylePalette
): FurnitureItem {
  const cab = FURNITURE_CATALOG[cabinet.type];
  const cols = 3;
  const col = slot % cols;
  const row = Math.floor(slot / cols);
  const insetX = (col - 1) * Math.min(cab.w * 0.28, 0.28);
  const insetZ = (row - 0.3) * Math.min(cab.d * 0.35, 0.18);

  return {
    id: uid("utensil"),
    type,
    x: cabinet.x + insetX,
    z: cabinet.z + insetZ,
    rotation: 0,
    color: defaultColor(type, palette),
    scale: 1,
    parentId: cabinet.id,
  };
}

export function furnishRoom(room: Room, style: ArchitecturalStyle): Room {
  const palette = STYLE_PALETTES[style];
  const types = ROOM_FURNITURE[room.type];
  const furniture = types.map((type, index) =>
    placeFurniture(type, room, index, types.length, palette)
  );

  // Stock kitchen cabinets with utensils
  if (room.type === "kitchen") {
    const cabinets = furniture.filter((f) => isCabinetType(f.type));
    let utensilIndex = 0;
    for (const cabinet of cabinets) {
      const count = cabinet.type === "island" ? 2 : cabinet.type === "pantry" ? 4 : 3;
      for (let i = 0; i < count && utensilIndex < DEFAULT_CABINET_UTENSILS.length; i++) {
        furniture.push(
          placeUtensilInCabinet(
            DEFAULT_CABINET_UTENSILS[utensilIndex],
            cabinet,
            i,
            palette
          )
        );
        utensilIndex++;
      }
    }
  }

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

export function createFurnitureItem(
  type: FurnitureType,
  room: Room,
  style: ArchitecturalStyle,
  parent?: FurnitureItem
): FurnitureItem {
  const palette = STYLE_PALETTES[style];
  if (parent && FURNITURE_CATALOG[type].forCabinets) {
    const siblings = room.furniture.filter((f) => f.parentId === parent.id).length;
    return placeUtensilInCabinet(type, parent, siblings, palette);
  }
  const item = placeFurniture(type, room, room.furniture.length, room.furniture.length + 1, palette);
  // Countertop appliances sit on cabinet height
  if (type === "microwave" || type === "coffee_maker" || type === "toaster") {
    // placement already near back wall; leave as-is
  }
  return item;
}
