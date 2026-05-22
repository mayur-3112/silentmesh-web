import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeGlowHarmonics() {
  const glow = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (glow.current) {
        glow.current.material.opacity = 0.04 + Math.sin(t * 0.5) * 0.01;
    }
  });

  return (
    <mesh ref={glow} position={[0, 0, -18]}>
      <sphereGeometry args={[16, 64, 64]} />
      <meshBasicMaterial color="#66e3ff" transparent opacity={0.04} />
    </mesh>
  );
}
