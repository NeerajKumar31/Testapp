export type StudioMode = "structure" | "prompt" | "interior";

export type RoomType =
  | "living"
  | "kitchen"
  | "bedroom"
  | "bathroom"
  | "dining"
  | "office"
  | "garage"
  | "hallway"
  | "patio"
  | "laundry";

export type ArchitecturalStyle =
  | "modern"
  | "scandinavian"
  | "industrial"
  | "mediterranean"
  | "japanese"
  | "coastal"
  | "midcentury"
  | "farmhouse";

export type FloorMaterial = "wood" | "tile" | "carpet" | "concrete" | "marble";

export type ItemCategory = "appliance" | "furniture" | "utensil";

export type FurnitureType =
  // Furniture
  | "sofa"
  | "chair"
  | "table"
  | "bed"
  | "desk"
  | "cabinet"
  | "upper_cabinet"
  | "pantry"
  | "island"
  | "bar_stool"
  | "kitchen_table"
  | "bookshelf"
  | "tv"
  | "nightstand"
  | "wardrobe"
  | "lamp"
  | "plant"
  | "rug"
  // Appliances
  | "sink"
  | "stove"
  | "fridge"
  | "dishwasher"
  | "microwave"
  | "oven"
  | "range_hood"
  | "coffee_maker"
  | "toaster"
  | "washer"
  | "dryer"
  | "toilet"
  | "bathtub"
  // Utensils / cabinet contents
  | "plates"
  | "bowls"
  | "cups"
  | "pots"
  | "pans"
  | "cutlery"
  | "utensil_jar"
  | "spice_rack"
  | "cutting_board"
  | "storage_bin";

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  x: number;
  z: number;
  rotation: number;
  color: string;
  scale: number;
  /** When set, utensil is stored inside/on this cabinet item */
  parentId?: string;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  wallColor: string;
  floorColor: string;
  floorMaterial: FloorMaterial;
  furniture: FurnitureItem[];
  windows: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: number;
}

export interface HomeModel {
  name: string;
  style: ArchitecturalStyle;
  wallHeight: number;
  rooms: Room[];
  structureComplete: boolean;
  interiorDesigned: boolean;
}

export interface StylePalette {
  id: ArchitecturalStyle;
  label: string;
  description: string;
  wall: string;
  floor: string;
  floorMaterial: FloorMaterial;
  accent: string;
  wood: string;
  soft: string;
}

export interface CatalogItem {
  label: string;
  w: number;
  d: number;
  h: number;
  rooms: RoomType[];
  category: ItemCategory;
  /** Utensils that belong in kitchen cabinets */
  forCabinets?: boolean;
}

export interface AgentAction {
  type: "replace_home" | "update_style" | "add_room" | "furnish" | "message";
  payload?: unknown;
  message: string;
}
