import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import Lenis from "lenis";

import RuntimeLensEffects from "./RuntimeLensEffects";
import RuntimeUniverse from "./RuntimeUniverse";
import RuntimeInterfaceLayer from "./RuntimeInterfaceLayer";
import RuntimeBootLoader from "./RuntimeBootLoader";
import RuntimeTelemetryBridge from "./RuntimeTelemetryBridge";
import { preloadRuntimeAssets } from "./RuntimeAssetStreaming";
import RuntimeCustomCursor from "./RuntimeCustomCursor";

export default function App() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    preloadRuntimeAssets();
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {!booted && <RuntimeBootLoader onComplete={() => setBooted(true)} />}
      <RuntimeCustomCursor />
      
      <main className="relative bg-[#05070b]">
        {/* runtime world */}
        <div className="fixed inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 12], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ powerPreference: "high-performance", antialias: false }}
          >
            <color attach="background" args={["#05070b"]} />
            <fog attach="fog" args={["#05070b", 8, 28]} />

            <Suspense fallback={null}>
              {booted && <RuntimeUniverse />}
            </Suspense>

            {booted && <RuntimeLensEffects />}
          </Canvas>
        </div>

        {/* overlay ui */}
        {booted && (
          <div className="fixed inset-0 z-10 pointer-events-none">
            <RuntimeInterfaceLayer />
            <RuntimeTelemetryBridge />
          </div>
        )}

        {/* scroll space */}
        <div className="h-[500vh]" />
      </main>
    </>
  );
}
