import { useMemo } from "react";
import * as THREE from "three";
import type { Monument } from "../types";

// ─── Procedural placeholder models ───────────────────────────────────────────
// Stylised stand-ins rendered until real GLB/GLTF files are available. Each
// variant's geometry is laid out to match the annotation positions in
// data/monuments.ts. Swap in real models by setting model.available = true.

export type PlaceholderVariant = "fort" | "tomb" | "ruins";

const SANDSTONE = "#c8a06a";
const SANDSTONE_DARK = "#a87d4d";
const MARBLE = "#efe9dd";
const GARDEN = "#4a5d3a";
const WATER = "#3d5560";

function material(color: string, opts: { roughness?: number; metalness?: number } = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.9,
    metalness: opts.metalness ?? 0.02,
  });
}

/** Small domed pavilion (chhatri). */
function Chhatri({
  position,
  scale = 1,
  color = SANDSTONE,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const pillarMat = useMemo(() => material(color), [color]);
  const domeMat = useMemo(() => material(color, { roughness: 0.7 }), [color]);
  const pillarGeo = useMemo(() => new THREE.CylinderGeometry(0.03, 0.04, 1, 6), []);
  const roofGeo = useMemo(() => new THREE.BoxGeometry(0.55, 0.06, 0.55), []);
  const domeGeo = useMemo(
    () => new THREE.SphereGeometry(0.28, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    [],
  );
  const pillarPositions: [number, number][] = [
    [Math.cos(0) * 0.22, Math.sin(0) * 0.22],
    [Math.cos(Math.PI / 2) * 0.22, Math.sin(Math.PI / 2) * 0.22],
    [Math.cos(Math.PI) * 0.22, Math.sin(Math.PI) * 0.22],
    [Math.cos((3 * Math.PI) / 2) * 0.22, Math.sin((3 * Math.PI) / 2) * 0.22],
  ];
  return (
    <group position={position} scale={scale}>
      {pillarPositions.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.5, z]} geometry={pillarGeo} material={pillarMat} castShadow />
      ))}
      <mesh position={[0, 1, 0]} geometry={roofGeo} material={pillarMat} castShadow />
      <mesh position={[0, 1.28, 0]} geometry={domeGeo} material={domeMat} castShadow />
    </group>
  );
}

