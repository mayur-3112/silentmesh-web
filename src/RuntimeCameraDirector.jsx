import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

export default function RuntimeCameraDirector() {
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    const targetX = Math.sin(t * 0.08) * 2.5;
    const targetY = Math.cos(t * 0.06) * 1.2;
    const targetZ = 12 + Math.sin(t * 0.04) * 1.5;

    easing.damp3(
      state.camera.position,
      [targetX, targetY, targetZ],
      0.18,
      delta
    );

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
