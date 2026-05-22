import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

export default function RuntimeCameraDirector() {
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    const targetX = Math.sin(t * 0.08) * 2.5;
    const targetY = Math.cos(t * 0.06) * 1.2;
    easing.damp(state.camera.position, "x", targetX, 0.18, delta);
    easing.damp(state.camera.position, "y", targetY, 0.18, delta);

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
