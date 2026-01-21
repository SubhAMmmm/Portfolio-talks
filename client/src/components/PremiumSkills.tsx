import { useState, useEffect, useRef } from "react";
import React from "react";
import {
  BrainCircuit,
  Database,
  Cloud,
  Layers,
  Cpu,
  Sparkles,
  Code2,
  Server,
  GitBranch,
  Box,
  Zap,
  Network,
  FileJson,
} from "lucide-react";

type IconComponent = typeof BrainCircuit;

interface Skill {
  name: string;
  icon: IconComponent;
  description: string;
}

interface Category {
  id: string;
  icon: IconComponent;
  gradient: string;
  glowColor: string;
}

type SkillsData = {
  [key: string]: Skill[];
};

const skillsData: SkillsData = {
  "AI & GenAI": [
    { name: "LLMs", icon: BrainCircuit, description: "Large Language Models for natural language processing" },
    { name: "RAG Pipelines", icon: Network, description: "Retrieval-Augmented Generation systems" },
    { name: "LangChain", icon: Zap, description: "Framework for developing LLM applications" },
    { name: "OpenAI API", icon: Sparkles, description: "GPT-4 and advanced AI model integration" },
    { name: "Hugging Face", icon: Code2, description: "Open-source ML models and datasets" },
    { name: "Prompt Engineering", icon: FileJson, description: "Optimizing AI model interactions" },
    { name: "Vector DBs", icon: Database, description: "Semantic search and embeddings storage" },
  ],
  "Backend & Data": [
    { name: "Python", icon: Code2, description: "High-level programming language" },
    { name: "FastAPI", icon: Zap, description: "Modern, fast web framework for APIs" },
    { name: "Node.js", icon: Server, description: "JavaScript runtime for server-side development" },
    { name: "PostgreSQL", icon: Database, description: "Advanced open-source relational database" },
    { name: "MongoDB", icon: Database, description: "NoSQL document database" },
    { name: "SQLAlchemy", icon: FileJson, description: "Python SQL toolkit and ORM" },
    { name: "Redis", icon: Box, description: "In-memory data structure store" },
  ],
  "Cloud & DevOps": [
    { name: "Azure", icon: Cloud, description: "Microsoft cloud computing platform" },
    { name: "Docker", icon: Box, description: "Containerization platform" },
    { name: "Kubernetes", icon: Network, description: "Container orchestration system" },
    { name: "CI/CD", icon: GitBranch, description: "Continuous Integration/Deployment pipelines" },
    { name: "Linux", icon: Server, description: "Open-source operating system" },
    { name: "Git", icon: GitBranch, description: "Version control system" },
    { name: "Nginx", icon: Server, description: "High-performance web server" },
  ],
  Frontend: [
    { name: "React", icon: Code2, description: "JavaScript library for building UIs" },
    { name: "TypeScript", icon: FileJson, description: "Typed superset of JavaScript" },
    { name: "Tailwind CSS", icon: Sparkles, description: "Utility-first CSS framework" },
    { name: "Next.js", icon: Layers, description: "React framework for production" },
    { name: "Framer Motion", icon: Zap, description: "Animation library for React" },
    { name: "Three.js", icon: Box, description: "3D graphics library for the web" },
  ],
  "Analytics & ML": [
    { name: "Pandas", icon: Database, description: "Data manipulation and analysis library" },
    { name: "NumPy", icon: Code2, description: "Numerical computing library" },
    { name: "Scikit-learn", icon: BrainCircuit, description: "Machine learning library" },
    { name: "Matplotlib", icon: Layers, description: "Data visualization library" },
    { name: "Data Visualization", icon: Sparkles, description: "Creating visual representations of data" },
    { name: "Statistical Analysis", icon: FileJson, description: "Analyzing and interpreting data patterns" },
  ],
};

