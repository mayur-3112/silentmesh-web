import { useFrame } from "@react-three/fiber";

export default function RuntimeAttentionDirector() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.rotation.z = Math.sin(t * 0.02) * 0.004;
  });

  return null;
}
