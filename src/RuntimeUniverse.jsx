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
import RuntimeContainmentPulse from "./RuntimeContainmentPulse";

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
        count={400}
        factor={2.5}
        saturation={0}
        fade
        speed={0.08}
      />

      {/* topology ecosystems */}
      <RuntimeTopology />

      {/* main volumetric fog */}
      <RuntimeFog />

      {/* elegant particle drift */}
      <RuntimeParticles />

      {/* single central core — shapes the world */}
      <Float
        speed={0.8}
        rotationIntensity={0.08}
        floatIntensity={0.2}
      >
        <RuntimeCore />
      </Float>

      {/* THE SIGNATURE MOMENT — containment shockwave */}
      <RuntimeContainmentPulse />

      {/* refined lighting — reduced for more mystery */}
      <ambientLight intensity={0.12} />

      <pointLight
        position={[3, -1, 3]}
        intensity={1.5}
        color="#66e3ff"
      />
    </>
  );
}
