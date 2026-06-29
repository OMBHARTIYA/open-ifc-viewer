import { Material, Mesh, Object3D } from "three";

function disposeMaterial(material: Material | Material[]): void {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose());
    return;
  }

  material.dispose();
}

export function disposeModel(model: Object3D): void {
  model.traverse((child) => {
    const mesh = child as Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    if (mesh.material) {
      disposeMaterial(mesh.material);
    }
  });
}
