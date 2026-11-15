import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import petalSaffron from "@/assets/petal-saffron-lilac.png";
import petalLavender from "@/assets/petal-lavender.png";

interface Petal {
  id: number;
  src: string;
  x: string;
  y: string;
  size: number;
  rotation: number;
  delay: number;
}

const petals: Petal[] = [
  { id: 1, src: petalSaffron, x: "10%", y: "20%", size: 60, rotation: 15, delay: 0 },
  { id: 2, src: petalLavender, x: "85%", y: "15%", size: 50, rotation: -30, delay: 0.5 },
  { id: 3, src: petalSaffron, x: "75%", y: "70%", size: 45, rotation: 45, delay: 1 },
  { id: 4, src: petalLavender, x: "15%", y: "75%", size: 55, rotation: -15, delay: 1.5 },
  { id: 5, src: petalSaffron, x: "50%", y: "10%", size: 40, rotation: 60, delay: 0.3 },
  { id: 6, src: petalLavender, x: "90%", y: "50%", size: 48, rotation: -45, delay: 0.8 },
  { id: 7, src: petalSaffron, x: "5%", y: "50%", size: 42, rotation: 30, delay: 1.2 },
  { id: 8, src: petalLavender, x: "60%", y: "85%", size: 52, rotation: -60, delay: 0.6 },
];

const FloatingPetals = () => {
  const [spins, setSpins] = useState<Record<number, number>>({});
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleClick = (id: number) => {
    setSpins((prev) => ({ ...prev, [id]: (prev[id] || 0) + 720 }));
  };

  const visiblePetals = isMobile ? petals.slice(0, 4) : petals;

  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      {visiblePetals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute pointer-events-auto cursor-pointer"
          style={{ left: petal.x, top: petal.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.7,
            scale: 1,
            y: [0, -15, 0, 10, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: petal.delay },
            scale: { duration: 0.8, delay: petal.delay },
            y: { duration: 6 + petal.id, repeat: Infinity, ease: "easeInOut" },
          }}
          whileHover={{ opacity: 1, scale: 1.2 }}
          onClick={() => handleClick(petal.id)}
        >
          <motion.img
            src={petal.src}
            alt=""
            className="select-none drop-shadow-lg"
            style={{ width: petal.size, height: petal.size }}
            animate={{ rotate: (spins[petal.id] || 0) + petal.rotation }}
            transition={{ type: "spring", stiffness: 60, damping: 12 }}
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingPetals;
