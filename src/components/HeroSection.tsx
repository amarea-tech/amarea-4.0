import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/amarea-logo-transparent.png";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-foreground pt-28 md:pt-0">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="absolute inset-0 opacity-30">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="mb-4">
            <img src={logo} alt="Amarea Cosmetics" className="w-80 md:w-[28rem]" />
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-foreground px-5 py-2 rounded-full font-body text-sm font-medium">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Start-up Innovativa , Spin-off dell'Università Politecnica delle Marche
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold text-primary-foreground leading-[0.95] tracking-tight"
        >
          Ispirata dalla{" "}
          <span className="text-primary">natura</span>,{" "}
          <br className="hidden md:block" />
          arricchita dalla{" "}
          <span className="text-violet">scienza</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 text-primary-foreground/60 font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Cosmetici naturali e innovativi, nati dalla ricerca dell'Università Politecnica delle Marche
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => document.querySelector("#prodotti")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-primary text-primary-foreground font-body font-bold text-lg px-10 py-4 rounded-full hover:scale-105 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all duration-500"
          >
            Scopri i Prodotti →
          </button>
          <button
            onClick={() => document.querySelector("#chi-siamo")?.scrollIntoView({ behavior: "smooth" })}
            className="border-2 border-primary-foreground/20 text-primary-foreground font-body font-medium text-lg px-10 py-4 rounded-full hover:bg-primary-foreground/10 transition-all duration-500"
          >
            Chi Siamo
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
