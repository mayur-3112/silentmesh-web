import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RuntimeMicroMotion() {
  const motion = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (motion.current) {
        motion.current.rotation.z = Math.sin(t * 0.04) * 0.01;
        motion.current.position.y = Math.sin(t * 0.1) * 0.08;
    }
  });

  return (
    <group ref={motion} />
  );
}
