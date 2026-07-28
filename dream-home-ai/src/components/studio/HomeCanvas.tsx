"use client";

import { Html, OrbitControls, Grid, ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { FURNITURE_CATALOG, isCabinetType } from "@/lib/catalog";
import { useHomeStore } from "@/lib/store";
import type { FurnitureItem, FurnitureType, Room } from "@/lib/types";

function emissiveProps(selected: boolean) {
  return {
    emissive: selected ? "#1a3a2a" : "#000000",
    emissiveIntensity: selected ? 0.18 : 0,
  } as const;
}

function BoxPiece({
  position,
  args,
  color,
  selected,
  metalness = 0.05,
  roughness = 0.7,
  onClick,
}: {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  selected: boolean;
  metalness?: number;
  roughness?: number;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
}) {
  return (
    <mesh position={position} castShadow receiveShadow onClick={onClick}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        {...emissiveProps(selected)}
      />
    </mesh>
  );
}

function FurnitureMesh({
  item,
  selected,
  onSelect,
  parent,
}: {
  item: FurnitureItem;
  selected: boolean;
  onSelect: () => void;
  parent?: FurnitureItem;
}) {
  const cat = FURNITURE_CATALOG[item.type];
  const w = cat.w * item.scale;
  const d = cat.d * item.scale;
  const h = cat.h * item.scale;
  const type = item.type;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  };

  let baseY = 0;
  if (item.parentId && parent) {
    const parentCat = FURNITURE_CATALOG[parent.type];
    if (parent.type === "upper_cabinet") {
      baseY = 1.45;
    } else {
      baseY = parentCat.h + 0.02;
    }
  } else if (type === "upper_cabinet") {
    baseY = 1.45;
  } else if (type === "range_hood") {
    baseY = 1.55;
  } else if (
    type === "microwave" ||
    type === "coffee_maker" ||
    type === "toaster"
  ) {
    baseY = 0.92;
  }

  if (type === "rug") {
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
          {...emissiveProps(selected)}
        />
      </mesh>
    );
  }

  if (type === "plant") {
    return (
      <group
        position={[item.x, baseY, item.z]}
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
            {...emissiveProps(selected)}
          />
        </mesh>
      </group>
    );
  }

  if (type === "lamp") {
    return (
      <group
        position={[item.x, baseY, item.z]}
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

  if (type === "sofa" || type === "bed") {
    return (
      <group
        position={[item.x, baseY, item.z]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
      >
        <BoxPiece
          position={[0, h * 0.35, 0]}
          args={[w, h * 0.55, d]}
          color={item.color}
          selected={selected}
          roughness={0.85}
        />
        {type === "sofa" && (
          <BoxPiece
            position={[0, h * 0.65, -d * 0.35]}
            args={[w, h * 0.55, d * 0.25]}
            color={item.color}
            selected={false}
            roughness={0.85}
          />
        )}
        {type === "bed" && (
          <BoxPiece
            position={[0, h * 0.7, -d * 0.35]}
            args={[w * 0.95, 0.25, d * 0.25]}
            color="#F8F4EF"
            selected={false}
            roughness={0.9}
          />
        )}
      </group>
    );
  }

  if (type === "fridge") {
    return (
      <group
        position={[item.x, baseY, item.z]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
      >
        <BoxPiece
          position={[0, h / 2, 0]}
          args={[w, h, d]}
          color={item.color}
          selected={selected}
          metalness={0.55}
          roughness={0.35}
        />
        <BoxPiece
          position={[w * 0.35, h * 0.55, d / 2 + 0.01]}
          args={[0.03, 0.35, 0.02]}
          color="#888"
          selected={false}
          metalness={0.7}
          roughness={0.3}
        />
      </group>
    );
  }

  if (type === "stove" || type === "oven") {
    return (
      <group
        position={[item.x, baseY, item.z]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
      >
        <BoxPiece
          position={[0, h / 2, 0]}
          args={[w, h, d]}
          color={item.color}
          selected={selected}
          metalness={0.5}
          roughness={0.4}
        />
        {type === "stove" && (
          <>
            <mesh position={[-0.15, h + 0.01, -0.1]}>
              <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
              <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0.15, h + 0.01, -0.1]}>
              <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
              <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[-0.15, h + 0.01, 0.12]}>
              <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
              <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0.15, h + 0.01, 0.12]}>
              <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
              <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
            </mesh>
          </>
        )}
      </group>
    );
  }

  if (type === "sink") {
    return (
      <group
        position={[item.x, baseY, item.z]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
      >
        <BoxPiece
          position={[0, h / 2, 0]}
          args={[w, h, d]}
          color={item.color}
          selected={selected}
          metalness={0.45}
          roughness={0.35}
        />
        <mesh position={[0, h + 0.02, 0]}>
          <boxGeometry args={[w * 0.55, 0.06, d * 0.45]} />
          <meshStandardMaterial color="#9AA3A8" metalness={0.7} roughness={0.25} />
        </mesh>
      </group>
    );
  }

  if (isCabinetType(type)) {
    return (
      <group
        position={[item.x, baseY, item.z]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
      >
        <BoxPiece
          position={[0, h / 2, 0]}
          args={[w, h, d]}
          color={item.color}
          selected={selected}
          roughness={0.75}
        />
        {type !== "upper_cabinet" && (
          <BoxPiece
            position={[0, h + 0.015, 0]}
            args={[w + 0.04, 0.03, d + 0.04]}
            color="#D9D0C4"
            selected={false}
            roughness={0.55}
          />
        )}
        <BoxPiece
          position={[0, h * 0.45, d / 2 + 0.005]}
          args={[w * 0.08, 0.02, 0.02]}
          color="#666"
          selected={false}
          metalness={0.6}
        />
      </group>
    );
  }

  const utensilTypes: FurnitureType[] = [
    "plates",
    "bowls",
    "cups",
    "pots",
    "pans",
    "cutlery",
    "utensil_jar",
    "spice_rack",
    "cutting_board",
    "storage_bin",
  ];
  if (utensilTypes.includes(type)) {
    return (
      <group
        position={[item.x, baseY, item.z]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
      >
        {type === "plates" || type === "bowls" ? (
          <>
            <mesh position={[0, 0.03, 0]} castShadow>
              <cylinderGeometry args={[w * 0.45, w * 0.45, 0.025, 20]} />
              <meshStandardMaterial color={item.color} {...emissiveProps(selected)} />
            </mesh>
            <mesh position={[0, 0.06, 0]} castShadow>
              <cylinderGeometry args={[w * 0.42, w * 0.42, 0.025, 20]} />
              <meshStandardMaterial color={item.color} />
            </mesh>
            <mesh position={[0, 0.09, 0]} castShadow>
              <cylinderGeometry args={[w * 0.38, w * 0.38, 0.025, 20]} />
              <meshStandardMaterial color={item.color} />
            </mesh>
          </>
        ) : type === "cups" ? (
          <>
            {[-0.06, 0.06].map((ox, i) => (
              <mesh key={i} position={[ox, 0.08, 0]} castShadow>
                <cylinderGeometry args={[0.035, 0.03, 0.12, 12]} />
                <meshStandardMaterial color={item.color} {...emissiveProps(selected && i === 0)} />
              </mesh>
            ))}
          </>
        ) : type === "pots" ? (
          <mesh position={[0, h / 2, 0]} castShadow>
            <cylinderGeometry args={[w * 0.4, w * 0.38, h, 16]} />
            <meshStandardMaterial
              color={item.color}
              metalness={0.55}
              roughness={0.35}
              {...emissiveProps(selected)}
            />
          </mesh>
        ) : type === "pans" ? (
          <mesh position={[0, 0.03, 0]} rotation={[-0.1, 0, 0]} castShadow>
            <cylinderGeometry args={[w * 0.4, w * 0.4, 0.04, 20]} />
            <meshStandardMaterial
              color={item.color}
              metalness={0.6}
              roughness={0.3}
              {...emissiveProps(selected)}
            />
          </mesh>
        ) : type === "utensil_jar" ? (
          <mesh position={[0, h / 2, 0]} castShadow>
            <cylinderGeometry args={[w * 0.4, w * 0.38, h, 12]} />
            <meshStandardMaterial color={item.color} {...emissiveProps(selected)} />
          </mesh>
        ) : (
          <BoxPiece
            position={[0, h / 2, 0]}
            args={[w, h, d]}
            color={item.color}
            selected={selected}
            metalness={type === "cutlery" ? 0.45 : 0.05}
            roughness={type === "cutlery" ? 0.35 : 0.7}
          />
        )}
      </group>
    );
  }

  const metalTypes: FurnitureType[] = [
    "dishwasher",
    "microwave",
    "range_hood",
    "toaster",
    "washer",
    "dryer",
  ];
  const isMetal = metalTypes.includes(type) || type === "coffee_maker";

  return (
    <group
      position={[item.x, baseY, item.z]}
      rotation={[0, item.rotation, 0]}
      onClick={handleClick}
    >
      <BoxPiece
        position={[0, h / 2, 0]}
        args={[w, h, d]}
        color={item.color}
        selected={selected}
        metalness={isMetal ? 0.5 : 0.05}
        roughness={isMetal ? 0.35 : 0.7}
      />
    </group>
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

  const byId = useMemo(() => {
    const map = new Map<string, FurnitureItem>();
    for (const f of room.furniture) map.set(f.id, f);
    return map;
  }, [room.furniture]);

  return (
    <group position={[room.x, 0, room.z]}>
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

      {room.windows > 0 &&
        Array.from({ length: Math.min(room.windows, 2) }).map((_, i) => {
          const z =
            room.windows === 1 ? 0 : i === 0 ? -room.depth * 0.22 : room.depth * 0.22;
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

      {showRoof && (
        <mesh position={[0, h + 0.15, 0]} castShadow>
          <boxGeometry args={[room.width + 0.3, 0.15, room.depth + 0.3]} />
          <meshStandardMaterial color="#5A4A3A" roughness={0.85} />
        </mesh>
      )}

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
          parent={item.parentId ? byId.get(item.parentId) : undefined}
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