// ─── FORT (Red Fort) ─────────────────────────────────────────────────────────
function FortModel() {
  const sandstone = useMemo(() => material(SANDSTONE), []);
  const dark = useMemo(() => material(SANDSTONE_DARK), []);
  const marble = useMemo(() => material(MARBLE), []);
  const groundMat = useMemo(() => material("#6e5a40", { roughness: 1 }), []);
  const gardenMat = useMemo(() => material(GARDEN), []);
  const waterMat = useMemo(() => material(WATER, { roughness: 0.25, metalness: 0.1 }), []);

  const wallGeo = useMemo(() => new THREE.BoxGeometry(22, 1.2, 0.4), []);
  const wallSideGeo = useMemo(() => new THREE.BoxGeometry(20, 1.2, 0.4), []);
  const wallTopGeo = useMemo(() => new THREE.BoxGeometry(0.7, 0.45, 0.45), []);
  const wallTopSideGeo = useMemo(() => new THREE.BoxGeometry(0.45, 0.45, 0.7), []);

  const gatePierGeo = useMemo(() => new THREE.BoxGeometry(1.4, 3.2, 1.6), []);
  const gateLintelGeo = useMemo(() => new THREE.BoxGeometry(4.6, 1, 1.7), []);
  const gateArchGeo = useMemo(() => new THREE.BoxGeometry(2.4, 2.6, 0.9), []);
  const gateCrownGeo = useMemo(() => new THREE.BoxGeometry(2.4, 0.5, 1.6), []);

  const columnGeo = useMemo(() => new THREE.CylinderGeometry(0.12, 0.14, 2.3, 8), []);
  const arcadeGeo = useMemo(() => new THREE.CylinderGeometry(0.09, 0.12, 1.1, 8), []);
  const arcadeRoofGeo = useMemo(() => new THREE.BoxGeometry(0.5, 0.14, 4.4), []);
  const slabGeo = useMemo(() => new THREE.BoxGeometry(4.6, 0.3, 4.6), []);
  const throneGeo = useMemo(() => new THREE.BoxGeometry(2, 1.2, 0.5), []);

  const palaceGeo = useMemo(() => new THREE.BoxGeometry(3.6, 2.3, 3.2), []);
  const archGeo = useMemo(() => new THREE.BoxGeometry(0.7, 1.5, 0.3), []);
  const archTopGeo = useMemo(() => new THREE.BoxGeometry(3.2, 0.35, 0.3), []);

  const khasPlatformGeo = useMemo(() => new THREE.BoxGeometry(4.4, 0.7, 4.4), []);
  const khasColumnGeo = useMemo(() => new THREE.CylinderGeometry(0.14, 0.16, 2.5, 8), []);
  const khasRoofGeo = useMemo(() => new THREE.BoxGeometry(4.8, 0.25, 4.8), []);

  const masjidBaseGeo = useMemo(() => new THREE.BoxGeometry(3.4, 0.8, 2.8), []);
  const masjidDomeGeo = useMemo(
    () => new THREE.SphereGeometry(0.42, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    [],
  );
  const masjidDrumGeo = useMemo(() => new THREE.CylinderGeometry(0.3, 0.34, 0.35, 10), []);

  const gardenGeo = useMemo(() => new THREE.PlaneGeometry(8, 5), []);
  const poolGeo = useMemo(() => new THREE.CylinderGeometry(0.5, 0.6, 0.12, 16), []);
  const fountainGeo = useMemo(() => new THREE.CylinderGeometry(0.16, 0.2, 0.5, 8), []);

  // Merlon placement helper
  function merlons(count: number, length: number, height: number, isSide: boolean, geo: THREE.BufferGeometry, geoStep: number) {
    const items: { x: number; z: number }[] = [];
    for (let i = 0; i < count; i++) {
      const offset = -length / 2 + (length / count) * (i + 0.5);
      items.push(isSide ? { x: offset, z: 0 } : { x: 0, z: offset });
    }
    return (
      <>
        {items.map((p, i) => (
          <mesh key={i} position={[p.x, height * 0.86, p.z]} geometry={geo} material={sandstone} castShadow />
        ))}
      </>
    );
  }

  return (
    <group>
      {/* Ground platform */}
      <mesh position={[0, -0.15, 1]} geometry={useMemo(() => new THREE.BoxGeometry(24, 0.3, 26), [])} material={groundMat} receiveShadow />

      {/* Perimeter walls + merlons */}
      <mesh position={[0, 0.6, -10]} geometry={wallGeo} material={sandstone} castShadow />
      <mesh position={[0, 0.6, 11.4]} geometry={wallGeo} material={sandstone} castShadow />
      <mesh position={[-11, 0.6, 0.7]} geometry={wallSideGeo} material={sandstone} castShadow />
      <mesh position={[11, 0.6, 0.7]} geometry={wallSideGeo} material={sandstone} castShadow />
      <group position={[0, 0, -10]}>{merlons(12, 22, 1.2, false, wallTopGeo, 0)}</group>
      <group position={[0, 0, 11.4]}>{merlons(12, 22, 1.2, false, wallTopGeo, 0)}</group>
      <group position={[-11, 0, 0.7]}>{merlons(11, 20, 1.2, true, wallTopSideGeo, 0)}</group>
      <group position={[11, 0, 0.7]}>{merlons(11, 20, 1.2, true, wallTopSideGeo, 0)}</group>

      {/* 01 — Lahori Gate */}
      <group position={[0, 0, 9.2]}>
        <mesh position={[-1.6, 1.6, 0]} geometry={gatePierGeo} material={sandstone} castShadow />
        <mesh position={[1.6, 1.6, 0]} geometry={gatePierGeo} material={sandstone} castShadow />
        <mesh position={[0, 3.35, 0]} geometry={gateLintelGeo} material={sandstone} castShadow />
        <mesh position={[0, 2.05, 0]} geometry={gateArchGeo} material={dark} castShadow />
        <mesh position={[0, 4.15, 0]} geometry={gateCrownGeo} material={dark} castShadow />
        <Chhatri position={[-1.7, 4.4, 0]} scale={0.85} />
        <Chhatri position={[1.7, 4.4, 0]} scale={0.85} />
      </group>

      {/* 02 — Chhatta Chowk arcade */}
      {[-1.9, 1.9].map((x) => (
        <group key={x}>
          {[5.3, 6.4, 7.5, 8.6].map((z) => (
            <mesh key={z} position={[x, 0.55, z]} geometry={arcadeGeo} material={dark} castShadow />
          ))}
          <mesh position={[x, 1.25, 5.9]} geometry={arcadeRoofGeo} material={sandstone} castShadow />
        </group>
      ))}

      {/* 03 — Naubat Khana */}
      <group position={[0, 0, 3.4]}>
        <mesh position={[0, 1.9, 0]} geometry={useMemo(() => new THREE.BoxGeometry(7, 3.8, 2.4), [])} material={sandstone} castShadow />
        <mesh position={[0, 1.75, 0.4]} geometry={useMemo(() => new THREE.BoxGeometry(2.6, 3.2, 0.7), [])} material={dark} castShadow />
        <mesh position={[0, 4.2, 0]} geometry={useMemo(() => new THREE.BoxGeometry(7.4, 0.5, 2.6), [])} material={sandstone} castShadow />
        <Chhatri position={[-1.9, 4.6, 0]} scale={0.8} />
        <Chhatri position={[1.9, 4.6, 0]} scale={0.8} />
      </group>

      {/* 04 — Diwan-i-Aam (hypostyle hall) */}
      <group position={[-4.6, 0, -0.6]}>
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <mesh key={`${row}-${col}`} position={[col * 1.3 - 1.95, 1.15, row * 1.3 - 1.95]} geometry={columnGeo} material={sandstone} castShadow />
          )),
        )}
        <mesh position={[0, 2.45, 0]} geometry={slabGeo} material={sandstone} castShadow />
        <mesh position={[0, 2.75, -2.1]} geometry={throneGeo} material={marble} castShadow />
      </group>

      {/* 05 — Rang Mahal */}
      <group position={[-3.4, 0, -4.3]}>
        <mesh position={[0, 1.15, 0]} geometry={palaceGeo} material={marble} castShadow />
        {[-1.1, 0, 1.1].map((x) => (
          <mesh key={x} position={[x, 0.55, 1.7]} geometry={archGeo} material={sandstone} castShadow />
        ))}
        <mesh position={[0, 1.65, 1.7]} geometry={archTopGeo} material={sandstone} castShadow />
        <Chhatri position={[0, 2.6, 0]} scale={0.7} color={MARBLE} />
      </group>

      {/* 06 — Diwan-i-Khas */}
      <group position={[4.6, 0, -0.6]}>
        <mesh position={[0, 0.35, 0]} geometry={khasPlatformGeo} material={marble} receiveShadow />
        {[[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]].map(([x, z], i) => (
          <mesh key={i} position={[x ?? 0, 1.6, z ?? 0]} geometry={khasColumnGeo} material={marble} castShadow />
        ))}
        <mesh position={[0, 2.95, 0]} geometry={khasRoofGeo} material={marble} castShadow />
        <Chhatri position={[0, 3.4, 0]} scale={0.9} color={MARBLE} />
      </group>

      {/* 07 — Moti Masjid */}
      <group position={[4.2, 0, -4.4]}>
        <mesh position={[0, 0.4, 0]} geometry={masjidBaseGeo} material={marble} receiveShadow />
        {[-1, 0, 1].map((x) => (
          <mesh key={x} position={[x, 1.5, 0]} geometry={masjidDomeGeo} material={marble} castShadow />
        ))}
        {[-1, 0, 1].map((x) => (
          <mesh key={x} position={[x, 1.35, 0]} geometry={masjidDrumGeo} material={marble} castShadow />
        ))}
      </group>

      {/* 08 — Hayat Bakhsh Bagh garden */}
      <group position={[0, 0, -8.6]}>
        <mesh position={[0, 0.06, 0]} geometry={gardenGeo} rotation={[-Math.PI / 2, 0, 0]} material={gardenMat} receiveShadow />
        <mesh position={[0, 0.1, 0]} geometry={poolGeo} material={waterMat} />
        <mesh position={[0, 0.32, 0]} geometry={fountainGeo} material={marble} castShadow />
        <Chhatri position={[-2.6, 0.5, -1.4]} scale={0.75} />
        <Chhatri position={[2.6, 0.5, -1.4]} scale={0.75} />
      </group>
    </group>
  );
}

