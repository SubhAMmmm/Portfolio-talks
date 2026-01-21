import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealAnimationProps {
  children: ReactNode;
  delay?: number;
  width?: "fit-content" | "100%";
  type?: "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "fade" | "scaleUp" | "rotateIn";
}

export const RevealAnimation = ({ children, delay = 0, width = "100%", type = "slideUp" }: RevealAnimationProps) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: type === "slideUp" ? 100 : type === "slideDown" ? -100 : 0,
      x: type === "slideLeft" ? 100 : type === "slideRight" ? -100 : 0,
      scale: type === "scaleUp" ? 0.8 : 1,
      rotate: type === "rotateIn" ? -5 : 0,
      filter: "blur(10px)" 
    },
    show: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)" 
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
      variants={variants}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // snappy cubic-bezier
      }}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, staggerDelay = 0.1, delay = 0 }: { children: ReactNode; staggerDelay?: number; delay?: number }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(4px)" },
        show: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
};
