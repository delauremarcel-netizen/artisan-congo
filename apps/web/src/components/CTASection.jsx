import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const CTASection = ({ data, loading }) => {
  const defaultCTA = [
    {
      id: 'default',
      title: "Élevez votre pratique professionnelle",
      description: "Rejoignez un cercle restreint d'artisans d'excellence. Développez votre réseau, accédez à des projets prestigieux et valorisez votre savoir-faire.",
      button_text: "Soumettre sa candidature",
      button_link: "/artisan-signup"
    }
  ];

  const sections = data?.length > 0 ? data : defaultCTA;

  return (
    <>
      {loading ? (
        <section className="py-24 md:py-32 bg-primary">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl text-center flex flex-col items-center">
            <Skeleton className="h-12 w-3/4 max-w-2xl bg-white/10 mb-6 rounded-md" />
            <Skeleton className="h-6 w-full max-w-xl bg-white/10 mb-12 rounded-md" />
            <Skeleton className="h-14 w-64 bg-white/10 rounded-md" />
          </div>
        </section>
      ) : (
        sections.map((section, index) => {
          const isDark = index % 2 === 0;
          return (
            <section 
              key={section.id} 
              className={`py-24 md:py-32 relative overflow-hidden ${isDark ? 'bg-primary' : 'bg-background border-y border-border'}`}
            >
              <div className="container mx-auto px-6 lg:px-8 relative z-10 max-w-4xl text-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className={`font-serif mb-6 leading-tight ${isDark ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {section.title}
                  </h2>
                  
                  {section.description && (
                    <p className={`text-lg font-light leading-relaxed mb-12 max-w-2xl mx-auto ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {section.description}
                    </p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild className={`btn-premium btn-premium-lg rounded-md text-sm tracking-wide uppercase w-full sm:w-auto ${isDark ? 'btn-premium-accent' : 'btn-premium-primary'}`}>
                      <Link to={section.button_link || "/"}>
                        {section.button_text}
                      </Link>
                    </Button>
                    
                    {isDark && (
                      <Button asChild variant="outline" className="h-14 px-8 text-sm tracking-wide uppercase rounded-md bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white w-full sm:w-auto font-medium transition-colors">
                        <Link to="/about">
                          Découvrir nos critères
                        </Link>
                      </Button>
                    )}
                  </div>
                </motion.div>
              </div>
            </section>
          );
        })
      )}
    </>
  );
};

export default CTASection;