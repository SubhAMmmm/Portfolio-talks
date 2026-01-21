import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  alignment?: "left" | "center" | "right";
}

export function SectionHeader({ title, subtitle, alignment = "left" }: SectionHeaderProps) {
  const alignClass = alignment === "center" ? "items-center text-center" : alignment === "right" ? "items-end text-right" : "items-start text-left";
  
  return (
    <div className={`flex flex-col mb-12 ${alignClass}`}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-white dark:to-white/50 mb-4 inline-block relative">
          {title}
          <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-transparent" />
        </h2>
      </motion.div>
      
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-muted-foreground font-mono text-lg max-w-2xl mt-2"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
