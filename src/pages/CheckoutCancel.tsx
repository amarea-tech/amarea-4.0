import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const CheckoutCancel = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Pagamento annullato | Amarea Cosmetics</title>
      <meta name="description" content="Il pagamento è stato annullato. Il tuo carrello è ancora disponibile." />
      <meta name="robots" content="noindex" />
    </Helmet>
    <Navbar />
    <main className="pt-36 pb-24 container mx-auto px-6 max-w-xl text-center">
      <XCircle className="mx-auto mb-6 text-muted-foreground" size={56} />
      <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-4">
        Pagamento annullato
      </h1>
      <p className="font-body text-muted-foreground mb-10">
        Nessun addebito è stato effettuato. Il tuo carrello è ancora al suo posto.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/checkout"
          className="bg-foreground text-primary-foreground font-body font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
        >
          Riprova il checkout
        </Link>
        <Link
          to="/#prodotti"
          className="border border-border text-foreground font-body font-bold px-8 py-4 rounded-full hover:bg-card transition-colors"
        >
          Torna ai prodotti
        </Link>
      </div>
    </main>
    <FooterSection />
  </div>
);

export default CheckoutCancel;
