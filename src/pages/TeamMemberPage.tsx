import { Button } from "@/components/ui/button";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { teamMembers } from "@/data/teamData";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const TeamMemberPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-4">Membro non trovato</h1>
          <Link to="/#team" className="text-primary hover:underline font-body">
            ← Torna al team
          </Link>
        </div>
      </div>
    );
  }

  const bioparagraphs = member.fullBio.split("\n\n");
  const seoDesc = `${member.name}, ${member.role} in Amarea Cosmetics — ${member.title}. ${member.shortBio}`.slice(0, 300);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${member.name} — ${member.role} | Team Amarea Cosmetics`}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={`https://amareacosmetics.com/team/${slug}`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`https://amareacosmetics.com/team/${slug}`} />
        <meta property="og:title" content={`${member.name} — ${member.role} | Amarea Cosmetics`} />
        <meta property="og:description" content={seoDesc} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: member.name,
            jobTitle: member.role,
            description: member.title,
            worksFor: { "@type": "Organization", name: "Amarea Cosmetics", url: "https://amareacosmetics.com/" },
            url: `https://amareacosmetics.com/team/${slug}`,
            ...(member.email ? { email: member.email } : {}),
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://amareacosmetics.com/" },
              { "@type": "ListItem", position: 2, name: "Team", item: "https://amareacosmetics.com/#team" },
              { "@type": "ListItem", position: 3, name: member.name, item: `https://amareacosmetics.com/team/${slug}` },
            ],
          })}
        </script>
      </Helmet>
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button variant="ghost"
              onClick={() => navigate("/#team")}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-body text-sm font-medium transition-colors mb-10"
            >
              <ArrowLeft className="w-4 h-4" />
              Torna al team
            </Button>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="shrink-0"
            >
              <img
                src={member.image}
                alt={`${member.name} — ${member.role}, Amarea Cosmetics`}
                className="w-48 h-48 md:w-56 md:h-56 rounded-3xl object-cover shadow-lg border-2 border-primary/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              <span className="inline-block bg-soft text-soft-foreground font-body text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
                {member.role}
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-semibold text-foreground mb-2">
                {member.name}
              </h1>
              <p className="font-body text-muted-foreground text-base md:text-lg mb-2">
                {member.title}
              </p>
              <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed mt-6 mb-2">
                {member.desc}
              </p>
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="inline-block mt-4 font-body text-primary hover:underline text-sm md:text-base font-semibold"
                >
                  {member.email}
                </a>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 border-t border-border pt-10"
          >
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Profilo completo</h2>
            <div className="space-y-5">
              {bioparagraphs.map((p, i) => (
                <p key={i} className="font-body text-muted-foreground text-base leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default TeamMemberPage;
