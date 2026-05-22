import { motion } from "framer-motion";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeContent() {
  const zone = useRuntimeScroll((s) => s.zone);

  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full font-sans">
      
      {/* OBSERVATION ZONE (0.2 - 0.4) */}
      <motion.div
        initial={false}
        animate={{ opacity: zone === "observation" ? 1 : 0, x: zone === "observation" ? 0 : 40 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute right-[8vw] top-[25vh] max-w-[550px] ${zone !== "observation" ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        <div className="rounded-2xl border border-white/5 bg-[#05070b]/40 p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
            <p className="font-mono text-xs tracking-[0.3em] text-[#00c9a7]">
              [ PHASE 01 ]
            </p>
            <p className="font-mono text-xs tracking-widest text-white/30">
              OBSERVATION
            </p>
          </div>
          
          <h2 className="mb-4 text-3xl font-light tracking-tight text-white md:text-5xl">
            Deep structural <br />
            <span className="font-medium text-white">visibility.</span>
          </h2>
          
          <p className="mb-8 text-base leading-relaxed text-white/40">
            Silently monitor execution paths and memory boundaries across the entire infrastructure mesh without instrumenting the host. Every thread, rendered as telemetry.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/30">Latency</p>
              <p className="font-mono text-lg text-white">0.27ms</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/30">Overhead</p>
              <p className="font-mono text-lg text-white">&lt; 1%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ORCHESTRATION ZONE (0.4 - 0.6) */}
      <motion.div
        initial={false}
        animate={{ opacity: zone === "orchestration" ? 1 : 0, x: zone === "orchestration" ? 0 : -40 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute left-[8vw] top-[30vh] max-w-[550px] ${zone !== "orchestration" ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#05070b]/40 p-8 backdrop-blur-xl shadow-2xl">
          {/* Subtle accent glow */}
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#00c9a7]/10 blur-[50px]" />
          
          <div className="relative z-10 mb-6 flex items-center justify-between border-b border-white/5 pb-4">
            <p className="font-mono text-xs tracking-[0.3em] text-[#00c9a7]">
              [ PHASE 02 ]
            </p>
            <p className="font-mono text-xs tracking-widest text-white/30">
              ORCHESTRATION
            </p>
          </div>
          
          <h2 className="relative z-10 mb-4 text-3xl font-light tracking-tight text-white md:text-5xl">
            Surgical <br />
            <span className="font-medium text-white">intervention.</span>
          </h2>
          
          <p className="relative z-10 text-base leading-relaxed text-white/40">
            Act instantaneously. Isolate, suspend, or mitigate malicious threads at the exact moment of execution. Operational control at the speed of the runtime.
          </p>

          <ul className="relative z-10 mt-8 space-y-3">
            {[
              "eBPF-driven state enforcement",
              "Zero lateral movement guarantees",
              "Automated threat rollback"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 font-mono text-sm text-white/60">
                <div className="h-1 w-1 rounded-full bg-[#00c9a7]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* CONTAINMENT ZONE (0.6 - 0.8) */}
      <motion.div
        initial={false}
        animate={{ opacity: zone === "containment" ? 1 : 0, scale: zone === "containment" ? 1 : 0.95 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute left-1/2 top-[50vh] w-full max-w-[700px] -translate-x-1/2 -translate-y-1/2 text-center ${zone !== "containment" ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-[#05070b]/60 backdrop-blur-xl">
          <div className="absolute inset-0 animate-ping rounded-full border border-red-500/20 opacity-75" />
          <div className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
        </div>
        
        <h2 className="mb-6 text-5xl font-light tracking-tight text-white md:text-7xl">
          Absolute <br />
          <span className="font-bold text-white">containment.</span>
        </h2>
        
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-white/40">
          Enforce cryptographic boundaries around compromised sub-systems. Attack surfaces are dynamically severed before the breach can propagate.
        </p>

        <div className="mt-10 flex justify-center gap-6 font-mono text-sm">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/30">THREAT STATUS</span>
            <span className="text-red-500">ISOLATED</span>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/30">SYSTEM INTEGRITY</span>
            <span className="text-[#00c9a7]">SECURED</span>
          </div>
        </div>
      </motion.div>

      {/* DEEP RUNTIME ZONE (0.8 - 1.0) */}
      <motion.div
        initial={false}
        animate={{ opacity: zone === "deep-runtime" ? 1 : 0, y: zone === "deep-runtime" ? 0 : 40 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute bottom-[15vh] w-full text-center ${zone !== "deep-runtime" ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        <p className="mb-4 font-mono text-sm tracking-[0.4em] text-[#00c9a7]">
          [ END OF DEMONSTRATION ]
        </p>
        <h2 className="mb-10 text-4xl font-light tracking-tight text-white md:text-6xl">
          The infrastructure <span className="font-semibold text-white">revolution.</span>
        </h2>
        
        <button 
          data-cursor="hover"
          className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-white/10 bg-white/[0.02] px-8 py-4 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.05]"
        >
          <span className="font-mono text-sm tracking-[0.2em] text-white">DEPLOY SILENTMESH</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00c9a7] text-black transition-transform group-hover:translate-x-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </button>
      </motion.div>

    </div>
  );
}
