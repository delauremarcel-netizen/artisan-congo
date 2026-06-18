import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const InterventionZonesSection = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Notre zone d'intervention</h2>
          <p className="text-lg text-muted-foreground">Nous opérons actuellement dans les deux principales villes du Congo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brazzaville */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-10 shadow-lg border border-border/50 text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <MapPin className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-foreground">Brazzaville</h3>
              <p className="text-muted-foreground text-lg font-medium">Capitale du Congo</p>
            </div>
          </motion.div>

          {/* Pointe-Noire */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-10 shadow-lg border border-border/50 text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-foreground">Pointe-Noire</h3>
              <p className="text-muted-foreground text-lg font-medium">Capitale économique</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InterventionZonesSection;