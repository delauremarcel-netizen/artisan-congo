import React from 'react';
import { Users, Wrench, Diamond } from 'lucide-react';
import { motion } from 'framer-motion';

const AdvantagesSection = () => {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Pourquoi nous choisir ?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Une plateforme pensée pour créer de la valeur pour tous les acteurs du secteur artisanal.</p>
        </div>

        {/* 2+1 Layout to avoid generic 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Clients */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold mb-6 text-foreground">Pour les clients</h3>
            <ul className="space-y-4">
              {['Trouver rapidement un pro', 'Artisans vérifiés et notés', 'Accompagnement dédié', 'Service rapide et garanti'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="text-muted-foreground font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Artisans */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Wrench className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-6 text-foreground">Pour les artisans</h3>
            <ul className="space-y-4">
              {['Visibilité accrue en ligne', 'Demandes qualifiées', 'Développer votre activité', 'Support professionnel'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Promise - Full width spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-accent text-accent-foreground rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <Diamond className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Notre promesse</h3>
              <p className="text-white/90 text-lg leading-relaxed max-w-3xl">
                Nous nous engageons à élever les standards de l'artisanat au Congo en garantissant un suivi rigoureux, une transparence totale sur les prix et une qualité de service irréprochable à chaque étape de votre projet.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AdvantagesSection;