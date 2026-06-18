import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const jobOffers = [
  {
    id: 1,
    title: "Expert-Comptable",
    department: "Finance & Administration",
    location: "Brazzaville",
    description: "Nous recherchons un Expert-Comptable rigoureux pour superviser nos opérations financières, garantir la conformité fiscale et accompagner notre croissance en Afrique centrale.",
    requirements: [
      "Diplôme d'Expertise Comptable (DEC) ou équivalent",
      "Minimum 5 ans d'expérience en cabinet ou entreprise",
      "Maîtrise de la fiscalité congolaise (OHADA)"
    ]
  },
  {
    id: 2,
    title: "Développeur Full-Stack",
    department: "Technologie",
    location: "Pointe-Noire / Télétravail",
    description: "Rejoignez notre équipe technique pour concevoir et optimiser la plateforme ArtisanCongo. Vous travaillerez sur des défis d'architecture et d'expérience utilisateur.",
    requirements: [
      "Maîtrise de React, Node.js et des bases de données NoSQL",
      "Expérience avec les architectures cloud et API REST",
      "Sensibilité à l'UX/UI et à la performance web"
    ]
  },
  {
    id: 3,
    title: "Responsable Commercial",
    department: "Ventes & Partenariats",
    location: "Brazzaville",
    description: "Votre mission sera de développer notre réseau d'artisans partenaires et de nouer des relations stratégiques avec les entreprises locales du secteur BTP.",
    requirements: [
      "Excellentes compétences en négociation et communication",
      "Connaissance du marché de l'artisanat et du BTP",
      "Orienté résultats avec une forte capacité d'adaptation"
    ]
  }
];

const JobOffersSection = () => {
  return (
    <section className="bg-muted/30 py-20 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6"
          >
            Offres d'emploi – Rejoignez notre équipe
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Nous recrutons les meilleurs talents pour développer ArtisanCongo et transformer le secteur des services en Afrique centrale.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobOffers.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="bg-card rounded-2xl p-8 premium-shadow hover:premium-shadow-hover hover:-translate-y-1 smooth-transition border border-border/50 flex flex-col h-full"
            >
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {job.department}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{job.title}</h3>
                <div className="flex items-center text-muted-foreground text-sm font-medium">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {job.location}
                </div>
              </div>

              <p className="text-muted-foreground text-base leading-relaxed mb-6 flex-grow">
                {job.description}
              </p>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Prérequis</h4>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5 mr-2.5" />
                      <span className="leading-snug">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6 border-t border-border/50">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl font-semibold text-base group smooth-transition">
                  Postuler
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobOffersSection;