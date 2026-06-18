import React from 'react';
import { motion } from 'framer-motion';

const PositioningSection = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Positionnement du site</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-8"></div>
          
          <h3 className="text-xl md:text-2xl font-medium text-foreground mb-6">
            ArtisanCongo – La référence pour trouver un artisan fiable au Congo
          </h3>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Notre plateforme se positionne comme le tiers de confiance indispensable entre les particuliers, les entreprises et les artisans qualifiés. Nous structurons le secteur informel en apportant transparence, sécurité et professionnalisme à chaque étape de vos projets de construction, rénovation ou dépannage.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PositioningSection;