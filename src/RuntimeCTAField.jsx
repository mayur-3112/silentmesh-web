import { motion } from "framer-motion";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function RuntimeCTAField() {
  const zone = useRuntimeScroll((s) => s.zone);
  const isVisible = zone === "surface";

  return (
    <motion.div 
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-auto absolute bottom-[3.5vh] left-6 flex flex-col items-start gap-3 md:bottom-[5.5vh] md:left-[8vw] md:flex-row md:items-center md:gap-6 ${!isVisible ? 'pointer-events-none' : ''}`}
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
  );
}
