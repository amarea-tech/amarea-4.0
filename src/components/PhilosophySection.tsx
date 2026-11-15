import { motion } from "framer-motion";
import { FlaskConical, Recycle, Leaf, Heart } from "lucide-react";
import { useState } from "react";

const values = [
  {
    icon: FlaskConical,
    title: "Scienza",
    shortDesc: "Formulazioni naturali e innovative, frutto di ricerca scientifica.",
    fullDesc: "Le nostre formulazioni innovative sono frutto di ricerca scientifica accademica, per risultati visibili e rispettosi della pelle.",
    color: "bg-primary",
    lightBg: "bg-primary/10",
  },
  {
    icon: Recycle,
    title: "Upcycling",
    shortDesc: "Trasformiamo i materiali di scarto in nuove risorse.",
    fullDesc: "Trasformiamo i sottoprodotti delle aziende agro-alimentari del territorio italiano in nuove risorse, questo è il metodo che c'è dietro alla nostra filosofia: sostenibilità senza sprechi.",
    color: "bg-secondary",
    lightBg: "bg-secondary/10",
  },
  {
    icon: Leaf,
    title: "Ingredienti Botanici",
    shortDesc: "Solo ingredienti naturali e biologici, selezionati con cura.",
    fullDesc: "Utilizziamo soltanto materie prime di origine vegetale biologiche, appositamente selezionate per ottenere prodotti di altissima qualità.",
    color: "bg-secondary",
    lightBg: "bg-secondary/10",
  },
  {
    icon: Heart,
    title: "Cruelty Free",
    shortDesc: "Bellezza senza compromessi etici.",
    fullDesc: "​",
    color: "bg-accent",
    lightBg: "bg-accent/10",
  },
];

const PhilosophySection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section id="filosofia" className="py-24 md:py-32 bg-muted relative overflow-hidden">



      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="section-label mb-6">
              Perché sceglierci
            </span>
          <h2 className="font-display text-4xl md:text-6xl font-semibold text-foreground">
            La nostra <span className="heading-emphasis">filosofia</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                whileHover={{ scale: 1.03 }}
                className="group relative p-8 rounded-3xl border border-border bg-card shadow-card hover:border-primary/30 hover:shadow-card-hover cursor-pointer transition-all"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${v.lightBg} transition-all duration-500 mb-6`}>
                  <v.icon size={26} strokeWidth={1.5} className="text-foreground transition-colors duration-500" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 transition-colors duration-500">
                  {v.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed transition-colors duration-500">
                  {v.shortDesc}
                </p>
                <motion.div
                  initial={false}
                  animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0, marginTop: isExpanded ? 12 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="font-body text-sm text-foreground leading-relaxed border-t border-border pt-4">
                    {v.fullDesc}
                  </p>
                </motion.div>
                <div className="absolute top-4 right-4">
                  <motion.div
                    animate={{ rotate: isExpanded ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <span className="text-primary text-sm font-bold">+</span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
