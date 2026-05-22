import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function RuntimeBootLoader({ onComplete }) {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooted(true);
      if (onComplete) onComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{
        opacity: booted ? 0 : 1,
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020408]"
    >
      <div className="text-center">
        <p className="mb-6 text-sm tracking-[0.4em] text-[#00c9a7]/70">
          INITIALIZING ORCHESTRATION LAYER
        </p>

        <div className="h-[1px] w-[240px] overflow-hidden bg-white/10 mx-auto">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2.8,
              ease: "easeInOut",
            }}
            className="h-full w-full bg-[#00c9a7]"
          />
        </div>
      </div>
    </motion.div>
  );
}
