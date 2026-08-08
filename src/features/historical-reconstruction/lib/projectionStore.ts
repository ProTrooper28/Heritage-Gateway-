// ─── Annotation projection store ─────────────────────────────────────────────
// The R3F canvas projects each annotation's world position to screen space
// every frame and writes it here; the HTML overlay subscribes with
// useSyncExternalStore. Keeps 60fps updates out of React render cycles.

export interface ProjectedPoint {
  x: number;
  y: number;
  /** False when the point is behind the camera / off-screen. */
  visible: boolean;
}

type Listener = () => void;

class ProjectionStore {
  private listeners = new Set<Listener>();
  private points = new Map<number, ProjectedPoint>();
  private version = 0;

  setPoint(id: number, point: ProjectedPoint): void {
    const current = this.points.get(id);
    if (
      current &&
      Math.abs(current.x - point.x) < 0.5 &&
      Math.abs(current.y - point.y) < 0.5 &&
      current.visible === point.visible
    ) {
      return;
    }
    this.points.set(id, point);
    this.version++;
    this.listeners.forEach((listener) => listener());
  }

  removePoint(id: number): void {
    if (!this.points.delete(id)) return;
    this.version++;
    this.listeners.forEach((listener) => listener());
  }

  getPoint(id: number): ProjectedPoint | undefined {
    return this.points.get(id);
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getVersion = (): number => this.version;
}

export const projectionStore = new ProjectionStore();
