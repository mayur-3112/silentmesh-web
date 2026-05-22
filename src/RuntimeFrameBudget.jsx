import { useFrame } from "@react-three/fiber";

let accumulator = 0;

export default function RuntimeFrameBudget(
  callback,
  fps = 30
) {
  useFrame((state, delta) => {
    accumulator += delta;

    if (accumulator >= 1 / fps) {
      callback(state);

      accumulator = 0;
    }
  });

  return null;
}
