import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Cpu,
  Database,
  Cloud,
  BrainCircuit,
  Layers,
  Send,
  Briefcase,
  GraduationCap,
  Award,
  ChevronDown,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Code } from "lucide-react";
import { Scene3D } from "@/components/Scene3D";
import { Navigation } from "@/components/Navigation";
import { SectionHeader } from "@/components/SectionHeader";
// import { SkillCard } from "@/components/SkillCard";
import { ProjectCard } from "@/components/ProjectCard";
import PremiumSkills from "@/components/PremiumSkills";
import AIResumeAssistant from "@/components/AIResumeAssistant";
import {
  RevealAnimation,
  StaggerContainer,
  StaggerItem,
} from "@/components/RevealAnimation";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useCreateMessage } from "@/hooks/use-messages";
import { api, type InsertMessage } from "@shared/routes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import aiImg1 from "@assets/stock_images/futuristic_ai_techno_d2360881.jpg";
import aiImg2 from "@assets/stock_images/futuristic_ai_techno_33f790c4.jpg";
import aiImg3 from "@assets/stock_images/futuristic_ai_techno_e70532df.jpg";
import aiImg4 from "@assets/stock_images/futuristic_ai_techno_683652f0.jpg";
import aiImg5 from "@assets/stock_images/futuristic_ai_techno_bd3ea42c.jpg";

const AI_IMAGES = [aiImg1, aiImg2, aiImg3, aiImg4, aiImg5];

