import { useFrame } from "@react-three/fiber";

export default function RuntimeCameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    state.camera.position.x =
      Math.sin(t * 0.08) * 1.5;

    state.camera.position.y =
      Math.cos(t * 0.06) * 0.6;

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
