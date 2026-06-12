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
        className="absolute left-4 right-4 top-[20vh] mx-auto max-w-[550px] md:left-auto md:right-[8vw] md:top-[25vh] md:mx-0 pointer-events-none"
      >
        <div className="rounded-2xl border border-white/5 bg-[#05070b]/60 p-5 shadow-2xl backdrop-blur-xl md:bg-[#05070b]/40 md:p-8">
          <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3 md:mb-6 md:pb-4">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#00c9a7] md:text-xs md:tracking-[0.3em]">
              [ PHASE 01 ]
            </p>
            <p className="font-mono text-[10px] tracking-widest text-white/30 md:text-xs">
              OBSERVATION
            </p>
          </div>
          
          <h2 className="mb-3 text-2xl font-light tracking-tight text-white/85 md:mb-4 md:text-5xl">
            Deep structural <br />
            <span className="font-medium text-white/90">visibility.</span>
          </h2>
          
          <p className="mb-6 text-sm leading-relaxed text-white/40 md:mb-8 md:text-base">
            Silently monitor execution paths and memory boundaries across the entire infrastructure mesh without instrumenting the host.
          </p>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04] md:p-4">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-white/30 md:text-[10px]">Latency</p>
              <p className="font-mono text-base text-white md:text-lg">0.27ms</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04] md:p-4">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-white/30 md:text-[10px]">Overhead</p>
              <p className="font-mono text-base text-white md:text-lg">&lt; 1%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ORCHESTRATION ZONE (0.4 - 0.6) */}
      <motion.div
        initial={false}
        animate={{ opacity: zone === "orchestration" ? 1 : 0, x: zone === "orchestration" ? 0 : -40 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-4 right-4 top-[22vh] mx-auto max-w-[550px] md:left-[8vw] md:right-auto md:top-[30vh] md:mx-0 pointer-events-none"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#05070b]/60 p-5 shadow-2xl backdrop-blur-xl md:bg-[#05070b]/40 md:p-8">
          {/* Subtle accent glow */}
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#00c9a7]/10 blur-[50px]" />
          
          <div className="relative z-10 mb-4 flex items-center justify-between border-b border-white/5 pb-3 md:mb-6 md:pb-4">
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#00c9a7] md:text-xs md:tracking-[0.3em]">
              [ PHASE 02 ]
            </p>
            <p className="font-mono text-[10px] tracking-widest text-white/30 md:text-xs">
              ORCHESTRATION
            </p>
          </div>
          
          <h2 className="relative z-10 mb-3 text-2xl font-light tracking-tight text-white/85 md:mb-4 md:text-5xl">
            Surgical <br />
            <span className="font-medium text-white/90">intervention.</span>
          </h2>
          
          <p className="relative z-10 text-sm leading-relaxed text-white/40 md:text-base">
            Act instantaneously. Isolate, suspend, or mitigate malicious threads at the exact moment of execution.
          </p>

          <ul className="relative z-10 mt-5 space-y-2.5 md:mt-8 md:space-y-3">
            {[
              "eBPF-driven state enforcement",
              "Zero lateral movement guarantees",
              "Automated threat rollback"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 font-mono text-xs text-white/60 md:text-sm">
                <div className="h-1 w-1 flex-shrink-0 rounded-full bg-[#00c9a7]" />
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
        className="absolute left-4 right-4 top-[50vh] mx-auto w-auto max-w-[700px] -translate-y-1/2 text-center md:left-1/2 md:right-auto md:w-full md:-translate-x-1/2 pointer-events-none"
      >
        <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-[#05070b]/60 backdrop-blur-xl md:mb-8 md:h-20 md:w-20">
          <div className="absolute inset-0 animate-ping rounded-full border border-red-500/20 opacity-75" />
          <div className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] md:h-3 md:w-3" />
        </div>
        
        <h2 className="mb-4 text-3xl font-light tracking-tight text-white/85 md:mb-6 md:text-7xl">
          Absolute <br />
          <span className="font-bold text-white/90">containment.</span>
        </h2>
        
        <p className="mx-auto max-w-md px-4 text-sm leading-relaxed text-white/40 md:max-w-xl md:px-0 md:text-lg">
          Enforce cryptographic boundaries around compromised sub-systems. Attack surfaces are dynamically severed before the breach can propagate.
        </p>

        <div className="mt-6 flex justify-center gap-6 font-mono text-xs md:mt-10 md:text-sm">
          <div className="flex flex-col items-center gap-1.5 md:gap-2">
            <span className="text-white/30">THREAT STATUS</span>
            <span className="text-red-500">ISOLATED</span>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex flex-col items-center gap-1.5 md:gap-2">
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
        className="absolute left-0 right-0 bottom-[12vh] w-full px-6 text-center md:bottom-[15vh] md:px-0 pointer-events-none"
      >
        <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-[#00c9a7] md:mb-4 md:text-sm md:tracking-[0.4em]">
          [ CONTINUE BELOW ]
        </p>
        <h2 className="mb-6 text-2xl font-light tracking-tight text-white md:mb-10 md:text-6xl">
          The infrastructure <br className="md:hidden" /><span className="font-semibold text-white">revolution.</span>
        </h2>
        
        <button 
          data-cursor="hover"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/[0.02] px-6 py-3 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.05] md:gap-4 md:px-8 md:py-4 pointer-events-auto"
          onClick={() => { const el = document.getElementById("orchestration"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
        >
          <span className="font-mono text-xs tracking-[0.15em] text-white md:text-sm md:tracking-[0.2em]">DEPLOY SILENTMESH</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00c9a7] text-black transition-transform group-hover:translate-x-1 md:h-8 md:w-8">
            <svg className="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>
      </motion.div>

    </div>
  );
}
