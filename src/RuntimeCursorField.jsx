import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RuntimeCursorField() {
  const field = useRef();

  const mouse = useRef(
    new THREE.Vector3()
  );

  useFrame((state) => {
    mouse.current.x =
      (state.mouse.x * state.viewport.width) / 2;

    mouse.current.y =
      (state.mouse.y * state.viewport.height) / 2;

    field.current.position.lerp(
      mouse.current,
      0.08
    );
  });

  return (
    <mesh ref={field}>
      <sphereGeometry args={[1.2, 64, 64]} />

      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}
