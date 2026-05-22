export default function RuntimeFog() {
  return (
    <>
      <mesh position={[0, 0, -8]}>
        <planeGeometry args={[80, 80]} />

        <meshBasicMaterial
          color="#00c9a7"
          transparent
          opacity={0.03}
        />
      </mesh>

      <mesh position={[0, -8, -10]}>
        <planeGeometry args={[100, 100]} />

        <meshBasicMaterial
          color="#1d4ed8"
          transparent
          opacity={0.04}
        />
      </mesh>
    </>
  );
}
