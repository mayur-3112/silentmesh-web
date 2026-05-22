import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function RuntimeGPUProfiler() {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    console.log(
      gl.info.render
    );

    console.log(
      gl.info.memory
    );
  }, []);

  return null;
}
