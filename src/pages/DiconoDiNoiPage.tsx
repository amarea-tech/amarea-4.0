import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

type Riconoscimento = {
  anno: string;
  titolo: string;
  testo: string;
};

const riconoscimenti: Riconoscimento[] = [
  {
    anno: "2026",
    titolo: "Premio Nazionale per l'Innovazione 2026",
    testo:
      "Finalisti nella categoria CleanTech & Energy. Finale a Bari, 3 e 4 dicembre 2026.",
  },
  {
    anno: "2026",
    titolo: "Make it Circular 2026",
    testo:
      "Menzione d'onore al contest sull'economia circolare di Maker Faire Rome, ottobre 2026.",
  },
  {
    anno: "2026",
    titolo: "Start Cup Marche 2026",
    testo: "Terzo posto, 9 ottobre 2026.",
  },
  {
    anno: "2026",
    titolo: "GammaDonna FAB50 2026",
    testo:
      "Anna Manzella tra le 50 imprenditrici selezionate per l'innovazione.",
  },
  {
    anno: "2024",
    titolo: "Premio eCapital",
    testo: "Premio alla Business Plan Competition, 2024.",
  },
];

type Articolo = {
  testata: string;
  tipo: string;
  data: string;
  descrizione: string;
  link: string;
};

const articoli: Articolo[] = [
  {
    testata: "ANSA",
    tipo: "Notizia",
    data: "9 ottobre 2026",
    descrizione:
      "Il terzo posto alla Start Cup Marche e il progetto di recupero dei sottoprodotti agricoli marchigiani.",
    link: "https://www.ansa.it/amp/marche/notizie/2026/10/09/start-cup-marche-per-universitari-vince-dyn4mica-con-progetto-ia-per_aa1afb38-4589-4c0c-849e-0c223d9f8107.html",
  },
  {
    testata: "Rassegna Business",
    tipo: "Intervista",
    data: "29 luglio 2026",
    descrizione:
      "Anna Manzella racconta la skincare sostenibile che nasce dalla ricerca.",
    link: "https://www.rassegnabusiness.news/anna-manzella-amarea-cosmetics-e-skincare-sostenibile-che-nasce-ricerca/",
  },
  {
    testata: "Il Messaggero",
    tipo: "Articolo",
    data: "14 luglio 2026",
    descrizione:
      "Anna Manzella e Amarea Cosmetics tra le FAB50, le imprenditrici più innovative d'Italia.",
    link: "https://www.ilmessaggero.it/italia/fab50_imprenditrici_piu_innovative_italia_chi_sono-9650910.html",
  },
  {
    testata: "Io Donna (Corriere della Sera)",
    tipo: "Articolo",
    data: "13 luglio 2026",
    descrizione:
      "Anna Manzella tra le imprenditrici più innovative del 2026 selezionate da GammaDonna.",
    link: "https://www.iodonna.it/attualita/famiglia-e-lavoro/2026/07/13/gammadonna-top50-svelate-le-imprenditrici-italiane-piu-innovative-del-2026/",
  },
  {
    testata: "AnconaToday",
    tipo: "Articolo",
    data: "2026",
    descrizione:
      "Una startup dell'Università Politecnica delle Marche tra le 50 imprese femminili più innovative d'Italia.",
    link: "https://www.anconatoday.it/economia/amarea-cosmetics-univpm-premio-gammadonna-2026-startup-piu-innovative-italia.html",
  },
  {
    testata: "Partitaiva.it",
    tipo: "Intervista",
    data: "27 aprile 2026",
    descrizione:
      "Il passaggio dalla ricerca universitaria alla startup e la costruzione dell'impresa.",
    link: "https://www.partitaiva.it/come-aprire-startup-cosmetici/",
  },
];

