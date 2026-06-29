import { Box3, PerspectiveCamera, Vector3 } from "three";

const DEFAULT_CAMERA_POSITION = new Vector3(14, 12, 14);
const DEFAULT_TARGET = new Vector3(0, 0, 0);

export function getDefaultCameraPosition(): Vector3 {
  return DEFAULT_CAMERA_POSITION.clone();
}

export function getDefaultCameraTarget(): Vector3 {
  return DEFAULT_TARGET.clone();
}

export function frameBounds(camera: PerspectiveCamera, bounds: Box3): { position: Vector3; target: Vector3 } {
  const size = bounds.getSize(new Vector3());
  const center = bounds.getCenter(new Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z, 1);
  const fov = (camera.fov * Math.PI) / 180;
  const distance = maxDimension / (2 * Math.tan(fov / 2));

  const direction = new Vector3(1, 0.8, 1).normalize();
  const position = center.clone().add(direction.multiplyScalar(distance * 1.75));

  camera.near = Math.max(distance / 100, 0.1);
  camera.far = Math.max(distance * 20, 1000);
  camera.updateProjectionMatrix();

  return { position, target: center };
}
