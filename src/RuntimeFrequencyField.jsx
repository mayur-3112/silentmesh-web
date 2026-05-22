import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useRuntimeAudio } from "./RuntimeAudioStore";

export default function RuntimeFrequencyField() {
  const field = useRef();
  const intensity = useRuntimeAudio((s) => s.intensity);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (field.current) {
        field.current.rotation.z = Math.sin(t * intensity) * 0.04;
    }
  });

  return (
    <mesh ref={field} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[18, 18.05, 300]} />
      <meshBasicMaterial
        color="#66e3ff"
        transparent
        opacity={0.03}
      />
    </mesh>
  );
}
