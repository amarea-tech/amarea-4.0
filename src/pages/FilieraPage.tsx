import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import logoMercante from "@/assets/filiera-logo-mercante.png.asset.json";
import logoTesoroDelleApi from "@/assets/filiera-logo-tesoro-delle-api.png.asset.json";
import logoOlinda from "@/assets/filiera-logo-olinda.png.asset.json";

type Partner = {
  name: string;
  luogo: string;
  sottoprodotto: string;
  storia: string;
  link?: string;
  logo?: { src: string; alt: string };
};

const partners: Partner[] = [
  {
    name: "Azienda Agricola Oriano Mercante",
    luogo: "Camerano (AN)",
    sottoprodotto: "Vinacce",
    storia:
      "A Camerano, nelle terre del Conero, Oriano e Adriana Mercante coltivano il proprio vigneto con metodo biologico. La famiglia di Adriana fa vino da generazioni e produce Rosso Conero dal 1956. La loro idea è semplice: un vino il più naturale e il meno lavorato possibile.",
    link: "https://www.rossoconero.it",
    logo: { src: logoMercante.url, alt: "Logo Azienda Agricola Oriano Mercante" },
  },
  {
    name: "Zafferano Metelis – Azienda Agricola Gentilucci Riccardo",
    luogo: "Matelica (MC)",
    sottoprodotto: "Tepali di zafferano",
    storia:
      "Ai piedi del Monte San Vicino, Zafferano Metelis ha riportato in vita una coltura che qui era andata perduta. Nel 2016 un gruppo di giovani, partendo da atti notarili del Quattrocento che ne documentano il commercio, ha ripreso a coltivare lo zafferano. Il lavoro si svolge a mano, fiore per fiore.",
  },
  {
    name: "Il Tesoro delle Api",
    luogo: "Sant'Elpidio a Mare (FM)",
    sottoprodotto: "Tepali di zafferano",
    storia:
      "Il Tesoro delle Api nasce da oltre quarant'anni di passione per l'apicoltura, che Rossano ha ereditato dal nonno e oggi trasmette ai figli. Ai mieli premiati al concorso \"Premio qualità miele marchigiano\" ha affiancato la coltivazione dello zafferano. L'azienda accoglie anche scolaresche e appassionati nel suo apiario sensoriale.",
    logo: { src: logoTesoroDelleApi.url, alt: "Logo Il Tesoro delle Api" },
  },
  {
    name: "Frantoio L'Olinda",
    luogo: "San Marcello (AN)",
    sottoprodotto: "Foglie di olivo",
    storia:
      "Nata nel 2003, L'Olinda coltiva circa 100 ettari di oliveti biologici tra le province di Ancona e Macerata, dal Conero al Monte San Vicino. Il suo impegno è recuperare le varietà autoctone marchigiane e seguire l'intera filiera, dalla pianta alla bottiglia.",
    link: "https://www.lolinda.it",
    logo: { src: logoOlinda.url, alt: "Logo Frantoio L'Olinda" },
  },
];

const PartnerCard = ({ partner, index }: { partner: Partner; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
    className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col"
  >
    <div className="bg-white border-b border-border/60 flex items-center justify-center px-10 py-8 h-44">
      {partner.logo ? (
        <img
          src={partner.logo.src}
          alt={partner.logo.alt}
          className="max-h-28 w-auto max-w-full object-contain"
          loading="lazy"
        />
      ) : (
        <span className="font-display text-2xl md:text-3xl font-bold text-foreground text-center leading-snug">
          Zafferano Metelis
        </span>
      )}
    </div>

    <div className="p-8 flex flex-col flex-1">
      <span className="self-start inline-block bg-primary/10 text-primary text-xs tracking-wide uppercase font-body font-bold px-4 py-1.5 rounded-full mb-4">
        {partner.sottoprodotto}
      </span>
      <h3 className="font-display text-2xl font-bold text-foreground mb-2 leading-snug">{partner.name}</h3>
      <p className="font-body text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
        <MapPin size={14} className="text-primary shrink-0" />
        {partner.luogo}
      </p>
      <p className="font-body text-muted-foreground leading-relaxed flex-1">{partner.storia}</p>
      {partner.link && (
        <a
          href={partner.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 mt-6 font-body font-semibold text-primary hover:text-primary/80 transition-colors w-fit"
        >
          Visita il sito
          <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </a>
      )}
    </div>
  </motion.article>
);

const FilieraPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Filiera — Le eccellenze marchigiane che collaborano con noi | Amarea Cosmetics</title>
        <meta
          name="description"
          content="Le aziende agricole marchigiane che forniscono le materie prime di Amarea Cosmetics: vinacce, tepali di zafferano e foglie di olivo da una filiera tracciata e vicina a noi."
        />
        <link rel="canonical" href="https://amareacosmetics.com/filiera" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amareacosmetics.com/filiera" />
        <meta property="og:title" content="Filiera — Le eccellenze marchigiane che collaborano con noi | Amarea Cosmetics" />
        <meta
          property="og:description"
          content="Dietro la nostra ricerca ci sono persone, terre e saperi delle Marche."
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
              Filiera
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Le eccellenze marchigiane che collaborano con noi
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed">
              Dietro la nostra ricerca ci sono persone, terre e saperi.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl font-body text-lg text-muted-foreground leading-relaxed mb-14 space-y-5"
          >
            <p>
              Amarea vuole valorizzare le eccellenze del territorio italiano, costruendo una nuova geografia
              cosmetica del Made in Italy. Con Terre di Amarea, ogni regione può diventare protagonista di una
              linea di prodotti fondata sulla ricerca, attraverso le proprie filiere e specificità botaniche.
            </p>
            <p>
              Abbiamo scelto di iniziare dalle Marche, la terra in cui Amarea è nata. Queste sono le aziende
              agricole che collaborano con noi per la linea Marche di Terre di Amarea: con loro diamo nuovo
              valore a ciò che resta dalle lavorazioni, e vinacce, tepali di zafferano e foglie di olivo
              diventano materia prima per la ricerca cosmetica.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner, i) => (
              <PartnerCard key={partner.name} partner={partner} index={i} />
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
              Costruiamo insieme una cosmetica circolare
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Sei un'azienda agricola marchigiana e vuoi dare nuovo valore ai tuoi sottoprodotti? Scrivici.
            </p>
            <a
              href="mailto:info@amareacosmetics.com?subject=Proposta%20di%20collaborazione%20%E2%80%93%20Amarea%20Cosmetics"
              className="group inline-flex items-center gap-3 bg-primary text-primary-foreground font-body font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-all duration-300"
            >
              Contattaci per collaborare
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
              />
            </a>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default FilieraPage;
