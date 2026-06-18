import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockTestimonials } from '@/lib/diasporaMockData';

// Generate more mock data for the grid
const extendedTestimonials = [
  ...mockTestimonials,
  {
    id: 4, name: 'Lucie B.', country: 'Belgique', project: 'Construction R+1',
    quote: "J'ai pu suivre l'élévation des murs jour après jour grâce aux photos sur mon dashboard. Une expérience incroyable.",
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'
  },
  {
    id: 5, name: 'Alain K.', country: 'France', project: 'Finition Villa',
    quote: "Le système de paiement bloqué m'a donné la confiance nécessaire pour investir. L'artisan a fait un travail remarquable.",
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79'
  },
  {
    id: 6, name: 'Chantal E.', country: 'Canada', project: 'Rénovation Cuisine',
    quote: "Communication fluide malgré le décalage horaire. Le chef de projet sur place s'occupe de tout.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  }
];

const TestimonialsPage = () => {
  const [filter, setFilter] = useState('Tous');
  const countries = ['Tous', 'France', 'Canada', 'USA', 'Belgique'];

  const filtered = filter === 'Tous' ? extendedTestimonials : extendedTestimonials.filter(t => t.country === filter);

  return (
    <div className="w-full bg-background pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Histoires de diaspora</h1>
          <p className="text-xl text-muted-foreground">
            Découvrez comment vos compatriotes ont réussi leurs projets immobiliers au pays sans stress.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {countries.map(c => (
            <Button
              key={c}
              variant={filter === c ? 'default' : 'outline'}
              className="rounded-full font-medium"
              onClick={() => setFilter(c)}
            >
              {c === 'Tous' ? 'Tous les pays' : `Depuis ${c}`}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card border-none premium-shadow rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex text-secondary mb-6">
                    {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">{t.project}</h3>
                  <p className="text-muted-foreground mb-8 flex-grow">"{t.quote}"</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                      <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-sm text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {t.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center bg-muted/50 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Vous avez un projet en tête ?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Rejoignez ces clients satisfaits et lancez votre projet avec la garantie de l'excellence.</p>
          <Button size="lg" className="rounded-full px-8 font-bold">Démarrer mon projet</Button>
        </div>

      </div>
    </div>
  );
};

export default TestimonialsPage;