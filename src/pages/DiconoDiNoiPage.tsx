import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { motion } from "framer-motion";
import { ArrowUpRight, Award, Star, Medal } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import petalSaffron from "@/assets/petal-saffron.png";
import flowerSaffronLilac from "@/assets/flower-saffron-lilac.png";

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

const riconoscimentoIcons = [Award, Star, Medal];
const riconoscimentoTints = [
  { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
  { bg: "bg-secondary/20", text: "text-secondary-foreground", dot: "bg-secondary" },
  { bg: "bg-accent/10", text: "text-accent", dot: "bg-accent" },
];

const RiconoscimentoTimelineItem = ({
  riconoscimento,
  index,
}: {
  riconoscimento: Riconoscimento;
  index: number;
}) => {
  const Icon = riconoscimentoIcons[index % riconoscimentoIcons.length];
  const tint = riconoscimentoTints[index % riconoscimentoTints.length];
  const isLast = index === riconoscimenti.length - 1;

  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="relative flex gap-6 md:gap-10 pb-10 last:pb-0"
    >
      {/* Linea verticale */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-[1.4rem] md:left-[1.9rem] top-16 bottom-0 w-px bg-border"
        />
      )}

      {/* Icona nel cerchio colorato */}
      <div className="relative z-10 shrink-0">
        <span
          className={`flex h-11 w-11 md:h-[3.75rem] md:w-[3.75rem] items-center justify-center rounded-full border border-border ${tint.bg} ${tint.text}`}
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.75} />
        </span>
        <span
          aria-hidden="true"
          className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${tint.dot}`}
        />
      </div>

      <article className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex-1">
        <span className="block font-display text-3xl md:text-4xl font-extrabold text-primary leading-none mb-3">
          {riconoscimento.anno}
        </span>
        <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3 leading-snug">
          {riconoscimento.titolo}
        </h3>
        <p className="font-body text-muted-foreground leading-relaxed">
          {riconoscimento.testo}
        </p>
      </article>
    </motion.li>
  );
};

const tipoTint = (tipo: string) =>
  tipo === "Intervista"
    ? "bg-secondary/25 text-secondary-foreground"
    : "bg-primary/10 text-primary";

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
    className="group bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
  >
    <span
      className={`self-start inline-block text-xs tracking-wide uppercase font-body font-bold px-4 py-1.5 rounded-full mb-6 ${tipoTint(articolo.tipo)}`}
    >
      {articolo.tipo}
    </span>
    <h3 className="font-display text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-4">
      {articolo.testata}
    </h3>
    <p className="font-body text-sm text-muted-foreground mb-3">{articolo.data}</p>
    <p className="font-body text-muted-foreground leading-relaxed flex-1">
      {articolo.descrizione}
    </p>
    <a
      href={articolo.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex items-center gap-2 mt-6 font-body font-semibold text-primary hover:text-primary/80 transition-colors w-fit"
    >
      Leggi l'articolo
      <ArrowUpRight
        size={16}
        className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300"
      />
    </a>
  </motion.article>
);

const PAGE_TITLE = "Dicono di noi — Riconoscimenti e stampa | Amarea Cosmetics";
const PAGE_DESCRIPTION =
  "I riconoscimenti e la rassegna stampa di Amarea Cosmetics, spin-off UNIVPM: Start Cup Marche, GammaDonna FAB50, Make it Circular, ANSA e Il Messaggero.";
const PAGE_OG_URL = "https://amareacosmetics.com/dicono-di-noi";

// react-helmet-async aggiunge i tag della pagina in fondo all'head senza
// rimuovere quelli statici di index.html: qui li sovrascriviamo finché
// l'utente è su questa pagina e li ripristiniamo appena ne esce.
const STATIC_HEAD_OVERRIDES: Array<[string, string]> = [
  ['meta[name="description"]', PAGE_DESCRIPTION],
  ['meta[property="og:description"]', PAGE_DESCRIPTION],
  ['meta[property="og:title"]', PAGE_TITLE],
  ['meta[property="og:url"]', PAGE_OG_URL],
  ['meta[name="twitter:title"]', PAGE_TITLE],
  ['meta[name="twitter:description"]', PAGE_DESCRIPTION],
];

const DiconoDiNoiPage = () => {
  useEffect(() => {
    const overrides: Array<[Element, string]> = [];
    for (const [selector, value] of STATIC_HEAD_OVERRIDES) {
      const el = document.head.querySelector(`${selector}:not([data-rh])`);
      if (el && el.getAttribute("content") !== value) {
        overrides.push([el, el.getAttribute("content") ?? ""]);
        el.setAttribute("content", value);
      }
    }
    return () => {
      for (const [el, original] of overrides) el.setAttribute("content", original);
    };
  }, []);

  return (

    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dicono di noi — Riconoscimenti e stampa | Amarea Cosmetics</title>
        <meta
          name="description"
          content="I riconoscimenti e la rassegna stampa di Amarea Cosmetics, spin-off UNIVPM: Start Cup Marche, GammaDonna FAB50, Make it Circular, ANSA e Il Messaggero."
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
          content="I riconoscimenti e la rassegna stampa di Amarea Cosmetics, spin-off UNIVPM: Start Cup Marche, GammaDonna FAB50, Make it Circular, ANSA e Il Messaggero."
        />

      </Helmet>
      <Navbar />

      <section className="relative overflow-hidden pt-40 pb-20 bg-[#F4EFE6] border-b border-[#E0DACE]">
        {/* Decorazioni botaniche esistenti del brand */}
        <motion.img
          src={petalSaffron}
          alt=""
          aria-hidden="true"
          className="absolute top-14 right-[8%] w-16 md:w-24 opacity-70 pointer-events-none select-none"
          animate={{ y: [0, -12, 0], rotate: [12, 20, 12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={flowerSaffronLilac}
          alt=""
          aria-hidden="true"
          className="absolute bottom-6 left-[6%] w-8 md:w-10 opacity-60 pointer-events-none select-none"
          animate={{ y: [0, 10, 0], rotate: [-24, -32, -24] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={flowerSaffronLilac}
          alt=""
          aria-hidden="true"
          className="absolute top-24 left-[14%] w-8 md:w-10 opacity-70 pointer-events-none select-none"
          animate={{ y: [0, -10, 0], rotate: [-8, 6, -8] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={flowerSaffronLilac}
          alt=""
          aria-hidden="true"
          className="absolute top-40 right-[28%] w-6 md:w-8 opacity-60 pointer-events-none select-none"
          animate={{ y: [0, 12, 0], rotate: [14, -6, 14] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={flowerSaffronLilac}
          alt=""
          aria-hidden="true"
          className="absolute bottom-16 left-[32%] w-7 md:w-9 opacity-60 pointer-events-none select-none hidden md:block"
          animate={{ y: [0, -9, 0], rotate: [-18, -4, -18] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={flowerSaffronLilac}
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 right-[16%] w-9 md:w-12 opacity-60 pointer-events-none select-none hidden md:block"
          animate={{ y: [0, 8, 0], rotate: [30, 38, 30] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-primary text-primary-foreground text-xs tracking-wide uppercase font-body font-bold px-5 py-2 rounded-full mb-6">
              DICONO DI NOI
            </span>
            <h1 className="sr-only">Dicono di noi</h1>
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
            className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-12"
          >
            Riconoscimenti
          </motion.h2>

          <ol className="max-w-3xl mb-24">
            {riconoscimenti.map((riconoscimento, i) => (
              <RiconoscimentoTimelineItem
                key={riconoscimento.titolo}
                riconoscimento={riconoscimento}
                index={i}
              />
            ))}
          </ol>

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

      <FooterSection />
    </div>
  );
};

export default DiconoDiNoiPage;