// ─── TOMB (Taj Mahal) ────────────────────────────────────────────────────────
function TombModel() {
  const marble = useMemo(() => material(MARBLE), []);
  const sandstone = useMemo(() => material(SANDSTONE), []);
  const groundMat = useMemo(() => material("#6e5a40", { roughness: 1 }), []);
  const gardenMat = useMemo(() => material(GARDEN), []);
  const waterMat = useMemo(() => material(WATER, { roughness: 0.2, metalness: 0.1 }), []);

  const gateGeo = useMemo(() => new THREE.BoxGeometry(8, 6.8, 2.2), []);
  const gateArchGeo = useMemo(() => new THREE.BoxGeometry(3.4, 4.6, 1), []);
  const gateTopGeo = useMemo(() => new THREE.BoxGeometry(9.4, 1.2, 2.4), []);
  const platformGeo = useMemo(() => new THREE.BoxGeometry(10.4, 1.4, 10.4), []);
  const baseGeo = useMemo(() => new THREE.BoxGeometry(6.4, 1.1, 6.4), []);
  const tierGeo = useMemo(() => new THREE.BoxGeometry(5, 0.35, 5), []);
  const chamberGeo = useMemo(() => new THREE.BoxGeometry(4.4, 1.3, 4.4), []);
  const chamberColumnGeo = useMemo(() => new THREE.CylinderGeometry(0.1, 0.12, 1.4, 8), []);
  const drumGeo = useMemo(() => new THREE.CylinderGeometry(1.15, 1.35, 1.3, 16), []);
  const domeGeo = useMemo(() => new THREE.SphereGeometry(1.65, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const innerDomeGeo = useMemo(() => new THREE.SphereGeometry(0.9, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const finialGeo = useMemo(() => new THREE.CylinderGeometry(0.06, 0.06, 1.2, 6), []);
  const finialTopGeo = useMemo(() => new THREE.SphereGeometry(0.14, 8, 6), []);
  const minaretBaseGeo = useMemo(() => new THREE.CylinderGeometry(0.55, 0.7, 3.2, 10), []);
  const minaretShaftGeo = useMemo(() => new THREE.CylinderGeometry(0.42, 0.55, 2.6, 10), []);
  const minaretCapGeo = useMemo(() => new THREE.CylinderGeometry(0.5, 0.5, 0.5, 10), []);
  const gardenGeo = useMemo(() => new THREE.PlaneGeometry(16, 7), []);
  const channelGeo = useMemo(() => new THREE.BoxGeometry(0.7, 0.08, 6.6), []);
  const groundGeo = useMemo(() => new THREE.BoxGeometry(26, 0.3, 26), []);

  const minaretPositions: [number, number][] = [
    [-6.2, -6.2],
    [6.2, -6.2],
    [-6.2, 8.2],
    [6.2, 8.2],
  ];
  const chhatriPositions: [number, number][] = [
    [-4.2, -4.2],
    [4.2, -4.2],
    [-4.2, 8.2],
    [4.2, 8.2],
  ];

  return (
    <group>
      {/* Ground */}
      <mesh position={[0, -0.15, 1]} geometry={groundGeo} material={groundMat} receiveShadow />

      {/* Charbagh garden */}
      <mesh position={[0, 0.06, 6]} geometry={gardenGeo} rotation={[-Math.PI / 2, 0, 0]} material={gardenMat} receiveShadow />
      <mesh position={[0, 0.09, 6]} geometry={channelGeo} material={waterMat} />

      {/* 01 — Great gateway */}
      <group position={[0, 0, 10.5]}>
        <mesh position={[0, 3.4, 0]} geometry={gateGeo} material={sandstone} castShadow />
        <mesh position={[0, 3.1, 0.6]} geometry={gateArchGeo} material={sandstone} castShadow />
        <mesh position={[0, 7, 0]} geometry={gateTopGeo} material={sandstone} castShadow />
        <Chhatri position={[-2.6, 7.6, 0]} scale={1.1} />
        <Chhatri position={[2.6, 7.6, 0]} scale={1.1} />
      </group>

      {/* Platform */}
      <mesh position={[0, 0.7, 2]} geometry={platformGeo} material={marble} receiveShadow />

      {/* Mausoleum base + tier */}
      <mesh position={[0, 1.75, 0]} geometry={baseGeo} material={marble} castShadow />
      <mesh position={[0, 2.45, 0]} geometry={tierGeo} material={marble} castShadow />

      {/* 05 — Cenotaph chamber */}
      <mesh position={[0, 3.1, 0]} geometry={chamberGeo} material={marble} castShadow />
      {[[-1.3, -1.3], [1.3, -1.3], [-1.3, 1.3], [1.3, 1.3]].map(([x, z], i) => (
        <mesh key={i} position={[x ?? 0, 3.8, z ?? 0]} geometry={chamberColumnGeo} material={marble} castShadow />
      ))}

      {/* 02 — Dome */}
      <mesh position={[0, 4.55, 0]} geometry={drumGeo} material={marble} castShadow />
      <mesh position={[0, 6.2, 0]} geometry={domeGeo} material={marble} castShadow />
      <mesh position={[0, 7.55, 0]} geometry={innerDomeGeo} material={marble} castShadow />
      <mesh position={[0, 8.6, 0]} geometry={finialGeo} material={marble} castShadow />
      <mesh position={[0, 9.25, 0]} geometry={finialTopGeo} material={marble} castShadow />

      {/* 03 — Minarets */}
      {minaretPositions.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.6, 0]} geometry={minaretBaseGeo} material={sandstone} castShadow />
          <mesh position={[0, 3.5, 0]} geometry={minaretShaftGeo} material={marble} castShadow />
          <mesh position={[0, 4.55, 0]} geometry={minaretCapGeo} material={marble} castShadow />
          <Chhatri position={[0, 5.1, 0]} scale={0.5} color={MARBLE} />
        </group>
      ))}

      {/* Corner chhatris on platform */}
      {chhatriPositions.map(([x, z], i) => (
        <Chhatri key={i} position={[x, 1.55, z]} scale={0.85} color={MARBLE} />
      ))}
    </group>
  );
}

