import { motion } from "framer-motion";

export default function RuntimeTypographyDynamics({
  children,
}) {
  return (
    <motion.div
      animate={{
        y: [0, -2, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
