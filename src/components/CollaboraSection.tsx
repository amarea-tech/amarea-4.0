import { Leaf, Microscope, Handshake, Mail } from "lucide-react";
import { motion } from "framer-motion";
import petalSaffronLilac from "@/assets/petal-saffron-lilac.png";
import flowerSaffronLilac from "@/assets/flower-saffron-lilac.png";
import leafSage from "@/assets/leaf-sage.png";

const cards = [
  {
    icon: Leaf,
    title: "Aziende",
    text: "Valorizziamo bioresidui agroalimentari trasformandoli in ingredienti cosmetici innovativi.",
  },
  {
    icon: Microscope,
    title: "Università e centri di ricerca",
    text: "Collaboriamo su ricerca, validazione scientifica e sviluppo tecnologico.",
  },
  {
    icon: Handshake,
    title: "Partner e investitori",
    text: "Supportiamo la crescita di una cosmetica circolare basata su ricerca, territorio e innovazione.",
  },
];

const botanicals = [
  // Lilac flower petals (saffron-inspired)
  { src: petalSaffronLilac, side: "left", top: "10%", size: 70, rotation: -18, delay: 0, duration: 22, opacity: 0.35 },
  { src: petalSaffronLilac, side: "left", top: "70%", size: 58, rotation: 22, delay: 1.4, duration: 26, opacity: 0.3 },
  { src: petalSaffronLilac, side: "right", top: "40%", size: 64, rotation: -28, delay: 0.8, duration: 24, opacity: 0.32 },
  // Complete stylized flowers
  { src: flowerSaffronLilac, side: "left", top: "42%", size: 88, rotation: 12, delay: 0.5, duration: 28, opacity: 0.28 },
  { src: flowerSaffronLilac, side: "right", top: "82%", size: 76, rotation: -8, delay: 1.8, duration: 30, opacity: 0.3 },
  // Sage green leaf accents
  { src: leafSage, side: "left", top: "22%", size: 64, rotation: -12, delay: 1.1, duration: 26, opacity: 0.45 },
  { src: leafSage, side: "right", top: "12%", size: 58, rotation: 18, delay: 0.3, duration: 24, opacity: 0.4 },
  { src: leafSage, side: "right", top: "62%", size: 52, rotation: -22, delay: 2.0, duration: 28, opacity: 0.4 },
];

const CollaboraSection = () => {
  return (
    <section id="collabora" className="relative overflow-hidden border-t border-[#E0DACE] bg-[#F4EFE6] scroll-mt-24 md:scroll-mt-28">
      <div className="absolute inset-0 pointer-events-none z-0">
        {botanicals.map((p, i) => (
          <motion.img
            key={i}
            src={p.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            loading="lazy"
            decoding="async"
            className="absolute select-none"
            style={{
              [p.side]: "1.5rem",
              top: p.top,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
            initial={{ y: 0, rotate: p.rotation }}
            animate={{ y: [0, -10, 0, 8, 0], rotate: [p.rotation, p.rotation + 4, p.rotation - 2, p.rotation] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-[#5A6157]">
            Collabora con noi
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[#1F2520]">
            Costruiamo insieme una<br />cosmetica circolare
          </h2>
          <p className="mt-6 font-body text-base md:text-lg text-[#5A6157] leading-relaxed">
            Crediamo nella forza delle collaborazioni per trasformare la ricerca in soluzioni sostenibili e innovative.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white border border-[#D9CFBE] rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_8px_24px_-12px_rgba(120,90,50,0.18)] hover:border-[#A8B89A] hover:shadow-[0_12px_28px_-12px_rgba(120,90,50,0.22)] transition-all"
            >
              <span className="flex-shrink-0 w-[68px] h-[68px] rounded-full border border-[#1F2520]/50 text-[#1F2520] flex items-center justify-center mb-6 mx-auto">
                <Icon size={28} strokeWidth={1.2} />
              </span>
              <h3 className="font-display text-2xl text-[#1F2520] leading-tight">
                {title}
              </h3>
              <p className="mt-3 font-body text-sm text-[#5A6157] leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="mailto:info@amareacosmetics.com?subject=Proposta%20di%20collaborazione%20%E2%80%93%20Amarea%20Cosmetics"
            className="inline-flex items-center justify-center gap-2 bg-[#1F2520] text-[#F4EFE6] font-body font-medium text-sm px-7 py-3 rounded-full hover:bg-[#2A312A] transition-colors"
          >
            <Mail size={15} strokeWidth={1.8} />
            Contattaci per collaborare
          </a>
        </div>
      </div>
    </section>
  );
};

export default CollaboraSection;