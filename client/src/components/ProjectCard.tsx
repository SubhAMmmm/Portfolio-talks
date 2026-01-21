import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { useState, useEffect } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  delay?: number;
}

export function ProjectCard({ title, description, tags, link = "#" }: ProjectCardProps) {
  const [statusId, setStatusId] = useState("A1B2");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusId(Math.random().toString(16).slice(2, 6).toUpperCase());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full"
    >
      {/* Quantum Border Effect - Animated perimeter path */}
      <div className="absolute inset-0 rounded-2xl border border-primary/20 group-hover:border-primary/0 transition-colors duration-500 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent -translate-x-full group-hover:animate-quantum-line" />
        <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-primary to-transparent -translate-y-full group-hover:animate-quantum-line-v delay-300" />
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-transparent via-primary to-transparent translate-x-full group-hover:animate-quantum-line delay-500" />
        <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-t from-transparent via-primary to-transparent translate-y-full group-hover:animate-quantum-line-v delay-700" />
      </div>

      <div 
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="relative h-full bg-black/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col transition-all duration-500 overflow-hidden group-hover:bg-primary/5"
      >
        {/* Circuit Pattern Background - Digital vibe */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
          <svg width="100%" height="100%" className="text-primary">
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 10 10 L 90 10 L 90 90 L 10 90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="2" fill="currentColor" />
              <circle cx="90" cy="10" r="2" fill="currentColor" />
              <circle cx="90" cy="90" r="2" fill="currentColor" />
              <circle cx="10" cy="90" r="2" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        {/* Binary Rain Data Effect - Vertical data streams */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity flex justify-around">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
              className="text-[8px] font-mono text-primary flex flex-col"
            >
              {"10101010".split("").map((char, j) => <span key={j}>{char}</span>)}
            </motion.div>
          ))}
        </div>

        <div 
          style={{ transform: "translateZ(80px)" }}
          className="relative z-10 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-[1px] w-8 bg-primary/50" />
            <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-primary/70 uppercase">
              <span>SYSTEM_ACTIVE</span>
              <span className="opacity-30">//</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={statusId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                  className="text-primary"
                >
                  {statusId}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <h3 className="text-2xl font-display font-bold text-foreground group-hover:text-primary transition-colors tracking-tighter mb-2">{title}</h3>
          <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-foreground/80 transition-colors font-sans">{description}</p>
        </div>

        <div 
          style={{ transform: "translateZ(60px)" }}
          className="relative z-10 mt-auto"
        >
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] font-mono text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 group-hover:bg-primary/20 transition-all">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <a 
              href={link} 
              className="flex items-center gap-2 text-[11px] font-black font-mono text-primary group-hover:tracking-widest transition-all duration-300"
            >
              ACCESS_DATA_STREAM
              <ArrowUpRight className="w-3 h-3 group-hover:scale-125 transition-transform" />
            </a>
            
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-primary/20 group-hover:bg-primary animate-pulse" />
              <div className="w-1 h-3 bg-primary/20 group-hover:bg-primary animate-pulse delay-75" />
              <div className="w-1 h-3 bg-primary/20 group-hover:bg-primary animate-pulse delay-150" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
