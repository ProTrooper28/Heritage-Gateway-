import { useEffect, useMemo, useRef, type ElementRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

import type { ModelRef, Monument, MonumentAnnotation } from "../types";
import { MonumentModel } from "./MonumentModel";
import { projectionStore } from "../lib/projectionStore";

export interface CameraFocusRequest {
  point: [number, number, number];
  key: number;
}

interface ViewerProps {
  monument: Monument;
  /** Optional period-specific model override (see MonumentModel). */
  model?: ModelRef;
  annotations: MonumentAnnotation[];
  autoRotate: boolean;
  focus: CameraFocusRequest | null;
  onReady?: () => void;
}

// ─── Camera rig — smooth focus / reset with damping ──────────────────────────

const DEFAULT_TARGET = new THREE.Vector3(0, 1.4, 0);
const DEFAULT_CAMERA = new THREE.Vector3(0, 5, 13);
const FOCUS_DISTANCE = 8.5;

type ControlsRef = ElementRef<typeof OrbitControls>;

function CameraRig({ focus }: { focus: CameraFocusRequest | null }) {
  const { camera, controls } = useThree();
  const rig = useRef({
    target: DEFAULT_TARGET.clone(),
    camPos: DEFAULT_CAMERA.clone(),
    animating: false,
  });

  const prevKey = useRef<number | null>(null);

  useEffect(() => {
    if (!focus || focus.key === prevKey.current) return;
    prevKey.current = focus.key;

    const controls3 = controls as unknown as ControlsRef | null;
    const currentTarget = controls3?.target ?? rig.current.target;
    // Keep the current viewing direction, orbit to the annotated element.
    const dir = camera.position.clone().sub(currentTarget);
    if (dir.lengthSq() < 0.01) dir.set(0, 0.4, 1);
    dir.normalize();

    rig.current.target = new THREE.Vector3(...focus.point);
    rig.current.camPos = rig.current.target.clone().add(dir.multiplyScalar(FOCUS_DISTANCE));
    rig.current.animating = true;
    if (controls3) controls3.enabled = false;
  }, [focus, camera, controls]);

  useFrame((_, delta) => {
    const controls3 = controls as unknown as ControlsRef | null;
    if (!rig.current.animating) return;
    const k = 1 - Math.pow(0.0001, delta); // smooth exponential damping

    camera.position.lerp(rig.current.camPos, k);
    if (controls3) {
      controls3.target.lerp(rig.current.target, k);
    }
    camera.lookAt(controls3?.target ?? rig.current.target);

    if (camera.position.distanceTo(rig.current.camPos) < 0.05) {
      camera.position.copy(rig.current.camPos);
      rig.current.animating = false;
      if (controls3) controls3.enabled = true;
    }
  });

  return null;
}

// ─── Projects annotation world positions → screen space (every frame) ────────

function ProjectionTracker({ annotations }: { annotations: MonumentAnnotation[] }) {
  const { camera, size } = useThree();
  const vec = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    return () => {
      annotations.forEach((a) => projectionStore.removePoint(a.id));
    };
  }, [annotations]);

  useFrame(() => {
    for (const annotation of annotations) {
      vec.set(annotation.position[0], annotation.position[1], annotation.position[2]);
      vec.project(camera);
      const behind = vec.z > 1 || vec.z < -1;
      projectionStore.setPoint(annotation.id, {
        x: (vec.x * 0.5 + 0.5) * size.width,
        y: (-vec.y * 0.5 + 0.5) * size.height,
        visible: !behind,
      });
    }
  });

  return null;
}

// ─── Lighting ────────────────────────────────────────────────────────────────

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[9, 14, 7]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-8, 5, -10]} intensity={0.5} color="#bcd0ff" />
      <pointLight position={[0, 6, 0]} intensity={0.35} color="#ffd9a0" />
    </>
  );
}

// ─── Viewer ──────────────────────────────────────────────────────────────────

export function MonumentViewer({
  monument,
  model,
  annotations,
  autoRotate,
  focus,
  onReady,
}: ViewerProps) {
  // Key the Canvas by monument so switching monuments fully remounts the scene.
  return (
    <Canvas
      key={monument.id}
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 5, 13], fov: 45, near: 0.1, far: 120 }}
      onCreated={() => onReady?.()}
      style={{ touchAction: "none" }}
    >
      <StudioLighting />
      <MonumentModel monument={monument} {...(model ? { model } : {})} />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.55} scale={34} blur={2.4} far={6} resolution={512} />
      <OrbitControls
        makeDefault
        enablePan
        panSpeed={0.6}
        minDistance={4}
        maxDistance={28}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate={autoRotate}
        autoRotateSpeed={0.7}
      />
      <CameraRig focus={focus} />
      <ProjectionTracker annotations={annotations} />
    </Canvas>
  );
}
