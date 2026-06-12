import { motion } from "framer-motion";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function RuntimeHeroTypography() {
  const zone = useRuntimeScroll((s) => s.zone);
  const isVisible = zone === "surface";

  return (
    <motion.div 
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -40 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="absolute left-6 top-[16vh] max-w-[900px] px-2 md:left-[8vw] md:top-[18vh] md:px-0 pointer-events-none"
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="mb-4 text-[10px] tracking-[0.35em] text-[#00c9a7]/40 md:mb-6 md:text-sm md:tracking-[0.45em]"
      >
        RUNTIME ORCHESTRATION ENVIRONMENT
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8 }}
        className="text-[2.2rem] font-black leading-[0.9] tracking-[-0.05em] text-white/80 sm:text-[3.8rem] md:text-[5.5rem] lg:text-[7.5rem] md:tracking-[-0.07em]"
      >
        Controlled
        <span className="block bg-gradient-to-r from-[#00c9a7]/80 via-cyan-300/60 to-white/50 bg-clip-text text-transparent">
          runtime
        </span>
        orchestration.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="mt-4 max-w-md text-sm leading-relaxed text-white/30 md:mt-6 md:max-w-xl md:text-lg"
      >
        Linux-native runtime visibility and reversible mitigation
        designed for operational trust.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.7 }}
        className="pointer-events-auto mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6"
      >
        <button 
          data-cursor="hover"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/[0.02] px-6 py-3 backdrop-blur-xl transition-all hover:border-[#00c9a7]/40 hover:bg-[#00c9a7]/10 md:gap-4 md:px-8 md:py-4"
          onClick={() => scrollTo("poc-form")}
        >
          <span className="font-mono text-xs tracking-[0.15em] text-white md:text-sm md:tracking-[0.2em]">INITIALIZE DEMO</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00c9a7] text-black transition-transform group-hover:translate-x-1 md:h-8 md:w-8">
            <svg className="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </button>

        <button 
          data-cursor="hover"
          className="font-mono text-xs tracking-[0.15em] text-white/40 transition hover:text-white md:text-sm md:tracking-[0.2em]"
          onClick={() => scrollTo("architecture")}
        >
          READ WHITE PAPER
        </button>
      </motion.div>
    </motion.div>
  );
}
