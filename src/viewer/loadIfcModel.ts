import { Box3, Mesh, Object3D, Vector3 } from "three";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { IFCELEMENT } from "web-ifc";
import type { ModelStats, SelectedElementInfo } from "../types/viewer";
import { safeProperties } from "../utils/safeProperties";

export interface LoadedIfcModel {
  model: Object3D;
  stats: ModelStats;
  getSelectionInfo: (expressId: number) => Promise<SelectedElementInfo>;
  dispose: () => void;
}

export async function loadIfcModel(file: File): Promise<LoadedIfcModel> {
  const loader = new IFCLoader();
  await loader.ifcManager.setWasmPath("https://unpkg.com/web-ifc@0.0.69/");

  const url = URL.createObjectURL(file);

  try {
    const model = await new Promise<Awaited<ReturnType<IFCLoader["parse"]>>>((resolve, reject) => {
      loader.load(
        url,
        (loadedModel) => resolve(loadedModel),
        undefined,
        (error) => reject(error)
      );
    });
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const meshCount = countMeshes(model);
    const entityCount = await estimateEntityCount(loader, model.modelID);

    return {
      model,
      stats: {
        fileName: file.name,
        fileSizeBytes: file.size,
        entityCount,
        meshCount,
        bounds: {
          x: roundSize(size.x),
          y: roundSize(size.y),
          z: roundSize(size.z)
        }
      },
      getSelectionInfo: async (expressId) => {
        const [itemProperties, typeProperties] = await Promise.all([
          loader.ifcManager.getItemProperties(model.modelID, expressId, true),
          loader.ifcManager.getTypeProperties(model.modelID, expressId, true).catch(() => null)
        ]);

        return {
          expressId,
          name: readLabel(itemProperties, "Name"),
          type: readLabel(typeProperties ?? itemProperties, "type") ?? readLabel(itemProperties, "ObjectType"),
          properties: safeProperties(itemProperties)
        };
      },
      dispose: () => {
        loader.ifcManager.close(model.modelID);
      }
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function estimateEntityCount(loader: IFCLoader, modelId: number): Promise<number> {
  try {
    const ids = await loader.ifcManager.getAllItemsOfType(modelId, IFCELEMENT, false);
    return ids.length;
  } catch {
    return 0;
  }
}

function countMeshes(model: Object3D): number {
  let meshCount = 0;
  model.traverse((child) => {
    if (child instanceof Mesh) {
      meshCount += 1;
    }
  });
  return meshCount;
}

function readLabel(record: unknown, key: string): string | undefined {
  if (!record || typeof record !== "object") {
    return undefined;
  }

  const value = (record as Record<string, unknown>)[key];
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "value" in value) {
    const inner = (value as { value?: unknown }).value;
    return typeof inner === "string" ? inner : undefined;
  }

  return undefined;
}

function roundSize(value: number): number {
  return Math.round(value * 100) / 100;
}
