import React from 'react';
import { CheckCircle, Zap, HeartHandshake as Handshake, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const FeaturesSection = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Artisans vérifiés",
      description: "Identité, qualifications et références contrôlées par nos équipes."
    },
    {
      icon: Zap,
      title: "Réponse rapide",
      description: "Mise en relation en moins de 24h pour vos urgences."
    },
    {
      icon: Handshake,
      title: "Accompagnement",
      description: "Un conseiller dédié suit votre projet du début à la fin."
    },
    {
      icon: ShieldCheck,
      title: "Paiement sécurisé",
      description: "Transactions protégées et devis transparents sans surprise."
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white group">
                  <CardContent className="p-8 flex flex-col items-start">
                    <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;