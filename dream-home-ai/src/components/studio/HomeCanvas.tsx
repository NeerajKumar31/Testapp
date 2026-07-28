"use client";

import { Html, OrbitControls, Grid, ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { FURNITURE_CATALOG } from "@/lib/catalog";
import { useHomeStore } from "@/lib/store";
import type { FurnitureItem, Room } from "@/lib/types";

function FurnitureMesh({
  item,
  selected,
  onSelect,
}: {
  item: FurnitureItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const cat = FURNITURE_CATALOG[item.type];
  const w = cat.w * item.scale;
  const d = cat.d * item.scale;
  const h = cat.h * item.scale;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  };

  if (item.type === "rug") {
    return (
      <mesh
        position={[item.x, 0.015, item.z]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
        receiveShadow
      >
        <boxGeometry args={[w, 0.02, d]} />
        <meshStandardMaterial
          color={item.color}
          roughness={0.95}
          emissive={selected ? "#1a3a2a" : "#000000"}
          emissiveIntensity={selected ? 0.15 : 0}
        />
      </mesh>
    );
  }

  if (item.type === "plant") {
    return (
      <group
        position={[item.x, 0, item.z]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
      >
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.12, 0.3, 12]} />
          <meshStandardMaterial color="#8B5A3C" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial
            color={item.color}
            roughness={0.7}
            emissive={selected ? "#1a3a2a" : "#000000"}
            emissiveIntensity={selected ? 0.2 : 0}
          />
        </mesh>
      </group>
    );
  }

  if (item.type === "lamp") {
    return (
      <group
        position={[item.x, 0, item.z]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
      >
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 1.2, 8]} />
          <meshStandardMaterial color={item.color} metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <coneGeometry args={[0.22, 0.28, 16]} />
          <meshStandardMaterial
            color="#F5E6C8"
            emissive="#F5E6C8"
            emissiveIntensity={0.35}
          />
        </mesh>
        <pointLight position={[0, 1.15, 0]} intensity={0.45} distance={4} color="#FFE4B5" />
      </group>
    );
  }

  if (item.type === "sofa" || item.type === "bed") {
    return (
      <group
        position={[item.x, 0, item.z]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
      >
        <mesh position={[0, h * 0.35, 0]} castShadow>
          <boxGeometry args={[w, h * 0.55, d]} />
          <meshStandardMaterial
            color={item.color}
            roughness={0.85}
            emissive={selected ? "#1a3a2a" : "#000000"}
            emissiveIntensity={selected ? 0.18 : 0}
          />
        </mesh>
        {item.type === "sofa" && (
          <mesh position={[0, h * 0.65, -d * 0.35]} castShadow>
            <boxGeometry args={[w, h * 0.55, d * 0.25]} />
            <meshStandardMaterial color={item.color} roughness={0.85} />
          </mesh>
        )}
        {item.type === "bed" && (
          <mesh position={[0, h * 0.7, -d * 0.35]} castShadow>
            <boxGeometry args={[w * 0.95, 0.25, d * 0.25]} />
            <meshStandardMaterial color="#F8F4EF" roughness={0.9} />
          </mesh>
        )}
      </group>
    );
  }

  return (
    <mesh
      position={[item.x, h / 2, item.z]}
      rotation={[0, item.rotation, 0]}
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial
        color={item.color}
        roughness={0.7}
        metalness={item.type === "stove" || item.type === "sink" ? 0.5 : 0.05}
        emissive={selected ? "#1a3a2a" : "#000000"}
        emissiveIntensity={selected ? 0.18 : 0}
      />
    </mesh>
  );
}

function RoomMesh({
  room,
  selected,
  wallsOpacity,
  showRoof,
  onSelect,
  selectedFurnitureId,
  onSelectFurniture,
}: {
  room: Room;
  selected: boolean;
  wallsOpacity: number;
  showRoof: boolean;
  onSelect: () => void;
  selectedFurnitureId: string | null;
  onSelectFurniture: (id: string | null) => void;
}) {
  const wallT = 0.12;
  const h = room.height;
  const floorY = 0.02;

  const wallMat = useMemo(
    () => ({
      color: room.wallColor,
      roughness: 0.9,
      transparent: wallsOpacity < 1,
      opacity: wallsOpacity,
    }),
    [room.wallColor, wallsOpacity]
  );

  return (
    <group position={[room.x, 0, room.z]}>
      {/* Floor */}
      <mesh
        position={[0, floorY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <planeGeometry args={[room.width, room.depth]} />
        <meshStandardMaterial
          color={room.floorColor}
          roughness={room.floorMaterial === "wood" ? 0.65 : 0.4}
          metalness={room.floorMaterial === "marble" ? 0.15 : 0}
        />
      </mesh>

      {/* Selection outline */}
      {selected && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[
              Math.max(room.width, room.depth) * 0.48,
              Math.max(room.width, room.depth) * 0.5,
              4,
            ]}
          />
          <meshBasicMaterial color="#2F5D4A" transparent opacity={0.55} />
        </mesh>
      )}

      {/* Walls */}
      <mesh position={[0, h / 2, -room.depth / 2]} castShadow>
        <boxGeometry args={[room.width + wallT, h, wallT]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>
      <mesh position={[0, h / 2, room.depth / 2]} castShadow>
        <boxGeometry args={[room.width + wallT, h, wallT]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>
      <mesh position={[-room.width / 2, h / 2, 0]} castShadow>
        <boxGeometry args={[wallT, h, room.depth]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>
      <mesh position={[room.width / 2, h / 2, 0]} castShadow>
        <boxGeometry args={[wallT, h, room.depth]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>

      {/* Windows (simple recessed panels) */}
      {room.windows > 0 &&
        Array.from({ length: Math.min(room.windows, 2) }).map((_, i) => {
          const z = room.windows === 1 ? 0 : i === 0 ? -room.depth * 0.22 : room.depth * 0.22;
          return (
            <mesh key={i} position={[room.width / 2 + 0.01, h * 0.55, z]}>
              <boxGeometry args={[0.04, h * 0.35, 1.1]} />
              <meshStandardMaterial
                color="#A8C8D8"
                transparent
                opacity={0.45}
                metalness={0.3}
                roughness={0.1}
              />
            </mesh>
          );
        })}

      {/* Roof */}
      {showRoof && (
        <mesh position={[0, h + 0.15, 0]} castShadow>
          <boxGeometry args={[room.width + 0.3, 0.15, room.depth + 0.3]} />
          <meshStandardMaterial color="#5A4A3A" roughness={0.85} />
        </mesh>
      )}

      {/* Label */}
      <Html position={[0, 0.05, 0]} center distanceFactor={18} style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            letterSpacing: "0.04em",
            color: selected ? "#1a3a2a" : "#5a5248",
            background: "rgba(248,244,236,0.88)",
            padding: "3px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            border: selected ? "1px solid #2F5D4A" : "1px solid transparent",
          }}
        >
          {room.name}
        </div>
      </Html>

      {room.furniture.map((item) => (
        <FurnitureMesh
          key={item.id}
          item={item}
          selected={selectedFurnitureId === item.id}
          onSelect={() => {
            onSelect();
            onSelectFurniture(item.id);
          }}
        />
      ))}
    </group>
  );
}

function SceneContent() {
  const home = useHomeStore((s) => s.home);
  const selectedRoomId = useHomeStore((s) => s.selectedRoomId);
  const selectedFurnitureId = useHomeStore((s) => s.selectedFurnitureId);
  const wallsOpacity = useHomeStore((s) => s.wallsOpacity);
  const roofVisible = useHomeStore((s) => s.roofVisible);
  const selectRoom = useHomeStore((s) => s.selectRoom);
  const selectFurniture = useHomeStore((s) => s.selectFurniture);

  return (
    <>
      <color attach="background" args={["#E8E0D4"]} />
      <fog attach="fog" args={["#E8E0D4", 28, 55]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={40}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={["#F5F0E8", "#8A9A7A", 0.35]} />

      <Grid
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#C9BFAF"
        sectionSize={5}
        sectionThickness={1.1}
        sectionColor="#A89880"
        fadeDistance={35}
        fadeStrength={1.2}
        position={[0, -0.01, 0]}
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
        onClick={() => {
          selectRoom(null);
          selectFurniture(null);
        }}
      >
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#D4CBBA" roughness={1} />
      </mesh>

      {home.rooms.map((room) => (
        <RoomMesh
          key={room.id}
          room={room}
          selected={selectedRoomId === room.id}
          wallsOpacity={wallsOpacity}
          showRoof={roofVisible}
          onSelect={() => selectRoom(room.id)}
          selectedFurnitureId={selectedFurnitureId}
          onSelectFurniture={selectFurniture}
        />
      ))}

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.35}
        scale={40}
        blur={2.5}
        far={12}
      />

      <OrbitControls
        makeDefault
        maxPolarAngle={Math.PI / 2.05}
        minDistance={4}
        maxDistance={40}
        target={[0, 0.5, 0]}
      />
    </>
  );
}

export function HomeCanvas() {
  const roomCount = useHomeStore((s) => s.home.rooms.length);

  return (
    <div className="home-canvas">
      <Canvas
        shadows
        camera={{ position: [12, 10, 12], fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
      {roomCount === 0 && (
        <div className="canvas-empty">
          <p>Your plot is empty</p>
          <span>Prompt a layout or add rooms manually</span>
        </div>
      )}
    </div>
  );
}
