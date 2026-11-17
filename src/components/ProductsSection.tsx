import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import productsHero from "@/assets/products-hero-new.webp";

interface ProductZone {
  name: string;
  subtitle: string;
  slug: string;
  left: string;
  width: string;
}

const products: ProductZone[] = [
  {
    name: "Sibilla",
    subtitle: "crema viso anti-aging",
    slug: "sibilla",
    left: "5%",
    width: "30%",
  },
  {
    name: "Conero",
    subtitle: "crema viso purificante",
    slug: "conero",
    left: "35%",
    width: "30%",
  },
  {
    name: "Catria",
    subtitle: "crema viso idratante",
    slug: "catria",
    left: "65%",
    width: "30%",
  },
];

const ProductsSection = () => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [quizOpen, setQuizOpen] = useState(false);
  const [answers, setAnswers] = useState<{ skin?: string; age?: string; goal?: string }>({});
  const [result, setResult] = useState<string | null>(null);

  const computeResult = (a: { skin?: string; age?: string; goal?: string }) => {
    // Mapping: Sibilla = anti-aging, Conero = purificante, Catria = idratante
    if (a.goal === "anti-age" || a.age === "45+") return "sibilla";
    if (a.goal === "purificare" || a.skin === "grassa" || a.skin === "mista") return "conero";
    return "catria";
  };

  const handleAnswer = (key: "skin" | "age" | "goal", value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (next.skin && next.age && next.goal) {
      setResult(computeResult(next));
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setResult(null);
  };

  const recommended = result ? products.find((p) => p.slug === result) : null;

  return (
    <section id="prodotti" className="py-24 md:py-36 dark-surface bg-surface-dark relative overflow-hidden">
      {/* Ambient blurs */}

      <div className="container mx-auto px-6 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="section-label mb-6">
            Amarea Cosmetics
          </span>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-6 px-6 py-2.5 rounded-full bg-soft text-soft-foreground"
            >
              <span className="font-body text-[0.7rem] md:text-xs tracking-[0.18em] uppercase text-soft-foreground font-semibold">
                Prossimamente
              </span>
              <span className="h-3 w-px bg-primary/30"></span>
              <span className="font-display italic text-xs md:text-sm text-soft-foreground font-medium">
                Gennaio 2027
              </span>
            </motion.div>
          </div>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-primary-foreground tracking-normal">
            Terre di{" "}
            <span className="heading-emphasis">Amarea</span>
          </h2>
          <p className="font-body text-primary-foreground mt-5 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Tre creme ispirate ai promontori delle Marche, formulate con ingredienti botanici rigenerati.
          </p>

          {/* Amarea App — quiz consigliato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 max-w-2xl mx-auto"
          >
            {!quizOpen ? (
              <Button variant="ghost"
                onClick={() => setQuizOpen(true)}
                className="group inline-flex items-center gap-3 px-7 py-3.5 border border-primary-foreground/30 rounded-full text-primary-foreground hover:bg-primary-foreground hover:text-foreground transition-all duration-500"
              >
                <span className="font-body text-xs tracking-[0.25em] uppercase">Amarea App</span>
                <span className="font-display italic text-sm">scopri la tua crema</span>
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="border border-primary-foreground/15 rounded-2xl p-6 md:p-10 bg-primary-foreground/[0.03] backdrop-blur-sm text-left"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-body text-[10px] md:text-xs tracking-[0.3em] uppercase text-primary-foreground/50">
                    Amarea App
                  </span>
                  <Button variant="ghost"
                    onClick={() => {
                      setQuizOpen(false);
                      resetQuiz();
                    }}
                    className="text-primary-foreground/40 hover:text-primary-foreground text-xs tracking-wider uppercase transition-colors"
                  >
                    Chiudi
                  </Button>
                </div>

                {!result ? (
                  <div className="space-y-8">
                    {/* Q1 — skin */}
                    <div>
                      <p className="font-display text-primary-foreground text-lg md:text-xl mb-4">
                        1. Com'è la tua pelle?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { v: "secca", l: "Secca" },
                          { v: "mista", l: "Mista" },
                          { v: "grassa", l: "Grassa" },
                          { v: "matura", l: "Matura" },
                        ].map((opt) => (
                          <Button variant="ghost"
                            key={opt.v}
                            onClick={() => handleAnswer("skin", opt.v)}
                            className={`px-4 py-2 rounded-full border text-sm font-body transition-all ${
                              answers.skin === opt.v
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-primary-foreground/25 text-primary-foreground/80 hover:border-primary-foreground/60"
                            }`}
                          >
                            {opt.l}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Q2 — age */}
                    <div>
                      <p className="font-display text-primary-foreground text-lg md:text-xl mb-4">
                        2. La tua fascia d'età?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { v: "18-29", l: "18 – 29" },
                          { v: "30-44", l: "30 – 44" },
                          { v: "45+", l: "45+" },
                        ].map((opt) => (
                          <Button variant="ghost"
                            key={opt.v}
                            onClick={() => handleAnswer("age", opt.v)}
                            className={`px-4 py-2 rounded-full border text-sm font-body transition-all ${
                              answers.age === opt.v
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-primary-foreground/25 text-primary-foreground/80 hover:border-primary-foreground/60"
                            }`}
                          >
                            {opt.l}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Q3 — goal */}
                    <div>
                      <p className="font-display text-primary-foreground text-lg md:text-xl mb-4">
                        3. Qual è il tuo obiettivo principale?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { v: "idratare", l: "Idratare" },
                          { v: "purificare", l: "Purificare" },
                          { v: "anti-age", l: "Anti-età" },
                        ].map((opt) => (
                          <Button variant="ghost"
                            key={opt.v}
                            onClick={() => handleAnswer("goal", opt.v)}
                            className={`px-4 py-2 rounded-full border text-sm font-body transition-all ${
                              answers.goal === opt.v
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-primary-foreground/25 text-primary-foreground/80 hover:border-primary-foreground/60"
                            }`}
                          >
                            {opt.l}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  recommended && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-center py-4"
                    >
                      <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/50 mb-3">
                        Ti consigliamo
                      </p>
                      <div
                        className="w-3 h-3 rounded-full mx-auto mb-4 bg-soft"
                      />
                      <h3
                        className="font-display text-4xl md:text-5xl heading-emphasis mb-2"

                      >
                        {recommended.name}
                      </h3>
                      <p className="font-body text-primary-foreground/70 text-sm md:text-base mb-8 capitalize">
                        {recommended.subtitle}
                      </p>
                      <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link
                          to={`/prodotti/${recommended.slug}`}
                          onClick={() => window.scrollTo(0, 0)}
                          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
                        >
                          Scopri {recommended.name}
                        </Link>
                        <Button variant="ghost"
                          onClick={resetQuiz}
                          className="px-6 py-3 rounded-full border border-primary-foreground/30 text-primary-foreground font-body text-xs tracking-[0.2em] uppercase hover:bg-primary-foreground/10 transition-colors"
                        >
                          Rifai il test
                        </Button>
                      </div>
                    </motion.div>
                  )
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Product image with interactive hotspots */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden">
            {/* Main image with subtle zoom on hover */}
            <motion.img
              src={productsHero}
              alt="Collezione Monti Italiani: Sibilla, Conero, Catria"
              className="w-full h-auto"
              animate={
                hoveredProduct && !isMobile
                  ? { scale: 1.02, filter: "brightness(1.03)" }
                  : { scale: 1, filter: "brightness(1)" }
              }
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Interactive hotspots (desktop) */}
            {!isMobile &&
              products.map((product) => {
                const isHovered = hoveredProduct === product.slug;

                return (
                  <Link
                    key={product.slug}
                    to={`/prodotti/${product.slug}`}
                    className="absolute top-0 bottom-0 cursor-pointer"
                    style={{
                      left: product.left,
                      width: product.width,
                    }}
                    onMouseEnter={() => setHoveredProduct(product.slug)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {/* Product label */}
                    <motion.div
                      className="absolute bottom-[12%] left-0 right-0 flex justify-center pointer-events-none"
                      animate={
                        isHovered
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 8 }
                      }
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="text-center bg-foreground/80 backdrop-blur-sm rounded-lg px-4 py-2">
                        <p className="font-display text-base md:text-lg font-semibold text-primary-foreground tracking-wide">
                          {product.name}
                        </p>
                        <p className="font-body text-[10px] md:text-xs text-primary-foreground/60 mt-0.5 tracking-wider uppercase">
                          {product.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
          </div>

          {/* Mobile: always-visible product labels below image */}
          {isMobile && (
            <div className="flex justify-between gap-2 mt-6 px-2">
              {products.map((product) => (
                <Link
                  key={product.slug}
                  to={`/prodotti/${product.slug}`}
                  className="flex-1 text-center group"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full mx-auto mb-2 bg-soft"
                  />
                  <p className="font-display text-sm font-semibold text-primary-foreground/80">
                    {product.name}
                  </p>
                  <p className="font-body text-[10px] text-primary-foreground/40 uppercase tracking-wider">
                    {product.subtitle}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* Desktop: subtle indicators */}
          {!isMobile && (
            <div className="flex justify-center gap-12 mt-10">
              {products.map((product) => (
                <motion.div
                  key={product.slug}
                  className="text-center cursor-pointer"
                  onMouseEnter={() => setHoveredProduct(product.slug)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  animate={{
                    opacity: hoveredProduct === product.slug ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <Link
                    to={`/prodotti/${product.slug}`}
                    className="block"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <div
                      className="w-2 h-2 rounded-full mx-auto mb-2 bg-soft transition-all duration-500"
                    />
                    <p className="font-display text-base font-semibold text-soft" >
                      {product.name}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
