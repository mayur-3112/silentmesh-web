import { Float, Stars } from "@react-three/drei";
import RuntimeTopology from "./RuntimeTopology";
import RuntimeParticles from "./RuntimeParticles";
import RuntimeFog from "./RuntimeFog";
import RuntimeCore from "./RuntimeCore";
import RuntimeStateController from "./RuntimeStateController";
import RuntimeAtmosphere from "./RuntimeAtmosphere";
import RuntimeCameraDirector from "./RuntimeCameraDirector";
import RuntimeCursorField from "./RuntimeCursorField";
import RuntimeScrollDirector from "./RuntimeScrollDirector";
import RuntimeDepthTraversal from "./RuntimeDepthTraversal";

export default function RuntimeUniverse() {
  return (
    <>
      <RuntimeStateController />
      <RuntimeAtmosphere />
      
      <RuntimeCameraDirector />
      <RuntimeScrollDirector />
      <RuntimeDepthTraversal />
      
      <RuntimeCursorField />

      {/* distant sparse field */}
      <Stars
        radius={120}
        depth={60}
        count={500}
        factor={3}
        saturation={0}
        fade
        speed={0.1}
      />

      {/* single intentional topology layer */}
      <RuntimeTopology />

      {/* main volumetric fog */}
      <RuntimeFog />

      {/* elegant particle drift */}
      <RuntimeParticles />

      {/* single central core */}
      <Float
        speed={1.0}
        rotationIntensity={0.1}
        floatIntensity={0.3}
      >
        <RuntimeCore />
      </Float>

      {/* refined lighting */}
      <ambientLight intensity={0.2} />

      <pointLight
        position={[0, 0, 6]}
        intensity={5}
        color="#00c9a7"
      />

      <pointLight
        position={[3, -1, 3]}
        intensity={2}
        color="#66e3ff"
      />
    </>
  );
}
