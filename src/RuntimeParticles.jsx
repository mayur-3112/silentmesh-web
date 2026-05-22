import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function RuntimeParticles() {
  const particles = useRef();

  useFrame((state) => {
    particles.current.rotation.y =
      state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={particles}>
      <sphereGeometry args={[18, 24, 24]} />

      <pointsMaterial
        color="#00c9a7"
        size={0.02}
        transparent
        opacity={0.3}
      />
    </points>
  );
}
