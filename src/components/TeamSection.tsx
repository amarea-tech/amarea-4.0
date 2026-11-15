import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { teamMembers } from "@/data/teamData";

const TeamSection = () => {
  const flowers = ["🌸", "🌼", "🌺", "🌷", "🌻", "💮", "🌹", "🏵️", "💐"];
  return (
    <section id="team" className="py-24 md:py-32 bg-muted relative overflow-hidden">


      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="section-label mb-6">
              Il nostro team
            </span>
          <h2 className="font-display text-4xl md:text-6xl font-semibold text-card-foreground">
             Esperti al servizio dell'<span className="heading-emphasis">innovazione</span>
          </h2>
           <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
             Un team di ricercatori impegnati nello sviluppo di formulazioni cosmetiche naturali ed ecosostenibili
           </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link
                to={`/team/${member.slug}`}
                className="group flex flex-col bg-background rounded-3xl p-6 card-hover shadow-card border border-border hover:border-primary/30 transition-all h-full"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative shrink-0">
                    <img
                      src={member.image}
                      alt={`${member.name} — ${member.role}, Amarea Cosmetics`}
                      className="w-16 h-16 rounded-2xl object-cover group-hover:rounded-full transition-all duration-500"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center text-[14px] leading-none opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                      <span aria-hidden="true">{flowers[i % flowers.length]}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{member.name}</h3>
                    <p className="font-body text-xs text-primary font-semibold tracking-wide">{member.role}</p>
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-body text-xs text-primary hover:underline font-semibold break-all"
                      >
                        {member.email}
                      </a>
                    )}
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1">{member.shortBio}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
