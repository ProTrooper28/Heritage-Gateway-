import { Component, Suspense, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";

import type { ModelRef, Monument } from "../types";
import { ModelPlaceholder } from "./ModelPlaceholder";

// ─── GLB loader ──────────────────────────────────────────────────────────────
// Set `monument.model.available = true` (and point `model.url` at a .glb in
// /public/models) to load a real scan/reconstruction. Everything else —
// annotations, timeline, evidence — keeps working unchanged.

function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function usePreload(url: string | undefined) {
  if (url) {
    // Safe: useGLTF caches; only preloads declared-available models.
    useGLTF.preload(url);
  }
}

function ModelContent({ monument, model }: { monument: Monument; model: ModelRef }) {
  usePreload(model.available ? model.url : undefined);
  if (model.available && model.url) {
    return <GLTFModel url={model.url} />;
  }
  return <ModelPlaceholder monument={monument} />;
}

/** If a GLB fails to load, silently fall back to the procedural placeholder. */
class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  override state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function MonumentModel({
  monument,
  model,
  groupRef,
}: {
  monument: Monument;
  /** Override the base model — used for period-specific reconstructions. */
  model?: ModelRef;
  groupRef?: React.Ref<Group>;
}) {
  // A period-specific model takes precedence when available; otherwise fall
  // back to the monument's base model (or its procedural placeholder).
  const effective = model ?? monument.model;
  return (
    <group {...(groupRef ? { ref: groupRef } : {})} position={[0, -0.1, 0]}>
      <ModelErrorBoundary fallback={<ModelPlaceholder monument={monument} />}>
        <Suspense fallback={null}>
          <ModelContent monument={monument} model={effective} />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
}
