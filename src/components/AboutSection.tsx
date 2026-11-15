import { motion } from "framer-motion";
import univpmLogo from "@/assets/univpm-logo.webp";

const stats = [
  { value: "8", label: "Ricercatori nel team" },
  { value: "100%", label: "Ingredienti naturali" },
];

const AboutSection = () => {
  return (
    <section id="chi-siamo" className="py-24 md:py-32 bg-background relative overflow-hidden">



      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-label mb-6">
              Chi siamo
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-8 leading-tight">
              Dove la <span className="heading-emphasis">ricerca</span> incontra la <span className="heading-emphasis">bellezza</span>
            </h2>
            <div className="space-y-5 font-body text-muted-foreground leading-relaxed text-lg">
              <p>
                <strong className="text-foreground">AMAREA COSMETICS</strong> trasforma la ricerca scientifica in bellezza sostenibile, creando cosmetici naturali con ingredienti vegetali e attivi ottenuti tramite upcycling.
              </p>
              <p>
                Grazie alla collaborazione con l'Università Politecnica delle Marche, selezioniamo e validiamo ogni ingrediente per garantire prodotti efficaci e rispettosi dell'ambiente.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="bg-card rounded-2xl p-4 inline-flex items-center gap-3">
                <img src={univpmLogo} alt="UNIVPM" className="h-10 w-auto" />
                <div>
                  <p className="font-body text-xs text-muted-foreground">In collaborazione con</p>
                  <p className="font-display font-semibold text-sm text-foreground">UNIVPM</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="bg-card border border-border shadow-card rounded-3xl p-8 text-center card-hover cursor-default group"
                >
                  <p className="font-display text-4xl md:text-5xl font-semibold text-primary group-hover:scale-110 transition-transform duration-500 inline-block">
                    {stat.value}
                  </p>
                  <p className="font-body text-sm text-muted-foreground mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
