import { Color, Material, Mesh, MeshStandardMaterial, Object3D, Raycaster, Vector2 } from "three";

const HIGHLIGHT_COLOR = new Color("#ffb347");
const originalMaterials = new WeakMap<Mesh, Material | Material[]>();

export interface PickResult {
  mesh: Mesh;
  expressId: number | null;
}

export function createPicker(): {
  pick: (event: PointerEvent, container: HTMLDivElement, cameraObject: Object3D, targets: Object3D[]) => PickResult | null;
} {
  const raycaster = new Raycaster();
  const pointer = new Vector2();

  return {
    pick: (event, container, cameraObject, targets) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, cameraObject as never);

      const hits = raycaster.intersectObjects(targets, true);
      const first = hits.find((hit) => hit.object instanceof Mesh);
      if (!first || !(first.object instanceof Mesh)) {
        return null;
      }

      const expressId = typeof first.faceIndex === "number" && "geometry" in first.object
        ? readExpressId(first.object, first.faceIndex)
        : null;

      return { mesh: first.object, expressId };
    }
  };
}

export function highlightSelection(nextMesh: Mesh | null, previousMesh: Mesh | null): void {
  if (previousMesh && previousMesh !== nextMesh) {
    restoreMaterial(previousMesh);
  }

  if (!nextMesh || nextMesh === previousMesh) {
    return;
  }

  if (!originalMaterials.has(nextMesh)) {
    originalMaterials.set(nextMesh, nextMesh.material);
  }

  nextMesh.material = new MeshStandardMaterial({
    color: HIGHLIGHT_COLOR,
    emissive: HIGHLIGHT_COLOR,
    emissiveIntensity: 0.15,
    metalness: 0.15,
    roughness: 0.7
  });
}

export function clearHighlight(mesh: Mesh | null): void {
  if (!mesh) {
    return;
  }

  restoreMaterial(mesh);
}

function restoreMaterial(mesh: Mesh): void {
  const original = originalMaterials.get(mesh);
  if (!original) {
    return;
  }

  if (mesh.material instanceof Material) {
    mesh.material.dispose();
  }

  mesh.material = original;
  originalMaterials.delete(mesh);
}

function readExpressId(mesh: Mesh, faceIndex: number): number | null {
  const geometry = mesh.geometry as {
    attributes?: {
      expressID?: {
        array: ArrayLike<number>;
      };
    };
  };

  const expressIds = geometry.attributes?.expressID?.array;
  if (!expressIds) {
    return null;
  }

  return expressIds[faceIndex] ?? null;
}
