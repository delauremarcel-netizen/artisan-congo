import React from 'react';
import { Users, ThumbsUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const SocialProofSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Marcelle T.",
      rating: 5,
      text: "J'ai trouvé un plombier en urgence un dimanche. Intervention rapide, prix transparent et travail impeccable. Je recommande vivement ArtisanCongo."
    },
    {
      id: 2,
      name: "David K.",
      rating: 5,
      text: "Pour la rénovation de ma toiture, j'ai pu comparer plusieurs devis. L'artisan choisi était très professionnel et le suivi de la plateforme rassurant."
    },
    {
      id: 3,
      name: "Sarah M.",
      rating: 4,
      text: "Très bonne expérience pour des travaux d'électricité. L'artisan était ponctuel et a pris le temps de m'expliquer les normes de sécurité."
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Dynamic Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-background rounded-2xl p-8 text-center shadow-sm border border-border"
          >
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-4xl font-bold text-foreground mb-2">+500</h3>
            <p className="text-muted-foreground font-medium">Artisans vérifiés</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-background rounded-2xl p-8 text-center shadow-sm border border-border"
          >
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <ThumbsUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-4xl font-bold text-foreground mb-2">+1000</h3>
            <p className="text-muted-foreground font-medium">Clients satisfaits</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-background rounded-2xl p-8 text-center shadow-sm border border-border"
          >
            <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-2xl flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-4xl font-bold text-foreground mb-2">4.8/5</h3>
            <p className="text-muted-foreground font-medium">Note moyenne</p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="text-center mb-12">
          <h2 className="mb-4">Ils nous font confiance</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez les retours d'expérience de nos clients qui ont fait appel à nos artisans pour leurs projets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-2xl p-8 shadow-sm border border-border flex flex-col h-full"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} 
                  />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-8 flex-grow">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">Client vérifié</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SocialProofSection;