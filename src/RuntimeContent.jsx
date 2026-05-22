import { motion } from "framer-motion";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeContent() {
  const zone = useRuntimeScroll((s) => s.zone);

  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full">
      
      {/* OBSERVATION ZONE (0.2 - 0.4) */}
      <motion.div
        initial={false}
        animate={{ opacity: zone === "observation" ? 1 : 0, y: zone === "observation" ? 0 : 40 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className={`absolute right-[8vw] top-[30vh] max-w-[500px] text-right ${zone !== "observation" ? "pointer-events-none" : ""}`}
      >
        <p className="mb-4 text-xs font-semibold tracking-[0.3em] text-[#66e3ff]">
          PHASE 01 // OBSERVATION
        </p>
        <h2 className="mb-6 text-4xl font-light tracking-tight text-white md:text-5xl">
          Deep structural <br />
          <span className="font-semibold text-white">visibility.</span>
        </h2>
        <p className="text-lg leading-relaxed text-white/40">
          Silently monitor execution paths and memory boundaries across the entire infrastructure mesh without instrumenting the host. Every thread, rendered as telemetry.
        </p>
      </motion.div>

      {/* ORCHESTRATION ZONE (0.4 - 0.6) */}
      <motion.div
        initial={false}
        animate={{ opacity: zone === "orchestration" ? 1 : 0, y: zone === "orchestration" ? 0 : 40 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className={`absolute left-[8vw] top-[40vh] max-w-[500px] ${zone !== "orchestration" ? "pointer-events-none" : ""}`}
      >
        <p className="mb-4 text-xs font-semibold tracking-[0.3em] text-[#00c9a7]">
          PHASE 02 // ORCHESTRATION
        </p>
        <h2 className="mb-6 text-4xl font-light tracking-tight text-white md:text-5xl">
          Surgical <br />
          <span className="font-semibold text-white">intervention.</span>
        </h2>
        <p className="text-lg leading-relaxed text-white/40">
          Act instantaneously. Isolate, suspend, or mitigate malicious threads at the exact moment of execution. Operational control at the speed of the runtime.
        </p>
      </motion.div>

      {/* CONTAINMENT ZONE (0.6 - 0.8) */}
      <motion.div
        initial={false}
        animate={{ opacity: zone === "containment" ? 1 : 0, scale: zone === "containment" ? 1 : 0.95 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className={`absolute left-1/2 top-[50vh] w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 text-center ${zone !== "containment" ? "pointer-events-none" : ""}`}
      >
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
          <div className="h-2 w-2 rounded-full bg-red-500" />
        </div>
        <h2 className="mb-6 text-4xl font-light tracking-tight text-white md:text-6xl">
          Absolute <span className="font-semibold text-white">containment.</span>
        </h2>
        <p className="text-lg leading-relaxed text-white/40">
          Enforce cryptographic boundaries around compromised sub-systems. Zero lateral movement. Total trust.
        </p>
      </motion.div>

      {/* DEEP RUNTIME ZONE (0.8 - 1.0) */}
      <motion.div
        initial={false}
        animate={{ opacity: zone === "deep-runtime" ? 1 : 0, y: zone === "deep-runtime" ? 0 : 40 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className={`pointer-events-auto absolute bottom-[15vh] w-full text-center ${zone !== "deep-runtime" ? "pointer-events-none" : ""}`}
      >
        <h2 className="mb-8 text-3xl font-light tracking-widest text-white md:text-4xl">
          THE INFRASTRUCTURE REVOLUTION
        </h2>
        <button className="group relative inline-flex overflow-hidden rounded-full border border-[#00c9a7]/40 bg-[#00c9a7]/10 px-12 py-6 text-sm tracking-[0.2em] text-white transition hover:bg-[#00c9a7]/20">
          <span className="relative z-10 font-medium">DEPLOY SILENTMESH TODAY</span>
        </button>
      </motion.div>

    </div>
  );
}
