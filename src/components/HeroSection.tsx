import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/amarea-logo-transparent.png";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden dark-surface bg-surface-dark pt-28 pb-28 md:pt-32 md:pb-32">

      <div className="absolute inset-0 opacity-20">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="absolute inset-0 hero-overlay" />

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
          <div className="font-body text-xs uppercase tracking-[0.18em] text-soft max-w-2xl leading-relaxed">
            Start-up Innovativa , Spin-off dell'Università Politecnica delle Marche
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-primary-foreground leading-[1.1] tracking-normal"
        >
          Ispirata dalla{" "}
          <span className="heading-emphasis">natura</span>,{" "}
          <br className="hidden md:block" />
          arricchita dalla{" "}
          <span className="heading-emphasis">scienza</span>
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
          <Button
            onClick={() => document.querySelector("#prodotti")?.scrollIntoView({ behavior: "smooth" })}
            className="font-body text-lg px-10 py-4 h-auto shadow-card hover:shadow-card-hover"
          >
            Scopri i Prodotti →
          </Button>
          <Button
            onClick={() => document.querySelector("#chi-siamo")?.scrollIntoView({ behavior: "smooth" })}
            variant="on-dark"
            className="font-body text-lg px-10 py-4 h-auto"
          >
            Chi Siamo
          </Button>
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
