import { motion, AnimatePresence } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { useState } from "react";

interface SkillCardProps {
  title: string;
  skills: string[];
  icon: LucideIcon;
  delay?: number;
}

const SKILL_DETAILS: Record<string, string> = {
  // AI & GenAI
  LLMs: "Large Language Model expertise including GPT-4, Claude, and Llama architectures.",
  "RAG Pipelines":
    "Retrieval Augmented Generation for grounding AI in private data.",
  LangChain: "Orchestrating complex LLM workflows and agentic behaviors.",
  "OpenAI API": "Integration of cutting-edge vision, speech, and text models.",
  "Hugging Face":
    "Deployment and fine-tuning of open-source transformer models.",
  "Prompt Engineering":
    "Advanced techniques for reliable and structured AI outputs.",
  "Vector DBs": "High-performance semantic search using Pinecone and Chroma.",

  // Backend
  Python: "Primary language for AI research and backend scalability.",
  FastAPI: "Building high-performance, type-safe asynchronous APIs.",
  "Node.js": "Scalable server-side JavaScript for real-time applications.",
  PostgreSQL: "Robust relational data modeling and complex querying.",
  MongoDB: "Flexible document storage for unstructured data.",
  SQLAlchemy: "Advanced Python ORM for database abstraction.",
  Redis: "Ultra-fast caching and real-time message brokering.",

  // Cloud
  Azure: "Enterprise cloud infrastructure and cognitive services.",
  Docker: "Containerization for consistent deployment environments.",
  Kubernetes: "Orchestration for scalable microservices.",
  "CI/CD": "Automated testing and deployment pipelines.",
  Linux: "System administration and high-performance server tuning.",
  Git: "Expert version control and collaborative workflow.",
  Nginx: "High-performance reverse proxy and load balancing.",

  // Frontend
  React: "Building interactive and reactive user interfaces.",
  TypeScript: "Type-safe development for large-scale applications.",
  "Tailwind CSS": "Modern utility-first styling and responsive design.",
  "Next.js": "Full-stack React framework with SSR and static generation.",
  "Framer Motion": "Complex animations and smooth micro-interactions.",
  "Three.js": "Immersive 3D graphics and web-based rendering.",

  // Analytics
  Pandas: "Expert data manipulation and analysis library.",
  NumPy: "High-performance scientific computing and array operations.",
  "Scikit-learn": "Classical machine learning algorithms and preprocessing.",
  Matplotlib: "Advanced data visualization and plotting.",
  "Data Visualization": "Communicating insights through interactive charts.",
  "Statistical Analysis": "Rigorous data modeling and hypothesis testing.",
};

