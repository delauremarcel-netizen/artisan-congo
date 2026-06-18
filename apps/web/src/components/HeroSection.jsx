import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-background pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Plateforme N°1 au Congo
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-6 tracking-tight">
                Trouver un artisan <span className="text-primary relative whitespace-nowrap">
                  fiable
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="transparent" />
                  </svg>
                </span> rapidement
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Ne cherchez plus au hasard. Nous vous connectons avec les meilleurs professionnels qualifiés et vérifiés pour tous vos travaux à Brazzaville et Pointe-Noire.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button size="lg" asChild className="h-14 px-8 rounded-xl text-base bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                  <Link to="/artisans">
                    Trouver un artisan
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-xl text-base bg-white border-2 border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary transition-all">
                  <Link to="/about">Comment ça marche ?</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <img src="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?w=100&h=100&fit=crop&crop=faces" alt="Client satisfait" className="w-12 h-12 rounded-full border-2 border-white object-cover" loading="lazy" />
                  <img src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop&crop=faces" alt="Client satisfait" className="w-12 h-12 rounded-full border-2 border-white object-cover" loading="lazy" />
                  <img src="https://images.unsplash.com/photo-1523824922871-d6f2a5b8cae1?w=100&h=100&fit=crop&crop=faces" alt="Client satisfait" className="w-12 h-12 rounded-full border-2 border-white object-cover" loading="lazy" />
                  <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop&crop=faces" alt="Client satisfait" className="w-12 h-12 rounded-full border-2 border-white object-cover" loading="lazy" />
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                    +500
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-secondary mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    <span className="font-bold">+500 clients</span> satisfaits
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[500px] lg:h-[600px] w-full"
          >
            <div className="absolute right-0 top-0 w-[85%] h-[85%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-10 bg-muted">
              <img 
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200&auto=format&fit=crop" 
                alt="Artisan professionnel africain au travail" 
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            <div className="absolute left-0 bottom-0 w-[55%] h-[60%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-20 transform -translate-y-4 translate-x-4 bg-muted">
              <img 
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=800&auto=format&fit=crop" 
                alt="Client utilisant l'application ArtisanCongo sur smartphone" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            <div className="absolute -right-8 top-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"></div>
            <div className="absolute -left-8 bottom-1/4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;