// ─── RUINS (Hampi) ───────────────────────────────────────────────────────────
function RuinsModel() {
  const stone = useMemo(() => material("#9c8a72"), []);
  const darkStone = useMemo(() => material("#7d6b54"), []);
  const groundMat = useMemo(() => material("#5f5140", { roughness: 1 }), []);
  const sandMat = useMemo(() => material("#7a6a50", { roughness: 1 }), []);

  const boulderGeo = useMemo(() => new THREE.DodecahedronGeometry(0.5, 0), []);
  const gopuramBaseGeo = useMemo(() => new THREE.BoxGeometry(3.4, 1.6, 3), []);
  const gopuramTierGeo = useMemo(() => new THREE.BoxGeometry(3.1, 1.15, 2.7), []);
  const gopuramTier2Geo = useMemo(() => new THREE.BoxGeometry(2.65, 1.15, 2.3), []);
  const gopuramTier3Geo = useMemo(() => new THREE.BoxGeometry(2.2, 1.15, 1.9), []);
  const gopuramTier4Geo = useMemo(() => new THREE.BoxGeometry(1.75, 1.15, 1.5), []);
  const gopuramTopGeo = useMemo(() => new THREE.BoxGeometry(1.2, 1, 1.1), []);
  const chariotBodyGeo = useMemo(() => new THREE.BoxGeometry(1.5, 2, 1.2), []);
  const chariotRoofGeo = useMemo(() => new THREE.ConeGeometry(1.15, 1.1, 8), []);
  const wheelGeo = useMemo(() => new THREE.CylinderGeometry(0.34, 0.34, 0.2, 12), []);
  const platformGeo = useMemo(() => new THREE.BoxGeometry(5, 1, 4), []);
  const ruinColumnGeo = useMemo(() => new THREE.CylinderGeometry(0.18, 0.22, 2.6, 8), []);
  const ruinLintelGeo = useMemo(() => new THREE.BoxGeometry(4.6, 0.4, 0.5), []);

  const boulders: [number, number, number, number][] = [
    [-8, 0.4, 5, 2.2],
    [-6.5, 0.5, 6.5, 1.6],
    [7, 0.4, -6, 2.4],
    [8.5, 0.35, 4, 1.9],
    [-7.5, 0.3, -5, 1.4],
    [5.5, 0.45, 7, 2.0],
    [9, 0.25, -3.5, 1.2],
  ];

  return (
    <group>
      <mesh position={[0, -0.15, 0]} geometry={useMemo(() => new THREE.BoxGeometry(24, 0.3, 24), [])} material={groundMat} receiveShadow />
      <mesh position={[0, 0.05, 0]} geometry={useMemo(() => new THREE.PlaneGeometry(22, 22), [])} rotation={[-Math.PI / 2, 0, 0]} material={sandMat} receiveShadow />

      {/* 01 — Virupaksha gopuram */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.8, 0]} geometry={gopuramBaseGeo} material={stone} castShadow />
        <mesh position={[0, 2.9, 0]} geometry={gopuramTierGeo} material={stone} castShadow />
        <mesh position={[0, 4.05, 0]} geometry={gopuramTier2Geo} material={darkStone} castShadow />
        <mesh position={[0, 5.2, 0]} geometry={gopuramTier3Geo} material={stone} castShadow />
        <mesh position={[0, 6.35, 0]} geometry={gopuramTier4Geo} material={darkStone} castShadow />
        <mesh position={[0, 7.35, 0]} geometry={gopuramTopGeo} material={stone} castShadow />
      </group>

      {/* 02 — Stone chariot */}
      <group position={[4.4, 0, -3.2]}>
        <mesh position={[0, 1, 0]} geometry={chariotBodyGeo} material={stone} castShadow />
        <mesh position={[0, 2.3, 0]} geometry={chariotRoofGeo} material={darkStone} castShadow />
        {[[-0.85, -0.55], [0.85, -0.55], [-0.85, 0.55], [0.85, 0.55]].map(([x, z], i) => (
          <mesh key={i} position={[x ?? 0, 0.35, z ?? 0]} geometry={wheelGeo} material={darkStone} castShadow />
        ))}
      </group>

      {/* 03 — Royal enclosure ruins */}
      <group position={[-4.6, 0, 3.4]}>
        <mesh position={[0, 0.5, 0]} geometry={platformGeo} material={stone} castShadow />
        {[[-1.6, -1.2, 0], [-1.6, 1.2, 0.2], [1.6, -1.2, -0.15], [1.6, 1.2, 0.1]].map(([x, z, tilt], i) => (
          <mesh key={i} position={[x ?? 0, 1.9, z ?? 0]} rotation={[tilt ?? 0, 0, tilt ?? 0]} geometry={ruinColumnGeo} material={stone} castShadow />
        ))}
        <mesh position={[0, 2.5, -1.9]} geometry={ruinLintelGeo} material={stone} castShadow />
      </group>

      {/* Scattered boulders */}
      {boulders.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={s} geometry={boulderGeo} material={i % 2 === 0 ? stone : darkStone} castShadow />
      ))}
    </group>
  );
}

export function ModelPlaceholder({ monument }: { monument: Monument }) {
  switch (monument.id) {
    case "taj-mahal":
      return <TombModel />;
    case "hampi":
      return <RuinsModel />;
    default:
      return <FortModel />;
  }
}