const categories: Category[] = [
  {
    id: "AI & GenAI",
    icon: BrainCircuit,
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    glowColor: "#a855f7",
  },
  {
    id: "Backend & Data",
    icon: Database,
    gradient: "from-cyan-600 via-blue-600 to-indigo-600",
    glowColor: "#06b6d4",
  },
  {
    id: "Cloud & DevOps",
    icon: Cloud,
    gradient: "from-emerald-600 via-teal-600 to-green-600",
    glowColor: "#10b981",
  },
  {
    id: "Frontend",
    icon: Layers,
    gradient: "from-orange-600 via-amber-600 to-yellow-600",
    glowColor: "#f59e0b",
  },
  {
    id: "Analytics & ML",
    icon: Cpu,
    gradient: "from-rose-600 via-pink-600 to-red-600",
    glowColor: "#f43f5e",
  },
];

export default function PremiumSkills() {
  const [activeCategory, setActiveCategory] = useState<string>("AI & GenAI");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), 100);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const activeCategoryData = categories.find((cat) => cat.id === activeCategory);
  const skills = skillsData[activeCategory] || [];

  if (!activeCategoryData) {
    return null;
  }

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-black">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Radial Gradient Background */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 transition-all duration-1000 ${isVisible ? 'opacity-30 scale-100' : 'opacity-0 scale-75'}`}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${activeCategoryData.glowColor}20, transparent 70%)`
          }}
        />
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${isVisible ? 'opacity-[0.03]' : 'opacity-0'}`}
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            animation: "gridMove 20s linear infinite"
          }}
        />
      </div>

      {/* Holographic Lines */}
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-20' : 'opacity-0'}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="line-gradient-skills" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="line-gradient-skills-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168,85,247,0)" />
            <stop offset="50%" stopColor="rgba(168,85,247,0.5)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </linearGradient>
          <linearGradient id="line-gradient-skills-3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(6,182,212,0)" />
            <stop offset="50%" stopColor="rgba(6,182,212,0.5)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0)" />
          </linearGradient>
        </defs>
        <path
          d="M0 100 Q 250 50, 500 100 T 1000 100"
          stroke="url(#line-gradient-skills)"
          strokeWidth="1"
          fill="none"
          style={{
            animation: "drawLine 8s ease-in-out infinite"
          }}
        />
        <path
          d="M0 300 Q 400 250, 800 300 T 1600 300"
          stroke="url(#line-gradient-skills-2)"
          strokeWidth="1"
          fill="none"
          style={{
            animation: "drawLine 12s ease-in-out infinite",
            animationDelay: "1s"
          }}
        />
        <path
          d="M0 600 Q 300 500, 600 600 T 1200 600"
          stroke="url(#line-gradient-skills-3)"
          strokeWidth="1"
          fill="none"
          style={{
            animation: "drawLine 15s ease-in-out infinite",
            animationDelay: "2s"
          }}
        />
        <path
          d="M1200 800 Q 900 850, 600 800 T 0 800"
          stroke="url(#line-gradient-skills)"
          strokeWidth="1"
          fill="none"
          style={{
            animation: "drawLine 10s ease-in-out infinite",
            animationDelay: "0.5s"
          }}
        />
      </svg>

      {/* Static Decorative Elements */}
      <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <div
            className={`inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-white/[0.08] to-white/[0.04] backdrop-blur-xl border border-white/20 rounded-full mb-6 shadow-2xl transition-all duration-500 hover:scale-105 ${isVisible ? 'scale-100' : 'scale-0'}`}
          >
            <Sparkles className="w-4 h-4 animate-spin" style={{ color: activeCategoryData.glowColor, animationDuration: '4s' }} />
            <span className="text-xs font-mono text-white tracking-[0.3em] uppercase">
              Technical Mastery
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-none">
            <span
              className="inline-block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent"
              style={{
                textShadow: `0 0 80px ${activeCategoryData.glowColor}40`
              }}
            >
              Tech Arsenal
            </span>
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cutting-edge technologies powering innovation
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-6xl mx-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`group relative px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-500 overflow-hidden ${isActive
                  ? "text-white"
                  : "text-white/50 hover:text-white/90"
                  } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{
                  transitionDelay: isVisible ? `${index * 0.08}s` : '0s'
                }}
              >
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div
                    className={`absolute inset-0 border-2 rounded-xl transition-all duration-500 ${isActive
                      ? 'border-transparent'
                      : 'border-white/10 group-hover:border-white/20'
                      }`}
                  />
                  {isActive && (
                    <>
                      {/* Animated gradient border */}
                      <div
                        className="absolute inset-0 rounded-xl p-[2px]"
                        style={{
                          background: `linear-gradient(135deg, ${category.glowColor}, transparent, ${category.glowColor})`,
                          backgroundSize: '200% 200%',
                          animation: 'gradientShift 3s ease infinite',
                        }}
                      >
                        <div className="w-full h-full rounded-xl bg-black" />
                      </div>
                    </>
                  )}
                </div>

                {/* Glass Background */}
                <div className={`absolute inset-[2px] rounded-xl transition-all duration-500 ${isActive
                  ? 'bg-gradient-to-br from-white/[0.15] to-white/[0.05]'
                  : 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] group-hover:from-white/[0.08] group-hover:to-white/[0.04]'
                  } backdrop-blur-xl`} />

                {/* Active Gradient Glow */}
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-xl opacity-20 blur-md"
                    style={{
                      background: `linear-gradient(135deg, ${category.glowColor}, transparent)`,
                      animation: 'pulse 2s ease-in-out infinite'
                    }}
                  />
                )}

                {/* Shine Effect on Hover */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                  style={{
                    transform: 'translateX(-100%)',
                    animation: isActive ? 'none' : 'shine 3s ease-in-out infinite'
                  }}
                />

                <div className="relative flex items-center gap-2.5 z-10">
                  <div className={`p-1.5 rounded-lg transition-all duration-300 ${isActive
                    ? `bg-gradient-to-br ${category.gradient}`
                    : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="tracking-wide font-mono">{category.id}</span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: category.glowColor }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Skills Display */}
        <div className="relative max-w-7xl mx-auto mb-36 md:mb-0">
          <div className="relative h-[350px] md:h-[600px] flex items-center justify-center">
            {/* Concentric Rings - Desktop */}
            {[280, 360, 460].map((size, i) => (
              <div
                key={size}
                className={`absolute rounded-full border border-white/5 hidden md:block transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                style={{
                  width: size,
                  height: size,
                  animation: `rotate ${40 + i * 10}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                  transitionDelay: isVisible ? `${0.5 + i * 0.15}s` : '0s'
                }}
              />
            ))}
            {/* Mobile Rings */}
            {[140, 180, 230].map((size, i) => (
              <div
                key={`mobile-${size}`}
                className={`absolute rounded-full border border-white/5 md:hidden transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                style={{
                  width: size,
                  height: size,
                  animation: `rotate ${40 + i * 10}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                  transitionDelay: isVisible ? `${0.5 + i * 0.15}s` : '0s'
                }}
              />
            ))}

            {/* Main Skills Container */}
            <div
              key={activeCategory}
              className="relative w-full h-full flex items-center justify-center transition-all duration-500"
            >
              {/* Skills Bubbles - REFACTORED POSITIONING */}
              {skills.map((skill: Skill, index: number) => {
                const SkillIcon = skill.icon;
                const angle = (index / skills.length) * Math.PI * 2;

                // Responsive radius and size
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                const radius = isMobile ? 120 : 230;
                const baseSize = isMobile ? 60 : 100;
                const sizeVariation = isMobile ? 6 : 12;

                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const size = baseSize + (index % 3) * sizeVariation;

                return (
                  <div
                    key={skill.name}
                    className="absolute cursor-pointer transition-all duration-500 group/skill"
                    style={{
                      width: size,
                      height: size,
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      // Removed dynamic float animation from here
                      opacity: isVisible ? 1 : 0,
                      transition: `opacity 0.5s ease-out ${index * 0.08}s, transform 0.5s ease-out ${index * 0.08}s`,
                      transitionDelay: isVisible ? `${0.3 + index * 0.08}s` : '0s'
                    }}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    onTouchStart={() => setHoveredSkill(skill.name)}
                  >
                    {/* Tooltip */}
                    <div
                      className={`absolute md:block hidden px-4 py-2 bg-black/95 backdrop-blur-xl border rounded-lg pointer-events-none transition-all duration-300 z-[100] ${hoveredSkill === skill.name
                        ? 'opacity-100'
                        : 'opacity-0 pointer-events-none'
                        }`}
                      style={{
                        top: '50%',
                        left: x > 0 ? 'calc(100% + 12px)' : 'auto',
                        right: x <= 0 ? 'calc(100% + 12px)' : 'auto',
                        transform: 'translateY(-50%)',
                        minWidth: '220px',
                        maxWidth: '280px',
                        borderColor: `${activeCategoryData.glowColor}40`,
                        boxShadow: `0 0 20px ${activeCategoryData.glowColor}20`,
                        whiteSpace: 'normal'
                      }}
                    >
                      <div className="text-xs text-white font-semibold mb-0.5">{skill.name}</div>
                      <div className="text-[10px] text-white/60 leading-tight">{skill.description}</div>

                      {/* Arrow - Desktop only */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-transparent ${x > 0 ? 'right-full border-r-4' : 'left-full border-l-4'
                          }`}
                        style={{
                          [x > 0 ? 'borderRightColor' : 'borderLeftColor']: `${activeCategoryData.glowColor}40`
                        }}
                      />
                    </div>

                    {/* Inner floating container */}
                    <div
                      className={`relative w-full h-full transition-all duration-300 ${hoveredSkill === skill.name ? 'md:scale-125 scale-110 z-50' : ''}`}
                      style={{
                        animation: `float-vertical ${3 + index * 0.15}s ease-in-out infinite`
                      }}
                    >
                      {/* Glow Effect */}
                      <div
                        className={`absolute inset-0 rounded-full blur-3xl transition-all duration-400 ${hoveredSkill === skill.name ? 'opacity-100 scale-[1.8]' : 'opacity-0'}`}
                        style={{
                          background: `radial-gradient(circle, ${activeCategoryData.glowColor}60, transparent 70%)`,
                        }}
                      />

                      {/* Skill Bubble */}
                      <div
                        className="relative w-full h-full rounded-full p-[2px] transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${activeCategoryData.glowColor}60, ${activeCategoryData.glowColor}20)`,
                          boxShadow: hoveredSkill === skill.name
                            ? `0 0 60px ${activeCategoryData.glowColor}80, inset 0 0 20px ${activeCategoryData.glowColor}30`
                            : `0 0 20px ${activeCategoryData.glowColor}20`,
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 backdrop-blur-2xl flex flex-col items-center justify-center gap-2 p-4 border border-white/10">
                          <div
                            className={`relative transition-all duration-600 ${hoveredSkill === skill.name ? 'animate-wiggle' : ''}`}
                          >
                            <SkillIcon
                              className="w-6 h-6 md:w-9 md:h-9 text-white drop-shadow-2xl"
                              style={{
                                filter: `drop-shadow(0 0 10px ${activeCategoryData.glowColor}60)`
                              }}
                            />
                          </div>
                          <span className="text-[10px] md:text-xs text-white font-bold text-center leading-tight tracking-wide">
                            {skill.name}
                          </span>
                        </div>
                      </div>

                      {/* Orbiting Particles on Hover */}
                      {hoveredSkill === skill.name && (
                        <>
                          {[0, 120, 240].map((startAngle, i) => (
                            <div
                              key={i}
                              className="absolute w-3 h-3 md:w-3 md:h-3 rounded-full"
                              style={{
                                background: `radial-gradient(circle, ${activeCategoryData.glowColor}, transparent)`,
                                left: '50%',
                                top: '50%',
                                marginLeft: -6,
                                marginTop: -6,
                                animation: `orbit 2s linear infinite`,
                                animationDelay: `${(startAngle / 360) * 2}s`,
                                transformOrigin: '50% 50%'
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Center Info Card */}
              <div
                className={`relative z-50 px-4 py-3 md:px-8 md:py-5 rounded-2xl md:rounded-3xl backdrop-blur-2xl border-2 shadow-2xl transition-all duration-700 hover:scale-110 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                style={{
                  background: `linear-gradient(135deg, ${activeCategoryData.glowColor}15, rgba(0,0,0,0.8))`,
                  borderColor: activeCategoryData.glowColor + "40",
                  boxShadow: `0 0 80px ${activeCategoryData.glowColor}30, inset 0 0 40px ${activeCategoryData.glowColor}10`,
                  transitionDelay: isVisible ? '0.6s' : '0s'
                }}
              >
                <div className="relative flex items-center gap-2 md:gap-3">
                  <div
                    className="p-1.5 md:p-2.5 rounded-xl md:rounded-2xl animate-wiggleSlow"
                    style={{
                      background: `linear-gradient(135deg, ${activeCategoryData.glowColor}30, ${activeCategoryData.glowColor}10)`
                    }}
                  >
                    <activeCategoryData.icon className="w-6 h-6 md:w-9 md:h-9 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-xl font-black text-white mb-0.5 md:mb-1 tracking-tight">
                      {activeCategory}
                    </h3>
                    <p className="text-xs md:text-sm text-white/60 font-medium tracking-wide">
                      {skills.length} Technologies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tooltip - Compact Box at Bottom of Section */}
        <div
          className={`md:hidden mx-auto max-w-sm px-3 py-2.5 bg-black/95 backdrop-blur-xl border rounded-xl transition-all duration-300 -mt-20 ${hoveredSkill ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          style={{
            borderColor: `${activeCategoryData.glowColor}40`,
            boxShadow: `0 0 20px ${activeCategoryData.glowColor}20`,
          }}
          onClick={() => setHoveredSkill(null)}
        >
          {hoveredSkill && (
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="p-1.5 rounded-lg shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${activeCategoryData.glowColor}30, ${activeCategoryData.glowColor}10)`
                  }}
                >
                  {(() => {
                    const currentSkill = skills.find(s => s.name === hoveredSkill);
                    if (currentSkill) {
                      const IconComponent = currentSkill.icon;
                      return <IconComponent className="w-4 h-4 text-white" />;
                    }
                    return null;
                  })()}
                </div>
                <h4 className="text-xs font-bold text-white">{hoveredSkill}</h4>
              </div>
              <p className="text-[10px] text-white/70 leading-snug">
                {skills.find(s => s.name === hoveredSkill)?.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes gridMove {
          from { backgroundPosition: 0px 0px; }
          to { backgroundPosition: 60px 60px; }
        }
        @keyframes drawLine {
          0%, 100% { strokeDashoffset: 1000; }
          50% { strokeDashoffset: 0; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes float-vertical {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @media (max-width: 768px) {
          @keyframes float-vertical {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-10deg) scale(1.15); }
          75% { transform: rotate(10deg) scale(1.15); }
        }
        @keyframes wiggleSlow {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(50px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(50px) rotate(-360deg);
          }
        }
        @media (min-width: 768px) {
          @keyframes orbit {
            from {
              transform: rotate(0deg) translateX(80px) rotate(0deg);
            }
            to {
              transform: rotate(360deg) translateX(80px) rotate(-360deg);
            }
          }
        }
        .animate-wiggle {
          animation: wiggle 0.6s ease-in-out;
        }
        .animate-wiggleSlow {
          animation: wiggleSlow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