const RiconoscimentoCard = ({
  riconoscimento,
  index,
}: {
  riconoscimento: Riconoscimento;
  index: number;
}) => (
  <motion.article
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
    className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col"
  >
    <span className="self-start inline-block bg-primary/10 text-primary text-xs tracking-wide uppercase font-body font-bold px-4 py-1.5 rounded-full mb-4">
      {riconoscimento.anno}
    </span>
    <h3 className="font-display text-2xl font-bold text-foreground mb-3 leading-snug">
      {riconoscimento.titolo}
    </h3>
    <p className="font-body text-muted-foreground leading-relaxed">
      {riconoscimento.testo}
    </p>
  </motion.article>
);

const ArticoloCard = ({
  articolo,
  index,
}: {
  articolo: Articolo;
  index: number;
}) => (
  <motion.article
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
    className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col"
  >
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <h3 className="font-display text-2xl font-bold text-foreground leading-snug">
        {articolo.testata}
      </h3>
      <span className="inline-block bg-primary/10 text-primary text-xs tracking-wide uppercase font-body font-bold px-4 py-1.5 rounded-full">
        {articolo.tipo}
      </span>
    </div>
    <p className="font-body text-sm text-muted-foreground mb-3">{articolo.data}</p>
    <p className="font-body text-muted-foreground leading-relaxed flex-1">
      {articolo.descrizione}
    </p>
    <a
      href={articolo.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 mt-6 font-body font-semibold text-primary hover:text-primary/80 transition-colors w-fit"
    >
      Leggi l'articolo
      <ArrowUpRight
        size={16}
        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
      />
    </a>
  </motion.article>
);

const DiconoDiNoiPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dicono di noi — Riconoscimenti e stampa | Amarea Cosmetics</title>
        <meta
          name="description"
          content="I riconoscimenti e le voci che hanno accompagnato il percorso di Amarea Cosmetics, dal laboratorio al mercato."
        />
        <link rel="canonical" href="https://amareacosmetics.com/dicono-di-noi" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amareacosmetics.com/dicono-di-noi" />
        <meta
          property="og:title"
          content="Dicono di noi — Riconoscimenti e stampa | Amarea Cosmetics"
        />
        <meta
          property="og:description"
          content="I riconoscimenti e le voci che hanno accompagnato il nostro percorso, dal laboratorio al mercato."
        />
      </Helmet>
      <Navbar />

      <section className="pt-40 pb-16 bg-[#F4EFE6] border-b border-[#E0DACE]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-primary text-primary-foreground text-xs tracking-wide uppercase font-body font-bold px-5 py-2 rounded-full mb-6">
              Dicono di noi
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Dicono di noi
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed">
              I riconoscimenti e le voci che hanno accompagnato il nostro percorso, dal
              laboratorio al mercato.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-10"
          >
            Riconoscimenti
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {riconoscimenti.map((riconoscimento, i) => (
              <RiconoscimentoCard
                key={riconoscimento.titolo}
                riconoscimento={riconoscimento}
                index={i}
              />
            ))}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-10"
          >
            Parlano di noi
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articoli.map((articolo, i) => (
              <ArticoloCard key={articolo.link} articolo={articolo} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#F4EFE6] border border-[#E0DACE] rounded-3xl px-8 py-14 md:px-16 text-center"
          >
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-foreground mb-4">
              Spin-off dell'Università Politecnica delle Marche
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Amarea Cosmetics è uno spin-off accademico dell'Università Politecnica delle
              Marche.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.univpm.it/Entra/Ricerca_Diffusione_Imprese_Elenco_spin_off"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground font-body font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-all duration-300"
              >
                Elenco degli spin-off UNIVPM
                <ArrowUpRight
                  size={18}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                />
              </a>
              <a
                href="https://www.univpm.it/Entra/Academic_Spin-off/Vetrina_Spin-off_UNIVPM/Life_Sciences_Spin-off_UNIVPM"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-transparent text-foreground font-body font-bold text-lg px-8 py-4 rounded-full border border-foreground/20 hover:border-foreground/40 transition-all duration-300"
              >
                Vetrina Life Sciences
                <ArrowUpRight
                  size={18}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default DiconoDiNoiPage;
