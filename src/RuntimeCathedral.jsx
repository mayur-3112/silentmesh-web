import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeCathedral() {
  const cathedral = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    cathedral.current.rotation.y =
      t * 0.015;
  });

  return (
    <group
      ref={cathedral}
      position={[18, 4, -32]}
    >
      <mesh>
        <cylinderGeometry
          args={[0.08, 0.08, 20, 16]}
        />

        <meshBasicMaterial
          color="#8ef7ff"
          transparent
          opacity={0.08}
        />
      </mesh>

      <mesh position={[0, 8, 0]}>
        <ringGeometry args={[2, 2.08, 128]} />

        <meshBasicMaterial
          color="#00c9a7"
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}