export default function Home() {
  const { mutate, isPending } = useCreateMessage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const orbitRef = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let raf: number;

    const animate = () => {
      if (!isDragging.current) {
        velocity.current *= 0.92; // smoother decay
        orbitRef.current += 0.05 + velocity.current; // slower base spin

        setOrbitAngle(orbitRef.current);
      }
      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  const startDrag = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  const onDrag = (e: React.PointerEvent) => {
    if (!isDragging.current) return;

    const delta = e.clientX - lastX.current;
    lastX.current = e.clientX;

    velocity.current = delta * 0.05;
    orbitRef.current += velocity.current;
    setOrbitAngle(orbitRef.current);
  };

  const endDrag = () => {
    isDragging.current = false;
  };

  const spinFromIconDrag = (deltaX: number) => {
    velocity.current += deltaX * 0.03;
  };

  const FULL_NAME = "SUBHAM";
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  useEffect(() => {
    const triggerGlitch = () => {
      // Multi-phase glitch
      setIsGlitching(true);
      setGlitchIntensity(1);

      setTimeout(() => setGlitchIntensity(2), 50);
      setTimeout(() => setGlitchIntensity(3), 100);
      setTimeout(() => setGlitchIntensity(2), 150);
      setTimeout(() => setGlitchIntensity(1), 200);
      setTimeout(() => {
        setIsGlitching(false);
        setGlitchIntensity(0);
      }, 300);
    };

    // Random intervals for more organic feel
    const scheduleNext = () => {
      const delay = 2000 + Math.random() * 3000; // 2-5 seconds
      setTimeout(() => {
        triggerGlitch();
        scheduleNext();
      }, delay);
    };

    scheduleNext();
  }, []);

  const form = useForm<InsertMessage>({
    resolver: zodResolver(api.messages.create.input),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: InsertMessage) => {
    playClick();
    mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  const playClick = () => {
    const audioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      880,
      audioCtx.currentTime + 0.05,
    );

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.15,
    );

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.15);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 relative">
      <LoadingScreen onComplete={() => setIsLoaded(true)} />
      <Navigation />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030303]"
      >
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-0"
            >
              <div className="relative inset-0 z-0 pointer-events-none opacity-20 select-none overflow-hidden font-mono text-[10px] md:text-sm leading-none flex gap-4 justify-around dark:md:flex hidden">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col animate-matrix-fall"
                    style={{ animationDelay: `${i * 0.7}s`, opacity: 0.3 }}
                  >
                    {"10100101011011001010".split("").map((char, j) => (
                      <span key={j} className="text-primary/40 block">
                        {char}
                      </span>
                    ))}
                  </div>
                ))}
              </div>

              {/* Light Mode Decorative Elements */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-40 select-none overflow-hidden flex gap-4 justify-around dark:hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
                <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
                {/* Transition Gradient - More aggressive blend */}
                <div className="absolute -bottom-[2px] left-0 w-full h-64 bg-gradient-to-t from-background via-background to-transparent z-10" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Scene3D />

        <div className="container relative z-10 px-4 pt-20 landscape:max-md:pt-24 landscape:max-md:pb-8 pointer-events-none">
          <div className="max-w-4xl mx-auto md:ml-0 text-center md:text-left pointer-events-auto">
            <AnimatePresence>
              {isLoaded && (
                <RevealAnimation type="rotateIn">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="md:text-left text-center"
                  >
                    <h1 className="text-5xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter mb-6 leading-[0.9] landscape:max-md:text-4xl">
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative inline-flex flex-col items-center md:items-start mb-4"
                      >
                        <span className="inline-block px-3 py-1 mb-6 text-xs font-mono font-bold tracking-widest text-primary border border-primary/30 rounded-full bg-primary/5 landscape:max-md:mb-2 landscape:max-md:text-[10px]">
                          SYSTEM_ONLINE
                        </span>
                        {/* Main Text */}
                        <span
                          className="relative text-2xl md:text-4xl font-mono tracking-[0.4em]
                            text-transparent bg-clip-text
                            bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400
                            animate-pulse
                            mix-blend-difference"
                        >
                          HI // I_AM
                        </span>

                        {/* Scanline */}
                        <span className="relative mt-2 h-[1px] w-36 overflow-hidden">
                          <span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent
                            animate-scanline"
                          />
                        </span>
                      </motion.div>

                      <span className="relative inline-flex items-center font-display font-black tracking-tight justify-start">
                        {/* Main Text with Glitch Effect */}
                        <span
                          className={`
                            relative
                            text-transparent bg-clip-text
                            bg-gradient-to-r from-[#FFB700] via-emerald-400 to-cyan-400
                            drop-shadow-[0_0_18px_rgba(255,183,0,0.45)]
                            transition-all duration-75
                          `}
                          style={{
                            transform: isGlitching
                              ? `translate(${(Math.random() * 8 - 4) * glitchIntensity}px, ${(Math.random() * 8 - 4) * glitchIntensity}px) skew(${Math.random() * 4 - 2}deg)`
                              : "none",
                            filter: isGlitching
                              ? `hue-rotate(${Math.random() * 360}deg) saturate(${1 + glitchIntensity * 0.5})`
                              : "none",
                          }}
                        >
                          {FULL_NAME}
                        </span>

                        {/* Glitch Clone 1 - Red/Pink */}
                        {isGlitching && (
                          <span
                            className="absolute inset-0 text-red-500 opacity-80 mix-blend-screen animate-pulse"
                            style={{
                              transform: `translate(-${Math.random() * 6 * glitchIntensity}px, ${Math.random() * 6 * glitchIntensity}px)`,
                              clipPath: `polygon(0 ${Math.random() * 20}%, 100% ${Math.random() * 20}%, 100% ${40 + Math.random() * 20}%, 0 ${40 + Math.random() * 20}%)`,
                            }}
                          >
                            {FULL_NAME}
                          </span>
                        )}

                        {/* Glitch Clone 2 - Cyan */}
                        {isGlitching && (
                          <span
                            className="absolute inset-0 text-cyan-400 opacity-80 mix-blend-screen"
                            style={{
                              transform: `translate(${Math.random() * 6 * glitchIntensity}px, -${Math.random() * 6 * glitchIntensity}px)`,
                              clipPath: `polygon(0 ${50 + Math.random() * 20}%, 100% ${50 + Math.random() * 20}%, 100% ${90 + Math.random() * 10}%, 0 ${90 + Math.random() * 10}%)`,
                            }}
                          >
                            {FULL_NAME}
                          </span>
                        )}

                        {/* Glitch Clone 3 - Green (extra layer) */}
                        {isGlitching && glitchIntensity > 2 && (
                          <span
                            className="absolute inset-0 text-green-400 opacity-60 mix-blend-screen"
                            style={{
                              transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px) scale(${1 + Math.random() * 0.1})`,
                              clipPath: `polygon(0 ${20 + Math.random() * 30}%, 100% ${20 + Math.random() * 30}%, 100% ${60 + Math.random() * 20}%, 0 ${60 + Math.random() * 20}%)`,
                            }}
                          >
                            {FULL_NAME}
                          </span>
                        )}

                        {/* Scan line effect */}
                        {isGlitching && (
                          <span
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: `linear-gradient(transparent ${Math.random() * 100}%, rgba(255,255,255,0.1) ${Math.random() * 100}%, transparent ${Math.random() * 100}%)`,
                              mixBlendMode: "overlay",
                            }}
                          />
                        )}

                        {/* Static noise overlay */}
                        {isGlitching && glitchIntensity > 1 && (
                          <span
                            className="absolute inset-0 opacity-30"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                              mixBlendMode: "overlay",
                            }}
                          />
                        )}
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-emerald-100/60 max-w-2xl mb-10 font-sans leading-relaxed landscape:max-md:text-xs landscape:max-md:mb-4 landscape:max-md:max-w-md landscape:max-md:mx-auto md:mx-0">
                      Building RAG Chatbots, LLM-Powered Systems & Scalable
                      Cloud Applications.{" "}
                      <br className="hidden md:block landscape:max-md:hidden" />
                      Bridging the gap between cutting-edge AI research and
                      production-grade software.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-20 landscape:max-md:mb-4 landscape:max-md:gap-2">
                      <a
                        href="#projects"
                        onClick={playClick}
                        className="futuristic-button group flex items-center gap-3 w-full sm:w-auto justify-center"
                      >
                        <span className="relative z-10">EXPLORE_SYSTEMS</span>
                        <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-white animate-pulse" />
                      </a>
                      <a
                        href="#contact"
                        onClick={playClick}
                        className="px-8 py-4 bg-transparent border border-foreground/30 text-foreground font-bold font-mono rounded hover:bg-foreground/5 hover:border-foreground transition-all duration-300 backdrop-blur-sm w-full sm:w-auto text-center landscape:max-md:py-2 landscape:max-md:px-4 landscape:max-md:text-xs"
                      >
                        ESTABLISH_LINK
                      </a>
                    </div>
                  </motion.div>
                </RevealAnimation>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 text-muted-foreground landscape:max-md:hidden"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-50">
                Scroll
              </span>
              <div className="w-[1px] h-10 bg-gradient-to-b from-primary to-transparent animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-24 relative overflow-hidden bg-black -mt-[1px]"
      >
        <RevealAnimation type="slideUp">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-background via-transparent to-transparent z-10 dark:hidden" />

          {/* Cosmic theme background elements */}
          <div className="absolute inset-0 z-0 dark:opacity-100 opacity-20 hidden md:block">
            <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-primary rounded-full animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
            <div className="absolute top-[30%] left-[80%] w-1 h-1 bg-secondary rounded-full animate-pulse delay-700 shadow-[0_0_8px_hsl(var(--secondary))]" />
            <div className="absolute top-[70%] left-[15%] w-1 h-1 bg-white rounded-full animate-pulse delay-1000 shadow-[0_0_8px_#fff]" />
            <div className="absolute top-[85%] left-[60%] w-1 h-1 bg-white rounded-full animate-pulse delay-500 shadow-[0_0_8px_#fff]" />
            <div className="absolute top-[40%] left-[40%] w-[2px] h-[2px] bg-blue-400 rounded-full animate-ping shadow-[0_0_10px_#60a5fa]" />

            {/* Glowing cosmic on the right side of About Me section */}
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#6366f1]/15 rounded-full blur-[120px] animate-pulse hidden md:block" />
            <div className="absolute bottom-[10%] right-[0%] w-[350px] h-[350px] bg-[#2dd4bf]/15 rounded-full blur-[100px] animate-pulse delay-1000 hidden md:block" />

            {/* Circuit Lines for About */}
            <svg
              className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M100 20 L80 20 L70 30 L40 30"
                stroke="currentColor"
                strokeWidth="0.1"
                fill="none"
                className="text-primary animate-pulse"
              />
              <circle cx="80" cy="20" r="0.5" className="fill-primary" />
            </svg>
          </div>

          <div className="container px-4 mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="lg:pt-12">
                <SectionHeader
                  title="ABOUT_ME"
                  subtitle="GenAI Engineer & Full-Stack Developer"
                />
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    GenAI Engineer with 1+ year of hands-on experience at{" "}
                    <strong className="text-foreground font-semibold">
                      Brandscapes Worldwide
                    </strong>
                    . My passion lies in architecting intelligent systems that
                    solve complex problems.
                  </p>
                  <p>
                    I specialize in designing and deploying scalable AI
                    solutions, from{" "}
                    <strong className="text-primary font-bold">
                      RAG-based chatbots
                    </strong>{" "}
                    to custom LLM applications, leveraging cloud infrastructure
                    to deliver high-performance results.
                  </p>

                  <div className="flex gap-4 pt-4">
                    <div className="p-4 bg-card/60 backdrop-blur-sm border border-border rounded-lg text-center flex-1 hover:border-primary/30 transition-colors shadow-sm">
                      <h4 className="text-3xl font-display font-bold text-foreground mb-1">
                        1+
                      </h4>
                      <span className="text-xs font-mono text-muted-foreground uppercase">
                        YEARS EXP
                      </span>
                    </div>
                    <div className="p-4 bg-card/60 backdrop-blur-sm border border-border rounded-lg text-center flex-1 hover:border-primary/30 transition-colors shadow-sm">
                      <h4 className="text-3xl font-display font-bold text-foreground mb-1">
                        10+
                      </h4>
                      <span className="text-xs font-mono text-muted-foreground uppercase">
                        PROJECTS
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative h-[500px] w-full max-w-[500px] mx-auto landscape:max-md:max-h-[350px] flex items-center justify-center">
                {/* Fixed Background Elements */}
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] animate-pulse" />

                <motion.div
                  className="relative h-full w-full flex items-center justify-center perspective-[1000px]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {/* Interactive Hexagon Grid Design */}
                  <motion.div
                    className="relative w-80 h-80 flex items-center justify-center cursor-grab active:cursor-grabbing"
                    onPointerDown={startDrag}
                    onPointerMove={onDrag}
                    onPointerUp={endDrag}
                    onPointerLeave={endDrag}
                  >
                    {/* Rotating Outer Hexagon */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 border-2 border-primary/20 flex items-center justify-center"
                      style={{
                        clipPath:
                          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      }}
                    />

                    {/* Reactive Floating Modules */}
                    {[...Array(12)].map((_, i) => {
                      const icons = [
                        Cpu,
                        Database,
                        Cloud,
                        BrainCircuit,
                        Terminal,
                        Layers,
                        Github,
                        Linkedin,
                        Twitter,
                        Send,
                        Briefcase,
                        Award,
                      ];
                      const Icon = icons[i % icons.length];
                      const radius = i < 6 ? 40 : 65; // Two rings of icons
                      const angleOffset = i < 6 ? 0 : 30; // Offset second ring
                      const baseAngle = i * 60 + angleOffset;

                      // Use current orbit angle even when dragging starts
                      const effectiveAngle = baseAngle + orbitAngle;

                      return (
                        <motion.div
                          key={i}
                          className="absolute w-10 h-10 bg-card/60 backdrop-blur-md 
                                     border border-primary/30 rounded-lg 
                                     flex items-center justify-center cursor-grab 
                                     active:cursor-grabbing overflow-hidden group/module"
                          /* 🔹 ORIGINAL ORBIT POSITION */
                          style={{
                            left: `${50 + radius * Math.cos((effectiveAngle * Math.PI) / 180)}%`,
                            top: `${50 + radius * Math.sin((effectiveAngle * Math.PI) / 180)}%`,

                            transform: "translate(-50%, -50%)",
                          }}
                          /* 🔹 DRAG ANYWHERE */
                          drag
                          dragMomentum={false}
                          dragElastic={0.25}
                          dragConstraints={false}
                          /* 🔹 SNAP BACK */
                          dragSnapToOrigin
                          onDrag={(e, info) => {
                            spinFromIconDrag(info.delta.x);
                          }}
                          onDragStart={() => {
                            isDragging.current = true;
                            // No longer resetting activeIconIndex to i if we want it to stay at its orbital pos
                          }}
                          onDragEnd={() => {
                            isDragging.current = false;
                          }}
                          /* 🔹 SMOOTH FEEL */
                          whileTap={{
                            scale: 1.15,
                            borderColor: "hsl(var(--primary))",
                            boxShadow: "0 0 20px hsla(var(--primary), 0.4)",
                          }}
                          /* 🔹 FLOATING */
                          animate={{
                            y: [0, Math.sin(i) * 8, 0],
                            rotate: [0, 2, -2, 0],
                          }}
                          transition={{
                            y: {
                              duration: 5 + i * 0.4,
                              repeat: Infinity,
                              repeatType: "mirror",
                              ease: "easeInOut",
                            },
                            rotate: {
                              duration: 6,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                          }}
                        >
                          <div
                            className="absolute inset-0 bg-gradient-to-br 
                                          from-primary/10 to-transparent 
                                          opacity-0 group-hover/module:opacity-100 
                                          transition-opacity"
                          />

                          <Icon
                            className="w-4 h-4 text-primary 
                                           group-hover/module:text-white 
                                           transition-colors"
                          />
                        </motion.div>
                      );
                    })}

                    {/* Central Interactive Core Sphere */}
                    <motion.div
                      className="relative w-40 h-40 rounded-full flex items-center justify-center cursor-pointer group/core"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {/* Multiple Glowing Layers with advanced animations */}
                      <motion.div
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"
                      />

                      {/* Rotating holographic rings */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            rotateX: [0, 360],
                            rotateY: [360, 0],
                            rotateZ: [0, 360],
                          }}
                          transition={{
                            duration: 10 + i * 5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 border border-primary/40 rounded-full opacity-30"
                          style={{ transformStyle: "preserve-3d" }}
                        />
                      ))}

                      <div className="relative w-32 h-32 bg-gradient-to-br from-primary/90 via-secondary/90 to-accent/90 rounded-full shadow-[0_0_70px_rgba(255,183,0,0.6)] flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>

                        {/* Dynamic Core Glow */}
                        <motion.div
                          animate={{
                            boxShadow: [
                              "inset 0 0 20px rgba(255,255,255,0.2)",
                              "inset 0 0 50px rgba(255,255,255,0.5)",
                              "inset 0 0 20px rgba(255,255,255,0.2)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full"
                        />

                        <motion.div
                          animate={{
                            rotateY: [0, 180, 360],
                            filter: [
                              "brightness(1)",
                              "brightness(1.5)",
                              "brightness(1)",
                            ],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <BrainCircuit className="w-16 h-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                        </motion.div>

                        {/* Interactive HUD labels within core */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{
                              duration: 0.1,
                              repeat: Infinity,
                              repeatDelay: 5,
                            }}
                            className="text-[8px] font-mono text-white/50"
                          >
                            RE-SYNCING...
                          </motion.div>
                        </div>

                        {/* Fast Scan Effect */}
                        <motion.div
                          animate={{ top: ["-100%", "200%"] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-transparent h-1/2 blur-xl pointer-events-none"
                        />
                      </div>
                    </motion.div>

                    {/* Dynamic Connecting Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                      <motion.circle
                        cx="50%"
                        cy="50%"
                        r="40%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeDasharray="4 4"
                        className="text-primary"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 60,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <motion.circle
                        cx="50%"
                        cy="50%"
                        r="65%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeDasharray="4 4"
                        className="text-primary/50"
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 90,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </svg>

                    {/* HUD Info Overlays */}
                    <div className="absolute -top-32 md:-top-24 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                      <motion.div
                        className="px-4 py-1.5 bg-primary/5 border border-primary/20 rounded-sm font-mono text-[10px] text-primary tracking-[0.4em] uppercase backdrop-blur-md whitespace-nowrap"
                        animate={{
                          opacity: [0.6, 1, 0.6],
                          boxShadow: [
                            "0 0 10px rgba(255,183,0,0.1)",
                            "0 0 20px rgba(255,183,0,0.3)",
                            "0 0 10px rgba(255,183,0,0.1)",
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        CORE_LINK
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </RevealAnimation>
      </section>

      {/* Skills Section */}
      <section id="skills">
        <PremiumSkills />
      </section>

      {/* Projects Section */}

      <section
        id="projects"
        className="relative py-32 overflow-hidden bg-[#000000]"
      >
        {/* Animated Grid Background */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(251,191,36,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,.6) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
            animate={{
              backgroundPosition: ["0px 0px", "60px 60px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Radial Glows */}
          <motion.div
            className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[80px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-violet-500/15 rounded-full blur-[80px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          {/* Holographic Lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0 100 Q 250 50, 500 100 T 1000 100"
              stroke="url(#line-gradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.path
              d="M0 200 Q 300 150, 600 200 T 1200 200"
              stroke="url(#line-gradient-2)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />
            <defs>
              <linearGradient
                id="line-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(251,191,36,0)" />
                <stop offset="50%" stopColor="rgba(251,191,36,1)" />
                <stop offset="100%" stopColor="rgba(251,191,36,0)" />
              </linearGradient>
              <linearGradient
                id="line-gradient-2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(139,92,246,0)" />
                <stop offset="50%" stopColor="rgba(139,92,246,1)" />
                <stop offset="100%" stopColor="rgba(139,92,246,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Holographic Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent z-20">
          <motion.div
            className="h-full w-32 bg-white"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ filter: "blur(8px)" }}
          />
        </div>

        <div className="relative z-10 container px-4 mx-auto">
          {/* Enhanced Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 relative"
          >
            {/* Floating Decorative Elements */}
            <motion.div
              className="absolute -left-20 top-0 w-32 h-32 border border-amber-500/20 rounded-full"
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 20, repeat: Infinity }}
            />
            <motion.div
              className="absolute -right-20 top-0 w-24 h-24 border border-violet-500/20 rounded-full"
              animate={{
                rotate: -360,
                scale: [1.2, 1, 1.2],
              }}
              transition={{ duration: 15, repeat: Infinity }}
            />

            <motion.div
              className="inline-flex items-center gap-3 mb-6 px-6 py-2 rounded-full border border-amber-500/30 bg-amber-500/5 relative overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(251,191,36,0.2)",
                  "0 0 40px rgba(251,191,36,0.4)",
                  "0 0 20px rgba(251,191,36,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Code className="w-4 h-4 text-amber-500 relative z-10" />
              <span className="text-xs font-mono text-amber-500 tracking-[0.3em] uppercase relative z-10">
                Project Archive
              </span>
            </motion.div>

            <motion.h2
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 relative"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-amber-500 via-violet-400 to-amber-500 bg-clip-text text-transparent inline-block">
                Featured Work
              </span>

              {/* Animated underline */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "60%" }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </motion.h2>

            <motion.p
              className="text-muted-foreground text-lg max-w-2xl mx-auto relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              System Deployments & Production Implementations
            </motion.p>

            {/* Orbiting Data Points */}
          </motion.div>

          {/* Timeline Container */}
          <div className="max-w-6xl mx-auto relative">
            {/* Central Timeline Beam */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 hidden lg:block overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500 via-violet-500 to-transparent" />

              <motion.div
                className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white via-amber-500 to-transparent"
                animate={{ y: ["0%", "1000%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                  animate={{
                    y: ["0%", "2000%"],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            <div className="space-y-1 lg:space-y-0">
              {/* Project Row 1 - Right Side */}
              {/* Project Row 1 - Both Sides */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                className="relative"
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden lg:block">
                  <motion.div className="relative w-28 h-28">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-amber-500/10"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-amber-500/40"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <motion.div
                      className="absolute inset-6 rounded-full bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(251,191,36,0.4)",
                          "0 0 40px rgba(251,191,36,0.8)",
                          "0 0 20px rgba(251,191,36,0.4)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Code className="w-7 h-7 text-black" />
                    </motion.div>
                  </motion.div>
                </div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-10 items-center">
                  <div className="lg:pr-14">
                    <ProjectCard
                      title="CI/CD PIPELINE DESIGN"
                      description="Robust CI/CD pipeline design for AWS with Jenkins & ArgoCD. Developed Dockerfile for containerization and managed GitHub repositories for code and Kubernetes manifests, enabling a GitOps workflow."
                      tags={[
                        "AWS",
                        "Jenkins",
                        "ArgoCD",
                        "Kubernetes",
                        "GitOps",
                      ]}
                    />
                  </div>

                  <div className="lg:pl-14">
                    <ProjectCard
                      title="ML LEAD CONVERSION"
                      description="Developed a logistic regression model in Python for lead conversion prediction, refining sales targeting. Conducted data preprocessing, feature selection, and utilized diverse metrics for model enhancement."
                      tags={[
                        "Python",
                        "Logistic Regression",
                        "ML",
                        "Data Science",
                      ]}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Project Row 2 - Both Sides */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                className="relative mt-24"
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden lg:block">
                  <motion.div className="relative w-28 h-28">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-violet-500/10"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-violet-500/40"
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <motion.div
                      className="absolute inset-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(139,92,246,0.4)",
                          "0 0 40px rgba(139,92,246,0.6)",
                          "0 0 20px rgba(139,92,246,0.4)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Briefcase className="w-7 h-7 text-black" />
                    </motion.div>
                  </motion.div>
                </div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-10 items-center">
                  <div className="lg:pr-14">
                    <ProjectCard
                      title="SHOPPING CART APP"
                      description="Developed a fully functional shopping cart application using React.js and Redux for state management. Features include user authentication, cart management, and responsive design with Tailwind CSS."
                      tags={["React", "Redux", "Tailwind CSS", "JavaScript"]}
                    />
                  </div>

                  <div className="lg:pl-14">
                    <ProjectCard
                      title="Cloud AI Backend"
                      description="Scalable microservices architecture deployed on Azure for processing heavy AI workloads with optimized latency."
                      tags={["Azure", "Docker", "FastAPI", "Celery"]}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Project Row 3 - Both Sides */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                className="relative mt-24"
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden lg:block">
                  <motion.div className="relative w-28 h-28">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-cyan-500/10"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-cyan-500/40"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <motion.div
                      className="absolute inset-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(6,182,212,0.4)",
                          "0 0 40px rgba(6,182,212,0.8)",
                          "0 0 20px rgba(6,182,212,0.4)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Code className="w-7 h-7 text-black" />
                    </motion.div>
                  </motion.div>
                </div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-10 items-center">
                  <div className="lg:pr-14">
                    <ProjectCard
                      title="AI Insights Dashboard"
                      description="Full-stack analytical dashboard visualizing real-time AI predictions and model performance metrics."
                      tags={["Next.js", "D3.js", "Python", "Tailwind"]}
                    />
                  </div>

                  <div className="lg:pl-14">
                    <ProjectCard
                      title="E-Commerce Platform"
                      description="Built a scalable e-commerce platform with real-time inventory management, payment integration, and advanced search capabilities."
                      tags={["Node.js", "MongoDB", "Stripe", "Redis"]}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="relative py-32 overflow-hidden bg-[#000000]"
      >
        {/* Animated Grid Background */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,183,0,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,183,0,.6) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
            animate={{
              backgroundPosition: ["0px 0px", "60px 60px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Radial Glows */}
          {!isMobile && (
            <>
              <motion.div
                className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-primary/15 rounded-full blur-[80px]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[80px]"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.5, 0.3, 0.5],
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />
            </>
          )}

          {/* Slow Blinking Dots */}
          {/* {[...Array(isMobile ? 5 : 12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-primary/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))} */}

          {/* Holographic Lines - Multiple flowing paths */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0 100 Q 250 50, 500 100 T 1000 100"
              stroke="url(#line-gradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.path
              d="M0 200 Q 300 150, 600 200 T 1200 200"
              stroke="url(#line-gradient-2)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />
            <defs>
              <linearGradient
                id="line-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(255,183,0,0)" />
                <stop offset="50%" stopColor="rgba(255,183,0,1)" />
                <stop offset="100%" stopColor="rgba(255,183,0,0)" />
              </linearGradient>
              <linearGradient
                id="line-gradient-2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(6,182,212,0)" />
                <stop offset="50%" stopColor="rgba(6,182,212,1)" />
                <stop offset="100%" stopColor="rgba(6,182,212,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Holographic Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-20">
          <motion.div
            className="h-full w-32 bg-white"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ filter: "blur(8px)" }}
          />
        </div>

        <div className="relative z-10 container px-4 mx-auto">
          {/* Enhanced Section Header with Animated Elements */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 relative"
          >
            {/* Floating Decorative Elements around Header */}
            <motion.div
              className="absolute -left-20 top-0 w-32 h-32 border border-primary/20 rounded-full"
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 20, repeat: Infinity }}
            />
            <motion.div
              className="absolute -right-20 top-0 w-24 h-24 border border-cyan-500/20 rounded-full"
              animate={{
                rotate: -360,
                scale: [1.2, 1, 1.2],
              }}
              transition={{ duration: 15, repeat: Infinity }}
            />

            <motion.div
              className="inline-flex items-center gap-3 mb-6 px-6 py-2 rounded-full border border-primary/30 bg-primary/5 relative overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(255,183,0,0.2)",
                  "0 0 40px rgba(255,183,0,0.4)",
                  "0 0 20px rgba(255,183,0,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Briefcase className="w-4 h-4 text-primary relative z-10" />
              <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase relative z-10">
                System Timeline
              </span>
            </motion.div>

            <motion.h2
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 relative"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent inline-block">
                Work History
              </span>

              {/* Animated underline */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "60%" }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </motion.h2>

            <motion.p
              className="text-muted-foreground text-lg max-w-2xl mx-auto relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Professional Evolution & System Impact Analysis
            </motion.p>
          </motion.div>

          {/* Timeline Container */}
          <div className="max-w-6xl mx-auto relative">
            {/* Enhanced Central Timeline Beam with flowing data */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 hidden lg:block overflow-hidden">
              {/* Base gradient line */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary via-cyan-500 to-transparent" />

              {/* Flowing data pulse */}
              <motion.div
                className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white via-primary to-transparent"
                animate={{ y: ["0%", "1000%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              {/* Secondary pulse */}
              <motion.div
                className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-cyan-400 to-transparent"
                animate={{ y: ["0%", "1000%"] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2,
                }}
              />

              {/* Data packets traveling */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(255,183,0,0.8)]"
                  animate={{
                    y: ["0%", "2000%"],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            <div className="space-y-32">
              {/* Experience Item 1 - Current Role */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                className="relative "
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 top-12 -translate-x-1/2 z-30 hidden lg:block">
                  <motion.div className="relative w-28 h-28">
                    {/* Outer glowing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/10"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Rotating Rings - Multiple layers */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/40"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <motion.div
                      className="absolute inset-2 rounded-full border-2 border-cyan-500/40 border-dashed"
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <motion.div
                      className="absolute inset-4 rounded-full border border-primary/20"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Central Core with enhanced glow */}
                    <motion.div
                      className="absolute inset-6 rounded-full bg-gradient-to-br from-primary via-yellow-500 to-cyan-500 flex items-center justify-center relative overflow-hidden"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(255,183,0,0.4), 0 0 40px rgba(255,183,0,0.2)",
                          "0 0 40px rgba(255,183,0,0.8), 0 0 80px rgba(255,183,0,0.4)",
                          "0 0 20px rgba(255,183,0,0.4), 0 0 40px rgba(255,183,0,0.2)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {/* Rotating gradient overlay */}
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background:
                            "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent)",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />

                      <BrainCircuit className="w-7 h-7 text-black relative z-10" />
                    </motion.div>

                    {/* Energy rings pulsing outward */}
                  </motion.div>
                </div>

                {/* Card - Right Side on Desktop */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
                  <div className="lg:text-right lg:pr-16 mb-6 lg:mb-0 relative">
                    {/* Floating Info Panel */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Status Badge */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4"
                      >
                        <motion.span
                          className="w-2 h-2 bg-emerald-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-xs font-mono text-emerald-500 tracking-wider">
                          ACTIVE SYSTEM
                        </span>
                      </motion.div>

                      {/* Date Display */}
                      <motion.div
                        className="relative inline-block"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="absolute inset-0 bg-primary/10 rounded-lg blur-xl" />
                        <div className="relative px-6 py-4 bg-black/60 border border-primary/30 rounded-lg backdrop-blur-sm">
                          <p className="text-sm font-mono text-primary mb-1 tracking-wider">
                            JAN 2024 — PRESENT
                          </p>
                          <motion.div
                            className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                            animate={{
                              opacity: [0.3, 1, 0.3],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                      </motion.div>



                      {/* Floating Stats Cards */}
                      <div className="space-y-4 hidden lg:block">
                        {[
                          {
                            label: "SYSTEM UPTIME",
                            value: "365+",
                            unit: "DAYS",
                            color: "emerald",
                          },
                          {
                            label: "PROJECTS SHIPPED",
                            value: "12",
                            unit: "LIVE",
                            color: "primary",
                          },
                          {
                            label: "CODE COMMITS",
                            value: "800+",
                            unit: "PUSHED",
                            color: "cyan",
                          },
                        ].map((stat, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            whileHover={{ x: -10, scale: 1.05 }}
                            className="relative group/stat cursor-pointer"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-lg blur-lg opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                            <div className="relative px-6 py-4 bg-black/40 border border-white/10 rounded-lg backdrop-blur-sm group-hover/stat:border-primary/30 transition-colors">
                              <div className="flex items-center justify-end gap-3">
                                <div className="text-right">
                                  <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                                    {stat.label}
                                  </div>
                                  <div className="flex items-baseline gap-1 justify-end">
                                    <span
                                      className={`text-2xl font-black ${stat.color === "emerald"
                                        ? "text-emerald-400"
                                        : stat.color === "cyan"
                                          ? "text-cyan-400"
                                          : "text-primary"
                                        }`}
                                    >
                                      {stat.value}
                                    </span>
                                    <span className="text-xs font-mono text-muted-foreground">
                                      {stat.unit}
                                    </span>
                                  </div>
                                </div>
                                <motion.div
                                  className={`w-2 h-2 rounded-full ${stat.color === "emerald"
                                    ? "bg-emerald-400"
                                    : stat.color === "cyan"
                                      ? "bg-cyan-400"
                                      : "bg-primary"
                                    }`}
                                  animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                  }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Decorative Tech Stack Icons */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                        className="hidden lg:flex flex-wrap gap-3 justify-end mt-8"
                      >
                        {[Terminal, Database, Cloud, BrainCircuit].map(
                          (Icon, i) => (
                            <motion.div
                              key={i}
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className="w-12 h-12 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center group/icon cursor-pointer"
                            >
                              <Icon className="w-5 h-5 text-primary/60 group-hover/icon:text-primary transition-colors" />
                            </motion.div>
                          ),
                        )}
                      </motion.div>

                      {/* Code-like decoration */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.9 }}
                        className="hidden lg:block font-mono text-xs text-primary/30 text-right space-y-1 mt-8"
                      >
                        <motion.div
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {`// ROLE: GENAI_ENGINEER`}
                        </motion.div>
                        <motion.div
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 0.5,
                          }}
                        >
                          {`// STATUS: DEPLOYED`}
                        </motion.div>
                        <motion.div
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 1,
                          }}
                        >
                          {`// VERSION: v2.0.1`}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ x: 32 }} // ← moves it right (8 * 4px = 32px)
                    whileHover={{ scale: 1.02, rotateY: 5, x: 32 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative group"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-primary rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />

                    {/* Main Card */}
                    <div className="relative bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
                      {/* Animated Corner Brackets */}
                      <div className="absolute top-0 left-0 w-20 h-20">
                        <motion.div
                          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent"
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        />
                        <motion.div
                          className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-primary to-transparent"
                          initial={{ height: 0 }}
                          whileInView={{ height: "100%" }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-20 h-20">
                        <motion.div
                          className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-primary to-transparent"
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                        />
                        <motion.div
                          className="absolute bottom-0 right-0 h-full w-0.5 bg-gradient-to-t from-primary to-transparent"
                          initial={{ height: 0 }}
                          whileInView={{ height: "100%" }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                        />
                      </div>

                      {/* Scanning Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Title Section */}
                        <div className="mb-8">
                          <h3 className="text-4xl md:text-5xl font-black uppercase mb-3">
                            <span className="bg-gradient-to-r from-primary via-white to-cyan-400 bg-clip-text text-transparent">
                              GenAI Engineer
                            </span>
                          </h3>
                          <div className="flex items-center gap-3 text-primary/80">
                            <Briefcase className="w-4 h-4" />
                            <span className="font-mono text-lg">
                              Brandscapes Worldwide
                            </span>
                          </div>
                        </div>

                        {/* Highlights with Enhanced Styling */}
                        <div className="space-y-4 mb-8">
                          {[
                            {
                              text: "Built production-grade RAG systems with 90%+ retrieval accuracy",
                              metric: "90%",
                            },
                            {
                              text: "Reduced inference costs by 40% using optimized prompt & model routing",
                              metric: "40%",
                            },
                            {
                              text: "Designed scalable AI APIs using FastAPI & Python",
                              metric: "API",
                            },
                            {
                              text: "Integrated GenAI into enterprise workflows",
                              metric: "ENT",
                            },
                          ].map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.7 + i * 0.1 }}
                              className="flex items-start gap-4 group/item"
                            >
                              <div className="relative mt-1.5">
                                <motion.div
                                  className="w-2 h-2 rounded-full bg-primary"
                                  animate={{
                                    boxShadow: [
                                      "0 0 5px rgba(255,183,0,0.5)",
                                      "0 0 15px rgba(255,183,0,1)",
                                      "0 0 5px rgba(255,183,0,0.5)",
                                    ],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                  }}
                                />
                                <motion.div
                                  className="absolute inset-0 rounded-full bg-primary"
                                  animate={{
                                    scale: [1, 2, 1],
                                    opacity: [0.5, 0, 0.5],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                                  {item.text}
                                </p>
                              </div>
                              <motion.div
                                className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30"
                                whileHover={{ scale: 1.1 }}
                              >
                                <span className="text-xs font-mono font-bold text-primary">
                                  {item.metric}
                                </span>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Tech Stack Tags */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.1 }}
                          className="flex flex-wrap gap-2"
                        >
                          {[
                            "Python",
                            "LangChain",
                            "FastAPI",
                            "OpenAI",
                            "Pinecone",
                            "RAG",
                            "Vector DBs",
                            "Prompt Engineering",
                          ].map((tech, i) => (
                            <motion.span
                              key={i}
                              whileHover={{ scale: 1.1, y: -2 }}
                              className="px-3 py-1.5 text-xs font-mono bg-primary/5 border border-primary/20 rounded-lg text-primary/80 hover:text-primary hover:border-primary/40 transition-all cursor-default"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </motion.div>
                      </div>

                      {/* Holographic Corner Accents */}
                      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-2xl" />
                      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-cyan-500/20 rounded-bl-2xl" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Experience Item 2 - Previous Role */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                className="relative"
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 top-12 -translate-x-1/2 z-30 hidden lg:block">
                  <motion.div className="relative w-24 h-24">
                    {/* Outer ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-cyan-500/40"
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Central Core */}
                    <motion.div
                      className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(6,182,212,0.4)",
                          "0 0 40px rgba(6,182,212,0.6)",
                          "0 0 20px rgba(6,182,212,0.4)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Code className="w-6 h-6 text-black" />
                    </motion.div>

                    {/* Orbiting Particles */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
                        style={{
                          left: "50%",
                          top: "50%",
                          boxShadow: "0 0 6px rgba(6,182,212,0.8)",
                        }}
                        animate={{
                          x: [
                            Math.cos((i * Math.PI) / 2) * 40,
                            Math.cos((i * Math.PI) / 2 + Math.PI * 2) * 40,
                          ],
                          y: [
                            Math.sin((i * Math.PI) / 2) * 40,
                            Math.sin((i * Math.PI) / 2 + Math.PI * 2) * 40,
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* Card - Left Side on Desktop */}
                <div
                  className="lg:grid lg:-translate-x-8
 lg:grid-cols-2 lg:gap-12 items-start"
                >
                  <motion.div
                    whileHover={{ scale: 1.02, rotateY: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative group order-2 lg:order-1"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />

                    <div className="relative bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
                      {/* Animated Corner Brackets */}
                      <div className="absolute top-0 left-0 w-20 h-20">
                        <motion.div
                          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        />
                        <motion.div
                          className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-cyan-500 to-transparent"
                          initial={{ height: 0 }}
                          whileInView={{ height: "100%" }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        />
                      </div>

                      {/* Scanning Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="mb-8">
                          <h3 className="text-4xl md:text-5xl font-black uppercase mb-3">
                            <span className="bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent">
                              Gen AI Intern
                            </span>

                          </h3>
                          <div className="flex items-center gap-3 text-cyan-400/80">
                            <Briefcase className="w-4 h-4" />
                            <span className="font-mono text-lg">
                              Internship · Oct 2024 — Jan 2025
                            </span>

                          </div>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-4 mb-8">
                          {[
                            {
                              text: "Deep understanding of document parsing, embedding creation, and intelligent response generation using advanced AI frameworks",
                              metric: "RAG",
                            },
                            {
                              text: "Deployed and managed scalable AI-backed applications on Azure Cloud platforms",
                              metric: "AZURE",
                            },
                            {
                              text: "Strong backend development using Django with optimized workflows and clean architecture",
                              metric: "DJANGO",
                            },
                            {
                              text: "Handled efficient data storage and querying using PostgreSQL for AI pipelines",
                              metric: "DB",
                            },
                            {
                              text: "Worked with multiple AI tools enabling innovative and effective problem-solving",
                              metric: "AI",
                            },
                          ].map((item, i) => (

                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.7 + i * 0.1 }}
                              className="flex items-start gap-4 group/item"
                            >
                              <div className="relative mt-1.5">
                                <motion.div
                                  className="w-2 h-2 rounded-full bg-cyan-400"
                                  animate={{
                                    boxShadow: [
                                      "0 0 5px rgba(6,182,212,0.5)",
                                      "0 0 15px rgba(6,182,212,1)",
                                      "0 0 5px rgba(6,182,212,0.5)",
                                    ],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                                  {item.text}
                                </p>
                              </div>
                              <motion.div
                                className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30"
                                whileHover={{ scale: 1.1 }}
                              >
                                <span className="text-xs font-mono font-bold text-cyan-400">
                                  {item.metric}
                                </span>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Tech Stack Tags */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.1 }}
                          className="flex flex-wrap gap-2"
                        >
                          {[
                            "Python",
                            "Django",
                            "PostgreSQL",
                            "Azure",
                            "Document Parsing",
                            "Embeddings",
                            "Vector Databases",
                            "GenAI Tools",
                          ].map((tech, i) => (
                            <motion.span
                              key={i}
                              whileHover={{ scale: 1.1, y: -2 }}
                              className="px-3 py-1.5 text-xs font-mono bg-cyan-500/5 border border-cyan-500/20 rounded-lg text-cyan-400/80 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-default"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </motion.div>
                      </div>

                      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-cyan-500/20 rounded-br-2xl" />
                    </div>
                  </motion.div>

                  <div className="lg:pl-16 mb-6 lg:mb-0 order-1 lg:order-2">
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Date Display */}
                      <motion.div
                        className="relative inline-block"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="absolute inset-0 bg-cyan-500/10 rounded-lg blur-xl" />
                        <div className="relative px-6 py-4 bg-black/60 border border-cyan-500/30 rounded-lg backdrop-blur-sm">
                          <p className="text-sm font-mono text-cyan-400 mb-1 tracking-wider">
                            OCT 2024 — JAN 2025

                          </p>
                          <motion.div
                            className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                      </motion.div>

                      {/* Code decoration */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="hidden lg:block font-mono text-xs text-cyan-400/30 space-y-1"
                      >
                        <motion.div
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {`// ROLE: GEN_AI_INTERN`}
                          {`// STATUS: COMPLETED`}


                        </motion.div>
                        <motion.div
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 0.5,
                          }}
                        >
                          {`// DURATION: 4 MONTHS`}
                          {`// FOCUS: RAG | AZURE | DJANGO`}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Certifications Section */}
      <section
        id="education"
        className="py-24 relative overflow-hidden bg-black"
      >
        <div className="container px-4 mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader
                title="ACADEMIC_PATH"
                subtitle="Foundation of my technical expertise"
              />
              <div className="mt-12 space-y-6">
                {/* Bachelor's Degree */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ x: 10 }}
                  className="p-6 rounded-xl bg-card/40 border border-border hover:border-primary/40 transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="absolute top-2 left-2 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                    <GraduationCap size={70} className="text-primary/30" />
                  </div>
                  <div className="relative z-10 pl-20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-xl font-display font-bold text-foreground mb-1 uppercase tracking-tighter">
                          Bachelor of Technology
                        </h4>
                        <p className="text-primary font-mono text-sm mb-1">
                          Computer Science & Engineering
                        </p>
                        <p className="text-muted-foreground font-mono text-xs">
                          Siksha O' Anusandhan University
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 flex-shrink-0">
                        <span className="text-xs font-mono font-bold text-primary">B.TECH</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground mt-4">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                        2020 — 2024
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                        CGPA: 8.5/10
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Higher Secondary */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ x: 10 }}
                  className="p-6 rounded-xl bg-card/40 border border-border hover:border-cyan-500/40 transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="absolute top-2 left-2 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                    <GraduationCap size={60} className="text-cyan-400/30" />
                  </div>
                  <div className="relative z-10 pl-20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg font-display font-bold text-foreground mb-1 uppercase tracking-tighter">
                          Higher Secondary Education
                        </h4>
                        <p className="text-cyan-400 font-mono text-sm mb-1">
                          Science Stream (CBSE)
                        </p>
                        <p className="text-muted-foreground font-mono text-xs">
                          Future Bhubaneswar School
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex-shrink-0">
                        <span className="text-xs font-mono font-bold text-cyan-400">XII</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground mt-4">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />{" "}
                        2017 — 2019
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Secondary School */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ x: 10 }}
                  className="p-6 rounded-xl bg-card/40 border border-border hover:border-violet-500/40 transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="absolute top-2 left-2 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                    <GraduationCap size={50} className="text-violet-400/30" />
                  </div>
                  <div className="relative z-10 pl-20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg font-display font-bold text-foreground mb-1 uppercase tracking-tighter">
                          Secondary Education
                        </h4>
                        <p className="text-violet-400 font-mono text-sm mb-1">
                          CBSE Board
                        </p>
                        <p className="text-muted-foreground font-mono text-xs">
                          Kendriya Vidyalaya No. 1, Bolangir
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 flex-shrink-0">
                        <span className="text-xs font-mono font-bold text-violet-400">X</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground mt-4">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />{" "}
                        2017
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div>
              <SectionHeader
                title="VERIFIED_SKILLS"
                subtitle="Industry recognized certifications"
              />
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: "Oracle AI Vector Search Professional",
                    issuer: "Oracle",
                    id: "OCI-2025",
                  },
                  {
                    name: "OCI 2025 Generative AI Professional",
                    issuer: "Oracle",
                    id: "OCI-GENAI",
                  },
                  {
                    name: "NPTEL-IIT KGP Machine Learning",
                    issuer: "IIT Kharagpur",
                    id: "NPTEL-ML",
                  },
                  {
                    name: "upGrad AI & ML Specialization",
                    issuer: "upGrad",
                    id: "UPGRAD-AI",
                  },
                ].map((cert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    whileHover={{
                      scale: 1.05,
                      y: -10,
                      boxShadow: "0 0 20px rgba(var(--primary), 0.3)",
                    }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group cursor-pointer relative overflow-hidden"
                  >
                    {/* Background scanline effect for certs */}
                    <motion.div
                      animate={{ top: ["-100%", "200%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.5,
                      }}
                      className="absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"
                    />

                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300">
                        <Award size={20} />
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                        {cert.id}
                      </span>
                    </div>
                    <h5 className="font-display font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors leading-tight relative z-10">
                      {cert.name}
                    </h5>
                    <p className="text-[10px] font-mono text-muted-foreground relative z-10">
                      {cert.issuer}
                    </p>

                    <div className="mt-4 h-[2px] w-full bg-white/5 relative z-10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary to-transparent"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden bg-black">
        {/* Cosmic theme background elements */}
        <div className="absolute inset-0 z-0 dark:opacity-100 opacity-20">
          <div className="absolute top-[15%] right-[10%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_8px_#fff]" />
          <div className="absolute bottom-[20%] left-[10%] w-1 h-1 bg-white rounded-full animate-pulse delay-500 shadow-[0_0_8px_#fff]" />

          {/* Cosmic Nebulae in center of Contact Section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse hidden md:block" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#6366f1]/10 rounded-full blur-[120px] animate-pulse delay-700 hidden md:block" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#2dd4bf]/10 rounded-full blur-[100px] animate-pulse delay-1000 hidden md:block" />

          {/* Circuit Lines for Contact */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 50 L20 50 L30 60 L60 60 L70 50 L100 50"
              stroke="currentColor"
              strokeWidth="0.1"
              fill="none"
              className="text-accent animate-pulse"
            />
            <circle cx="20" cy="50" r="0.5" className="fill-accent" />
            <circle cx="70" cy="50" r="0.5" className="fill-accent" />
          </svg>
        </div>
        <div className="container px-4 mx-auto relative z-10">
          <RevealAnimation>
            <div className="max-w-3xl mx-auto">
              <SectionHeader
                title="ESTABLISH_UPLINK"
                subtitle="Have a project in mind or want to discuss AI? Send a signal."
                alignment="center"
              />

              <StaggerContainer>
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                  {[
                    {
                      href: "mailto:subhamid007@gmail.com",
                      icon: Send,
                      label: "EMAIL",
                      value: "subhamid007@gmail.com",
                      color: "primary",
                    },
                    {
                      href: "https://www.linkedin.com/in/subhamsahu21/",
                      icon: Linkedin,
                      label: "LINKEDIN",
                      value: "/in/subhamsahu21/",
                      color: "secondary",
                    },
                    {
                      href: "https://github.com/SubhAMmmm",
                      icon: Github,
                      label: "GITHUB",
                      value: "SubhAMmmm",
                      color: "accent",
                    },
                  ].map((item, idx) => (
                    <StaggerItem key={idx}>
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        className="block group h-full"
                      >
                        <div className="relative h-full bg-[#0a0a0b]/60 backdrop-blur-xl border border-white/5 p-6 rounded-xl overflow-hidden transition-all duration-500 group-hover:border-primary/50 group-hover:translate-y-[-4px]">
                          {/* Card Background Pattern */}
                          <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                            <svg width="100%" height="100%">
                              <pattern
                                id={`hex-contact-${idx}`}
                                x="0"
                                y="0"
                                width="20"
                                height="34.6"
                                patternUnits="userSpaceOnUse"
                                patternTransform="scale(1)"
                              >
                                <path
                                  d="M10 0L20 5.8V17.3L10 23.1L0 17.3V5.8L10 0z"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="0.5"
                                  className="text-primary"
                                />
                              </pattern>
                              <rect
                                width="100%"
                                height="100%"
                                fill={`url(#hex-contact-${idx})`}
                              />
                            </svg>
                          </div>

                          <div className="relative z-10 flex flex-col items-center text-center">
                            <div
                              className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-${item.color} mb-4 border border-white/10 group-hover:border-${item.color}/50 group-hover:bg-${item.color}/10 transition-all duration-300`}
                            >
                              <item.icon
                                size={20}
                                className="group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] mb-1">
                              {item.label}
                            </div>
                            <div className="text-sm font-mono text-slate-300 break-all">
                              {item.value}
                            </div>
                          </div>

                          {/* Interactive HUD corners */}
                          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/10 group-hover:border-primary/40 transition-colors" />
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/10 group-hover:border-primary/40 transition-colors" />
                        </div>
                      </a>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                <div className="relative bg-[#0a0a0b]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Form Background scanning effect */}
                  <motion.div
                    animate={{ left: ["-100%", "200%"] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12 pointer-events-none"
                  />

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6 relative z-10"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-primary/60 font-mono uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                                Entity Identity
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Name"
                                  {...field}
                                  className="bg-white/5 border-white/10 focus:border-primary/50 font-mono h-12 rounded-sm transition-all focus:ring-1 focus:ring-primary/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-primary/60 font-mono uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                                Return Frequency
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Email Address"
                                  {...field}
                                  className="bg-white/5 border-white/10 focus:border-primary/50 font-mono h-12 rounded-sm transition-all focus:ring-1 focus:ring-primary/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary/60 font-mono uppercase text-[10px] tracking-widest flex items-center gap-2">
                              <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                              Data Transmission
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Input message..."
                                {...field}
                                className="bg-white/5 border-white/10 focus:border-primary/50 font-mono min-h-[150px] resize-none rounded-sm transition-all focus:ring-1 focus:ring-primary/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-14 bg-primary text-black font-bold font-mono tracking-[0.3em] text-sm hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(255,183,0,0.2)] hover:shadow-[0_0_30px_rgba(255,183,0,0.4)] relative overflow-hidden group/btn"
                      >
                        <span className="relative z-10">
                          {isPending ? "TRANSMITTING..." : "INITIATE_UPLINK"}
                        </span>
                        <motion.div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 skew-x-12" />
                      </Button>
                    </form>
                  </Form>
                </div>
              </motion.div>
            </div>
          </RevealAnimation>
          <AIResumeAssistant />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 bg-black">
        <div className="container px-4 mx-auto flex flex-col md:flex-row items-center justify-between text-muted-foreground text-sm font-mono">
          <p>
            &copy; {new Date().getFullYear()} Subham.AI // All Systems
            Operational
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a
              href="https://github.com/subhamsahu21"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/subhamsahu21/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
