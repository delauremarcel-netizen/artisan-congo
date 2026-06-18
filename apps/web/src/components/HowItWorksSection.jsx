import React from 'react';
import { MessageSquare, UserCheck, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Vous décrivez votre besoin",
      description: "Expliquez-nous votre projet ou votre problème en quelques mots via notre formulaire ou sur WhatsApp.",
      icon: MessageSquare
    },
    {
      number: "2",
      title: "Nous sélectionnons un artisan fiable",
      description: "Notre équipe identifie le professionnel le plus qualifié et disponible pour votre demande spécifique.",
      icon: UserCheck
    },
    {
      number: "3",
      title: "Vous êtes mis en relation rapidement",
      description: "L'artisan vous contacte pour évaluer les travaux, vous proposer un devis et fixer une intervention.",
      icon: Zap
    },
    {
      number: "4",
      title: "Nous assurons le suivi du projet",
      description: "Nous restons à vos côtés jusqu'à la finalisation des travaux pour garantir votre entière satisfaction.",
      icon: ShieldCheck
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-6">Comment ça marche ?</h2>
          <p className="text-lg text-muted-foreground">
            Un processus simple et transparent pour vous garantir une intervention rapide et de qualité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-muted-foreground/20 z-0"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 relative shadow-sm">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-md">
                    {step.number}
                  </div>
                  <Icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;