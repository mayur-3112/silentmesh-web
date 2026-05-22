import { Float, Stars } from "@react-three/drei";
import RuntimeTopology from "./RuntimeTopology";
import RuntimeParticles from "./RuntimeParticles";
import RuntimeFog from "./RuntimeFog";
import RuntimeCore from "./RuntimeCore";
import RuntimeSignals from "./RuntimeSignals";
import RuntimeContainment from "./RuntimeContainment";
import RuntimeStateController from "./RuntimeStateController";
import RuntimeAtmosphere from "./RuntimeAtmosphere";
import RuntimeCameraDirector from "./RuntimeCameraDirector";
import RuntimeParallaxField from "./RuntimeParallaxField";
import RuntimeConstellations from "./RuntimeConstellations";
import RuntimeDepthFog from "./RuntimeDepthFog";
import RuntimeCursorField from "./RuntimeCursorField";
import RuntimeInteractionField from "./RuntimeInteractionField";
import RuntimePropagationPulse from "./RuntimePropagationPulse";
import RuntimeAwarenessSystem from "./RuntimeAwarenessSystem";
import RuntimeMagneticNodes from "./RuntimeMagneticNodes";
import RuntimeWorldComposer from "./RuntimeWorldComposer";
import RuntimeShaderComposer from "./RuntimeShaderComposer";
import RuntimeEventDirector from "./RuntimeEventDirector";
import RuntimeWakeSequence from "./RuntimeWakeSequence";
import RuntimeContainmentEvent from "./RuntimeContainmentEvent";
import RuntimeRollbackSequence from "./RuntimeRollbackSequence";
import RuntimeStormSequence from "./RuntimeStormSequence";
import RuntimeScrollDirector from "./RuntimeScrollDirector";
import RuntimeDepthTraversal from "./RuntimeDepthTraversal";
import RuntimeEnvironmentalShift from "./RuntimeEnvironmentalShift";
import RuntimeScaleEscalation from "./RuntimeScaleEscalation";
import RuntimeFocusDirector from "./RuntimeFocusDirector";
import RuntimeAudioEngine from "./RuntimeAudioEngine";
import RuntimeBassPulse from "./RuntimeBassPulse";
import RuntimeFrequencyField from "./RuntimeFrequencyField";
import RuntimeResonanceLayer from "./RuntimeResonanceLayer";
import RuntimeAudioReactiveFog from "./RuntimeAudioReactiveFog";
import RuntimeTransitionOrchestrator from "./RuntimeTransitionOrchestrator";
import RuntimeMicroMotion from "./RuntimeMicroMotion";
import RuntimePresenceLayer from "./RuntimePresenceLayer";
import RuntimeGlowHarmonics from "./RuntimeGlowHarmonics";
import RuntimeAttentionDirector from "./RuntimeAttentionDirector";

export default function RuntimeUniverse() {
  return (
    <>
      <RuntimeStateController />
      <RuntimeAtmosphere />
      
      <RuntimeCameraDirector />
      <RuntimeParallaxField />
      <RuntimeConstellations />
      <RuntimeDepthFog />

      <RuntimeCursorField />
      <RuntimeInteractionField />
      <RuntimePropagationPulse />
      <RuntimeAwarenessSystem />
      <RuntimeMagneticNodes />

      <RuntimeWorldComposer />
      <RuntimeShaderComposer />

      <RuntimeEventDirector />
      <RuntimeWakeSequence />
      <RuntimeContainmentEvent />
      <RuntimeRollbackSequence />
      <RuntimeStormSequence />

      <RuntimeScrollDirector />
      <RuntimeDepthTraversal />
      <RuntimeEnvironmentalShift />
      <RuntimeScaleEscalation />
      <RuntimeFocusDirector />

      <RuntimeAudioEngine />
      <RuntimeBassPulse />
      <RuntimeFrequencyField />
      <RuntimeResonanceLayer />
      <RuntimeAudioReactiveFog />

      <RuntimeTransitionOrchestrator />
      <RuntimeMicroMotion />
      <RuntimePresenceLayer />
      <RuntimeGlowHarmonics />
      <RuntimeAttentionDirector />

      {/* distant infrastructure field */}
      <Stars
        radius={120}
        depth={60}
        count={1800}
        factor={4}
        saturation={0}
        fade
        speed={0.15}
      />

      {/* ambient topology systems */}
      <RuntimeTopology />

      {/* atmospheric runtime fog */}
      <RuntimeFog />

      {/* orchestration particles */}
      <RuntimeParticles />

      {/* orchestration core */}
      <Float
        speed={1.5}
        rotationIntensity={0.2}
        floatIntensity={0.6}
      >
        <RuntimeCore />
      </Float>

      {/* propagation behavior */}
      <RuntimeSignals />

      {/* scoped containment geometry */}
      <RuntimeContainment />

      {/* cinematic lighting */}
      <ambientLight intensity={0.4} />

      <pointLight
        position={[0, 0, 6]}
        intensity={8}
        color="#00c9a7"
      />

      <pointLight
        position={[4, -2, 4]}
        intensity={3}
        color="#66e3ff"
      />
    </>
  );
}
