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
import RuntimeSections from "./RuntimeSections";

export default function App() {
  const [booted, setBooted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    preloadRuntimeAssets();
    
    const lenis = new Lenis({
      duration: mobile ? 1.0 : 1.2,
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
        {/* runtime world — fixed 3D background */}
        <div className="fixed inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 12], fov: isMobile ? 55 : 45 }}
            dpr={isMobile ? [1, 1] : [1, 1.5]}
            gl={{ powerPreference: isMobile ? "default" : "high-performance", antialias: false }}
          >
            <color attach="background" args={["#05070b"]} />
            <fog attach="fog" args={["#05070b", 6, 22]} />

            <Suspense fallback={null}>
              {booted && <RuntimeUniverse />}
            </Suspense>

            {booted && !isMobile && <RuntimeLensEffects />}
          </Canvas>
        </div>

        {/* overlay ui — fixed cinematic HUD */}
        {booted && (
          <div className="fixed inset-0 z-10 pointer-events-none">
            <RuntimeInterfaceLayer />
            <RuntimeTelemetryBridge />
          </div>
        )}

        {/* cinematic scroll space */}
        <div className="h-[500vh]" />

        {/* gradient bridge — smooth fade from 3D to content */}
        <div className="relative z-20">
          <div className="h-[30vh] bg-gradient-to-b from-transparent via-[#05070b]/70 to-[#05070b]" />
          <RuntimeSections />
        </div>
      </main>
    </>
  );
}
