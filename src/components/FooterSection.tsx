import { Instagram, Linkedin } from "lucide-react";
import logoImg from "@/assets/amarea-footer-logo.png";

const FooterSection = () => {
  return (
    <>
      <div className="dark-surface bg-surface-dark py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="font-display text-lg font-semibold text-primary-foreground/20 flex items-center gap-8">
              AMAREA COSMETICS <span className="text-soft">✦</span> NATURAL BEAUTY <span className="text-soft">✦</span> SCIENZA & NATURA <span className="text-soft">✦</span>
            </span>
          ))}
        </div>
      </div>

      <footer className="py-16 dark-surface bg-surface-dark">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div className="flex flex-col gap-4">
              <img src={logoImg} alt="Amarea Cosmetics" className="h-8 w-auto object-contain" />
              <p className="font-body text-sm text-primary-foreground/80 leading-relaxed">
                Spin-off accademico dell'Università Politecnica delle Marche
              </p>
            </div>

            <div className="font-body text-sm text-primary-foreground/80 leading-relaxed">
              <p className="font-semibold text-primary-foreground">Amarea Cosmetics S.r.l.</p>
              <p className="mt-2">
                Università Politecnica delle Marche,<br />
                Via Brecce Bianche, Ancona, Italia
              </p>
              <p className="mt-2">
                <a
                  href="mailto:info@amareacosmetics.com"
                  className="hover:text-soft transition-colors"
                >
                  info@amareacosmetics.com
                </a>
              </p>
            </div>

            <div className="flex md:justify-end items-center gap-4">
              <a
                href="mailto:info@amareacosmetics.com"
                className="font-body text-sm text-primary-foreground hover:text-soft transition-colors px-4 py-2 rounded-full border border-primary-foreground/10 hover:border-primary/30"
              >
                Scrivici
              </a>
              <a
                href="https://www.instagram.com/amareacosmetics?igsh=ZWI1b3hiamNxczAx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-primary-foreground hover:text-soft transition-colors p-2 rounded-full border border-primary-foreground/10 hover:border-primary/30"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/amareacosmetics/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-primary-foreground hover:text-soft transition-colors p-2 rounded-full border border-primary-foreground/10 hover:border-primary/30"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-primary-foreground/10 text-center">
            <p className="font-body text-xs text-primary-foreground/60">
              © {new Date().getFullYear()} Amarea Cosmetics S.r.l. — Tutti i diritti riservati
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterSection;
