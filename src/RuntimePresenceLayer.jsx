import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimePresenceLayer() {
  const presence = useRef();

  useFrame((state) => {
    if (presence.current) {
        presence.current.position.x = state.mouse.x * 1.5;
        presence.current.position.y = state.mouse.y * 0.8;
    }
  });

  return (
    <mesh ref={presence} position={[0, 0, -20]}>
      <sphereGeometry args={[4, 64, 64]} />
      <meshBasicMaterial color="#00c9a7" transparent opacity={0.015} />
    </mesh>
  );
}
