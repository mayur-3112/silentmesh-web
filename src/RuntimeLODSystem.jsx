import { Detailed } from "@react-three/drei";

export default function RuntimeLODSystem() {
  return (
    <Detailed distances={[0, 20, 40]}>
      {/* high detail */}
      <mesh>
        <icosahedronGeometry args={[2, 6]} />
      </mesh>

      {/* medium */}
      <mesh>
        <icosahedronGeometry args={[2, 3]} />
      </mesh>

      {/* low */}
      <mesh>
        <icosahedronGeometry args={[2, 1]} />
      </mesh>
    </Detailed>
  );
}
