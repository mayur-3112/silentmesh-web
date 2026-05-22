import { Tube } from "@react-three/drei";
import * as THREE from "three";

export default function RuntimeSignalRiver() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-40, -10, -20),
    new THREE.Vector3(-10, 6, -10),
    new THREE.Vector3(10, -6, -5),
    new THREE.Vector3(40, 12, -25),
  ]);

  return (
    <Tube
      args={[curve, 400, 0.04, 12, false]}
    >
      <meshBasicMaterial
        color="#00c9a7"
        transparent
        opacity={0.18}
      />
    </Tube>
  );
}
