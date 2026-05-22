import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RuntimeCore() {
  const core = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    core.current.rotation.y = t * 0.12;

    core.current.scale.setScalar(
      1 + Math.sin(t * 1.2) * 0.04
    );
  });

  return (
    <group ref={core}>
      {/* outer orchestration ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.8, 0.03, 32, 300]} />

        <meshBasicMaterial
          color="#00c9a7"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* second ring */}
      <mesh rotation={[Math.PI / 2, 0.4, 0]}>
        <torusGeometry args={[2.9, 0.02, 32, 200]} />

        <meshBasicMaterial
          color="#66e3ff"
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* orchestration sphere */}
      <mesh>
        <icosahedronGeometry args={[1.4, 6]} />

        <meshStandardMaterial
          color="#00c9a7"
          emissive="#00c9a7"
          emissiveIntensity={2.5}
          wireframe
        />
      </mesh>

      {/* atmospheric pulse */}
      <mesh>
        <sphereGeometry args={[2.8, 64, 64]} />

        <meshBasicMaterial
          color="#00c9a7"
          transparent
          opacity={0.04}
        />
      </mesh>
    </group>
  );
}
