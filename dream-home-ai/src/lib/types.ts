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

export type FurnitureType =
  | "sofa"
  | "chair"
  | "table"
  | "bed"
  | "desk"
  | "cabinet"
  | "sink"
  | "stove"
  | "toilet"
  | "bathtub"
  | "lamp"
  | "plant"
  | "rug"
  | "bookshelf"
  | "tv"
  | "island"
  | "nightstand"
  | "wardrobe";

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  x: number;
  z: number;
  rotation: number;
  color: string;
  scale: number;
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

export interface AgentAction {
  type: "replace_home" | "update_style" | "add_room" | "furnish" | "message";
  payload?: unknown;
  message: string;
}
