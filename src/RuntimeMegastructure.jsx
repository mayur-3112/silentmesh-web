import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeMegastructure() {
  const structure = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    structure.current.rotation.z =
      t * 0.01;

    structure.current.rotation.x =
      Math.sin(t * 0.04) * 0.08;
  });

  return (
    <group
      ref={structure}
      position={[0, 0, -40]}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[28, 0.08, 32, 400]} />

        <meshBasicMaterial
          color="#00c9a7"
          transparent
          opacity={0.04}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0.6, 0]}>
        <torusGeometry args={[36, 0.05, 32, 400]} />

        <meshBasicMaterial
          color="#66e3ff"
          transparent
          opacity={0.025}
        />
      </mesh>
    </group>
  );
}
