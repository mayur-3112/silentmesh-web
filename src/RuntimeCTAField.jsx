import { motion } from "framer-motion";
import { useRuntimeScroll } from "./RuntimeScrollDirector";

export default function RuntimeCTAField() {
  const zone = useRuntimeScroll((s) => s.zone);
  const isVisible = zone === "surface";

  return (
    <motion.div 
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className={`pointer-events-auto absolute bottom-[10vh] left-[8vw] flex items-center gap-8 ${!isVisible ? 'pointer-events-none' : ''}`}
    >
      <motion.button
        whileHover={{
          scale: 1.04,
        }}
        whileTap={{
          scale: 0.98,
        }}
        className="group relative overflow-hidden rounded-full border border-[#00c9a7]/20 bg-[#00c9a7]/10 px-10 py-5 text-sm tracking-[0.2em] text-white backdrop-blur-2xl"
      >
        <span className="relative z-10">
          REQUEST EARLY ACCESS
        </span>

        <div className="absolute inset-0 bg-[#00c9a7]/10 opacity-0 transition duration-500 group-hover:opacity-100" />
      </motion.button>

      <div className="text-sm tracking-[0.2em] text-white/35">
        OPERATIONAL TRUST LAYER ACTIVE
      </div>
    </motion.div>
  );
}
