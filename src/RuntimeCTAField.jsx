import { motion } from "framer-motion";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeCTAField() {
  const zone = useRuntimeScroll((s) => s.zone);
  const isVisible = zone === "surface";

  return (
    <motion.div 
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-auto absolute bottom-[10vh] left-[8vw] flex items-center gap-6 ${!isVisible ? 'pointer-events-none' : ''}`}
    >
      <button 
        data-cursor="hover"
        className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-white/10 bg-white/[0.02] px-8 py-4 backdrop-blur-xl transition-all hover:border-[#00c9a7]/40 hover:bg-[#00c9a7]/10"
      >
        <span className="font-mono text-sm tracking-[0.2em] text-white">INITIALIZE DEMO</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00c9a7] text-black transition-transform group-hover:translate-x-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </button>

      <button 
        data-cursor="hover"
        className="font-mono text-sm tracking-[0.2em] text-white/40 transition hover:text-white"
      >
        READ WHITE PAPER
      </button>
    </motion.div>
  );
}
