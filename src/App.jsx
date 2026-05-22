import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { ScrollControls } from "@react-three/drei";
import RuntimeLensEffects from "./RuntimeLensEffects";
import RuntimeUniverse from "./RuntimeUniverse";
import RuntimeInterfaceLayer from "./RuntimeInterfaceLayer";
import RuntimeBootLoader from "./RuntimeBootLoader";
import RuntimeTelemetryBridge from "./RuntimeTelemetryBridge";
import { preloadRuntimeAssets } from "./RuntimeAssetStreaming";

export default function App() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    preloadRuntimeAssets();
  }, []);

  return (
    <>
      {!booted && <RuntimeBootLoader onComplete={() => setBooted(true)} />}
      
      <div className="app" style={{ width: '100vw', height: '100vh', background: '#05070b', position: 'relative', overflow: 'hidden' }}>
        <Canvas
          camera={{
            position: [0, 0, 12],
            fov: 45,
          }}
          dpr={[1, 1.5]}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <color attach="background" args={["#05070b"]} />
          <fog attach="fog" args={["#05070b", 8, 28]} />

          <ScrollControls pages={5} damping={0.18}>
            <Suspense fallback={null}>
              {booted && <RuntimeUniverse />}
            </Suspense>
          </ScrollControls>

          {booted && <RuntimeLensEffects />}
        </Canvas>
        
        {booted && <RuntimeInterfaceLayer />}
        {booted && <RuntimeTelemetryBridge />}
      </div>
    </>
  );
}
