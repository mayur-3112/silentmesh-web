import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RuntimeMagneticNodes() {
  const group = useRef();

  const nodes = useMemo(() => {
    return Array.from({ length: 80 }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 20
      ),
    }));
  }, []);

  useFrame((state) => {
    group.current.children.forEach((node) => {
      const mouseX =
        state.mouse.x * 8;

      const mouseY =
        state.mouse.y * 4;

      node.position.x +=
        (mouseX - node.position.x) * 0.002;

      node.position.y +=
        (mouseY - node.position.y) * 0.002;
    });
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh
          key={i}
          position={n.position}
        >
          <sphereGeometry args={[0.05, 16, 16]} />

          <meshBasicMaterial
            color="#8ef7ff"
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}
