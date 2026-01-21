import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    const t = setTimeout(() => {
      setLoading(false);
      onComplete?.();
    }, 3000);

    return () => {
      clearTimeout(t);
      clearInterval(progressInterval);
    };
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-300, 300], [10, -10]);
  const rotateY = useTransform(mx, [-300, 300], [-10, 10]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] bg-[#030303] overflow-hidden flex items-center justify-center"
          onMouseMove={(e) => {
            mx.set(e.clientX - window.innerWidth / 2);
            my.set(e.clientY - window.innerHeight / 2);
          }}
        >
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 183, 0, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 183, 0, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          {/* Floating Orbs */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                background:
                  i % 2 === 0
                    ? "radial-gradient(circle, rgba(255,183,0,0.15) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
                width: `${200 + i * 50}px`,
                height: `${200 + i * 50}px`,
              }}
              animate={{
                x: [0, 100, -50, 0],
                y: [0, -80, 60, 0],
                scale: [1, 1.2, 0.9, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Main Content */}
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0, rotateZ: -180 }}
              animate={{ scale: 1, rotateZ: 0 }}
              transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-12"
            >
              <motion.div
                animate={{
                  rotateZ: 360,
                  boxShadow: [
                    "0 0 20px rgba(255,183,0,0.3)",
                    "0 0 40px rgba(16,185,129,0.5)",
                    "0 0 20px rgba(255,183,0,0.3)",
                  ],
                }}
                transition={{
                  rotateZ: { duration: 3, repeat: Infinity, ease: "linear" },
                  boxShadow: { duration: 2, repeat: Infinity },
                }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FFB700] via-emerald-500 to-cyan-400 flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-xl bg-[#030303]/80 backdrop-blur-sm" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-[#FFB700] via-emerald-400 to-cyan-400 bg-clip-text text-transparent"
            >
              PORTFOLIO
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-emerald-100/40 text-sm tracking-[0.3em] uppercase mb-12 font-light"
            >
              Loading Experience
            </motion.p>

            {/* Progress Bar */}
            <div className="w-80 max-w-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="relative"
              >
                {/* Bar Background */}
                <div className="h-1 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                  {/* Progress Fill */}
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    className="h-full bg-gradient-to-r from-[#FFB700] via-emerald-500 to-cyan-400 rounded-full relative"
                  >
                    {/* Glow Effect */}
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>

                {/* Percentage */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-4 text-center text-[#FFB700]/80 text-sm font-mono"
                >
                  {Math.min(Math.round(progress), 100)}%
                </motion.div>
              </motion.div>
            </div>

            {/* Status Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8 flex items-center gap-2 text-emerald-100/40 text-xs"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 border-2 border-[#FFB700]/60 border-t-transparent rounded-full"
              />
              <span>Initializing system...</span>
            </motion.div>
          </motion.div>

          {/* Corner Accents */}
          {[
            { top: "20px", left: "20px", rotate: 0 },
            { top: "20px", right: "20px", rotate: 90 },
            { bottom: "20px", left: "20px", rotate: -90 },
            { bottom: "20px", right: "20px", rotate: 180 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="absolute w-12 h-12"
              style={pos}
            >
              <div
                className="w-full h-full border-t-2 border-l-2 border-[#FFB700]/30"
                style={{ transform: `rotate(${pos.rotate}deg)` }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
