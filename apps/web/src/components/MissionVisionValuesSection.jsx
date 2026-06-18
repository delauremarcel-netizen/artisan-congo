import React from 'react';
import { Target, Eye, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const MissionVisionValuesSection = () => {
  const values = [
    "Confiance",
    "Professionnalisme",
    "Transparence",
    "Engagement",
    "Satisfaction client"
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Bento Grid Layout to avoid generic 3-card row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Mission - Spans 2 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Notre mission</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Faciliter la recherche et la mise en relation avec des artisans qualifiés au Congo. Nous nous engageons à simplifier vos démarches tout en garantissant des interventions de qualité, réalisées par des professionnels rigoureusement sélectionnés.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vision - 1 column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 flex flex-col gap-6 items-start">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Notre vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Devenir la plateforme numérique numéro 1 en Afrique centrale pour la valorisation des métiers de l'artisanat et la structuration du secteur.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Values - Full width bottom row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 lg:col-span-3"
          >
            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-8 md:p-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                <div className="flex items-center gap-6 lg:w-1/3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Nos valeurs</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:w-2/3 w-full">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MissionVisionValuesSection;