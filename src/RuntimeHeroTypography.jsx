import { motion } from "framer-motion";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeHeroTypography() {
  const zone = useRuntimeScroll((s) => s.zone);
  const isVisible = zone === "surface";

  return (
    <motion.div 
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -40 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className={`absolute left-6 top-[16vh] max-w-[900px] px-2 md:left-[8vw] md:top-[18vh] md:px-0 ${!isVisible ? 'pointer-events-none' : ''}`}
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
        className="text-[3.2rem] font-black leading-[0.9] tracking-[-0.05em] text-white/80 sm:text-[5rem] md:text-[7rem] lg:text-[10rem] md:tracking-[-0.07em]"
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
        className="mt-6 max-w-md text-base leading-relaxed text-white/30 md:mt-10 md:max-w-xl md:text-xl"
      >
        Linux-native runtime visibility and reversible mitigation
        designed for operational trust.
      </motion.p>
    </motion.div>
  );
}
