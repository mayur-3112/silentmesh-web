import { useMemo } from "react";

export default function RuntimeConstellations() {
  const nodes = useMemo(() => {
    return Array.from({ length: 120 }).map(() => ({
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 60,
    }));
  }, []);

  return (
    <group>
      {nodes.map((n, i) => (
        <mesh
          key={i}
          position={[n.x, n.y, n.z]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />

          <meshBasicMaterial
            color="#8ef7ff"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
