export default function RuntimeHorizon() {
  return (
    <mesh
      position={[0, -16, -70]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[300, 300]} />

      <meshBasicMaterial
        color="#020408"
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}
