import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "@/assets/amarea-navbar-logo.png";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Home", href: "/#hero" },
  { label: "Chi Siamo", href: "/#chi-siamo" },
  { label: "Prodotti", href: "/#prodotti" },
  { label: "Team", href: "/#team" },
  { label: "Sostieni Amarea", href: "/sostieni-amarea" },
  { label: "Grow With Amarea", href: "/grow" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { count, openCart } = useCart();

  const handleNav = (href: string) => {
    setOpen(false);
    if (!href.startsWith("/#")) {
      // plain route navigation
      if (location.pathname !== href) {
        window.location.href = href;
      }
      return;
    }
    if (location.pathname !== "/" && href.startsWith("/#")) {
      window.location.href = href;
      return;
    }
    const hash = href.replace("/", "");
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        transform: "translateZ(0)",
        WebkitTransform: "translate3d(0,0,0)",
        willChange: "transform",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div className="mx-4 mt-4">
        <div className="bg-[#171717] rounded-full px-6 py-3 flex items-center justify-between shadow-lg">
          <Link to="/" className="flex items-center">
            <img src={logoImg} alt="Amarea Cosmetics" className="h-8 w-auto" />
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href)}
                  className="text-sm font-body font-medium text-primary-foreground hover:bg-primary-foreground/10 px-4 py-2 rounded-full transition-all duration-300"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="mailto:info@amareacosmetics.com?subject=Richiesta%20informazioni%20%E2%80%93%20Amarea%20Cosmetics"
              className="hidden md:block bg-primary text-primary-foreground font-body font-semibold text-sm px-6 py-2 rounded-full hover:scale-105 transition-transform duration-300"
            >
              Contattaci 🌸
            </a>

            <button
              onClick={openCart}
              aria-label={`Apri carrello${count > 0 ? ` (${count} articoli)` : ""}`}
              className="relative text-primary-foreground hover:bg-primary-foreground/10 p-2 rounded-full transition-colors"
            >
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {count}
                </span>
              )}
            </button>

            <button
              className="md:hidden text-primary-foreground"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Chiudi menu" : "Apri menu"}
              aria-expanded={open}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden mx-4 mt-2 bg-foreground/95 backdrop-blur-xl rounded-3xl overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-2 py-6">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-lg font-body font-medium text-primary-foreground/80 hover:text-primary-foreground px-6 py-2 rounded-full hover:bg-primary-foreground/10 transition-all"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
