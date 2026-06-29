import { AmbientLight, AxesHelper, Color, DirectionalLight, GridHelper, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getDefaultCameraPosition, getDefaultCameraTarget } from "./cameraUtils";

export interface ViewerScene {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: OrbitControls;
  dispose: () => void;
}

export function createScene(container: HTMLDivElement): ViewerScene {
  const scene = new Scene();
  scene.background = new Color("#09131f");

  const camera = new PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 5000);
  camera.position.copy(getDefaultCameraPosition());

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.copy(getDefaultCameraTarget());

  scene.add(new AmbientLight("#ffffff", 1.9));

  const keyLight = new DirectionalLight("#ffffff", 2.5);
  keyLight.position.set(18, 30, 20);
  scene.add(keyLight);

  const fillLight = new DirectionalLight("#9cc7ff", 1.25);
  fillLight.position.set(-16, 12, -14);
  scene.add(fillLight);

  const grid = new GridHelper(40, 40, "#2bc1ff", "#18324c");
  grid.position.y = -0.001;
  scene.add(grid);
  scene.add(new AxesHelper(5));

  let animationFrameId = 0;

  const render = () => {
    controls.update();
    renderer.render(scene, camera);
    animationFrameId = window.requestAnimationFrame(render);
  };

  render();

  const dispose = () => {
    window.cancelAnimationFrame(animationFrameId);
    controls.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };

  return { scene, camera, renderer, controls, dispose };
}
