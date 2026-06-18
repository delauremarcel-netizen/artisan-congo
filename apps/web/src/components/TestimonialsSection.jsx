import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialsSection = ({ testimonials, loading }) => {
  const defaultTestimonials = [
    {
      id: '1',
      customer_name: 'Marie Laurent',
      rating: 5,
      review_text: 'Un travail exceptionnel pour la rénovation de notre salon. Les délais ont été respectés et la qualité des finitions est irréprochable.'
    },
    {
      id: '2',
      customer_name: 'Jean-Pierre Ndongo',
      rating: 5,
      review_text: 'Intervention rapide et efficace. J\'ai particulièrement apprécié la transparence sur les coûts et les conseils avisés pour l\'entretien.'
    },
    {
      id: '3',
      customer_name: 'Sophie B.',
      rating: 4,
      review_text: 'Artisan très sérieux. La communication était fluide du début à la fin du projet. Le résultat final correspond parfaitement à nos attentes.'
    }
  ];

  const items = testimonials?.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 md:mb-24 md:flex md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="mb-4">Paroles de Clients</h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed">
              L'excellence de nos artisans témoignée par ceux qui leur ont fait confiance pour leurs projets.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-8 border border-border">
                <Skeleton className="w-24 h-4 mb-6" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-2/3 h-4 mb-8" />
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <Skeleton className="w-32 h-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-foreground font-light leading-relaxed mb-8">
                    "{testimonial.review_text}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4 border-t border-border pt-6 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-serif font-medium">
                    {testimonial.customer_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {testimonial.customer_name}
                    </p>
                    {testimonial.expand?.artisan_id && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Projet avec <span className="text-foreground/80">{testimonial.expand.artisan_id.name}</span>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;