export function SkillCard({ title, skills, icon: Icon }: SkillCardProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative h-full"
    >
      {/* Corner Brackets - Top Left */}
      <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary/60 z-20" />
      <div className="absolute -top-1 -left-1 w-4 h-4 bg-primary/20" />

      {/* Corner Brackets - Top Right */}
      <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-primary/60 z-20" />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary/20" />

      {/* Corner Brackets - Bottom Left */}
      <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-cyan-400/60 z-20" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-cyan-400/20" />

      {/* Corner Brackets - Bottom Right */}
      <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-cyan-400/60 z-20" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-400/20" />

      {/* Dynamic Glow Aura */}
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-cyan-500/20 to-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />

      <div className="relative h-full bg-gradient-to-br from-zinc-950/95 via-black/95 to-zinc-950/95 border-2 border-primary/20 p-6 overflow-hidden group-hover:border-primary/60 group-hover:shadow-[0_0_30px_rgba(255,183,0,0.3),inset_0_0_30px_rgba(255,183,0,0.05)] transition-all duration-500"
        style={{
          clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))"
        }}>

        {/* Hexagonal Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
          <svg width="100%" height="100%">
            <pattern
              id={`hex-grid-${title}`}
              x="0"
              y="0"
              width="50"
              height="43.3"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M25 0 L50 12.5 L50 37.5 L25 50 L0 37.5 L0 12.5 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary"
              />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#hex-grid-${title})`} />
          </svg>
        </div>

        {/* Technical Panel Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Horizontal tech lines */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

          {/* Vertical accent lines */}
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />
        </div>

        {/* Data Stream Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-3 bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-60"
              style={{
                left: `${20 + i * 15}%`,
              }}
              animate={{
                y: ["-10%", "110%"],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Scanning Beam */}
        <motion.div
          animate={{ top: ["-5%", "105%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10 opacity-0 group-hover:opacity-100 shadow-[0_0_8px_rgba(255,183,0,0.6)]"
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            {/* Icon Panel */}
            <div className="relative">
              {/* Icon Container - Robotic Panel Style */}
              <div className="relative p-4 bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/40 group-hover:border-primary group-hover:bg-primary/20 transition-all duration-500"
                style={{
                  clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
                }}>

                {/* Corner Tech Details */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary" />

                <Icon className="w-7 h-7 text-primary group-hover:text-white group-hover:scale-110 transition-all relative z-10" />

                {/* Rotating Tech Ring */}
                <motion.div
                  className="absolute inset-0 border border-primary/30"
                  style={{
                    clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Power Indicator Light */}
              <motion.div
                className="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-500 rounded-sm"
                animate={{
                  boxShadow: [
                    "0 0 4px rgba(16,185,129,0.5)",
                    "0 0 12px rgba(16,185,129,1)",
                    "0 0 4px rgba(16,185,129,0.5)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>

            {/* Status Panel */}
            <div className="text-right">
              <span className="block text-[7px] font-mono text-primary/50 uppercase tracking-[0.3em] mb-1.5">
                MODULE_STATUS
              </span>
              <div className="relative inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/30"
                style={{
                  clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)"
                }}>
                {/* Status Corner Accent */}
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500" />

                <motion.div
                  className="w-1.5 h-1.5 bg-emerald-500"
                  animate={{
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-[0.2em]">
                  ONLINE
                </span>
              </div>
            </div>
          </div>

          {/* Title Section - Command Line Style */}
          <div className="mb-6 relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-1 bg-primary animate-pulse" />
              <div className="w-2 h-px bg-primary/50" />
              <div className="w-1 h-1 bg-primary/50" />
            </div>
            <h3 className="text-xl font-display font-black text-foreground group-hover:text-primary transition-colors flex items-center gap-3 uppercase tracking-tight">
              <span className="text-primary/40 text-sm font-mono">{'>'}</span>
              {title}
            </h3>
            {/* Underline Effect */}
            <div className="h-px w-full bg-gradient-to-r from-primary/50 via-primary/20 to-transparent mt-2" />
          </div>

          {/* Skills Grid - Robotic Panels */}
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill, i) => (
              <motion.div
                key={i}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                whileHover={{
                  scale: 1.03,
                  y: -2,
                }}
                className="group/skill relative overflow-hidden cursor-pointer"
              >
                {/* Skill Panel Background */}
                <div className="relative px-3 py-2.5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 group-hover/skill:border-primary/50 transition-all duration-300"
                  style={{
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)"
                  }}>

                  {/* Corner Indicators */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/30 group-hover/skill:border-primary transition-colors" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400/30 group-hover/skill:border-cyan-400 transition-colors" />

                  {/* Active Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-400/5 opacity-0 group-hover/skill:opacity-100 transition-opacity" />

                  {/* Skill Name */}
                  <span className="relative z-10 text-[10px] font-mono text-slate-400 group-hover/skill:text-primary transition-colors truncate block flex items-center gap-2">
                    <motion.span
                      className="w-1 h-1 bg-primary/40 group-hover/skill:bg-primary"
                      animate={{
                        boxShadow: hoveredSkill === skill
                          ? ["0 0 2px rgba(255,183,0,0.5)", "0 0 6px rgba(255,183,0,1)", "0 0 2px rgba(255,183,0,0.5)"]
                          : "0 0 2px rgba(255,183,0,0.3)",
                      }}
                      transition={{ duration: 1, repeat: hoveredSkill === skill ? Infinity : 0 }}
                    />
                    {skill}
                  </span>

                  {/* Scan Line Effect */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                  />
                </div>

                {/* Power Level Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover/skill:via-primary/60 transition-all" />
              </motion.div>
            ))}
          </div>

          {/* Detailed Info Panel */}
          <AnimatePresence>
            {hoveredSkill && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="relative p-3 bg-gradient-to-br from-primary/5 to-cyan-400/5 border border-primary/20"
                  style={{
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)"
                  }}>
                  {/* Info Panel Corners */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/60" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60" />

                  <div className="text-[9px] font-mono text-primary/80 leading-relaxed">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-primary font-bold whitespace-nowrap">[{hoveredSkill}]</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent mt-2" />
                    </div>
                    <p className="text-slate-400">
                      {SKILL_DETAILS[hoveredSkill] || "Accessing technical documentation..."}
                    </p>
                  </div>

                  {/* Data Stream Animation */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative Tech Corners - Outer */}
        <div className="absolute top-2 right-2 opacity-40 group-hover:opacity-70 transition-opacity">
          <div className="relative w-6 h-6">
            <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-primary to-transparent" />
            <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-primary to-transparent" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary" />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 opacity-40 group-hover:opacity-70 transition-opacity">
          <div className="relative w-6 h-6">
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-cyan-400 to-transparent" />
            <div className="absolute bottom-0 left-0 w-px h-full bg-gradient-to-t from-cyan-400 to-transparent" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}