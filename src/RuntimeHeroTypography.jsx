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
      className={`absolute left-[8vw] top-[18vh] max-w-[900px] ${!isVisible ? 'pointer-events-none' : ''}`}
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="mb-6 text-sm tracking-[0.45em] text-[#00c9a7]/70"
      >
        RUNTIME ORCHESTRATION ENVIRONMENT
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8 }}
        className="text-[7rem] font-black leading-[0.9] tracking-[-0.07em] text-white md:text-[10rem]"
      >
        Controlled
        <span className="block bg-gradient-to-r from-[#00c9a7] via-cyan-300 to-white bg-clip-text text-transparent">
          runtime
        </span>
        orchestration.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="mt-10 max-w-xl text-xl leading-relaxed text-white/45"
      >
        Linux-native runtime visibility and reversible mitigation
        designed for operational trust.
      </motion.p>
    </motion.div>
  );
}
