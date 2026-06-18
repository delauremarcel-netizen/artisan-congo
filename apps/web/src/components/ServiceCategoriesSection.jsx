import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceCategoriesSection = ({ categories, loading, onCategoryClick }) => {
  const defaultCategories = [
    { id: '1', category_name: 'Plomberie', description: 'Installations et réparations sanitaires d\'excellence.' },
    { id: '2', category_name: 'Électricité', description: 'Mise aux normes et systèmes domotiques avancés.' },
    { id: '3', category_name: 'Menuiserie', description: 'Création de meubles sur mesure et agencements.' },
    { id: '4', category_name: 'Maçonnerie', description: 'Gros œuvre, fondations et finitions parfaites.' },
    { id: '5', category_name: 'Peinture', description: 'Décoration intérieure et ravalement de façades.' },
    { id: '6', category_name: 'Climatisation', description: 'Installation et maintenance de systèmes thermiques.' }
  ];

  const items = categories?.length > 0 ? categories : defaultCategories;

  const getIcon = (name) => {
    const map = {
      'plomberie': Icons.Droplet,
      'électricité': Icons.Zap,
      'menuiserie': Icons.PenTool,
      'maçonnerie': Icons.Blocks,
      'peinture': Icons.Paintbrush,
      'climatisation': Icons.Wind,
      'construction': Icons.HardHat
    };
    if (!name) return Icons.Briefcase;
    for (const [key, Icon] of Object.entries(map)) {
      if (name.toLowerCase().includes(key)) return Icon;
    }
    return Icons.Briefcase;
  };

  return (
    <section className="premium-section bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="mb-4">Expertises Professionnelles</h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed">
              Sélectionnez la spécialité requise pour votre projet et accédez à une sélection des meilleurs profils.
            </p>
          </div>
          <Button variant="link" asChild className="hidden md:flex text-primary font-medium hover:no-underline group">
            <Link to="/artisans">
              Voir tous les services <ArrowUpRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="premium-card p-8 flex flex-col gap-6">
                <Skeleton className="w-10 h-10 rounded-md" />
                <div>
                  <Skeleton className="h-6 w-1/2 mb-3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))
          ) : (
            items.map((cat, index) => {
              const Icon = getIcon(cat.category_name);
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => onCategoryClick(cat.category_name)}
                  className="group relative bg-card rounded-2xl p-8 text-left border border-transparent hover:border-border transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl"
                >
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="mb-8">
                      <div className="w-10 h-10 rounded-md bg-muted text-muted-foreground flex items-center justify-center transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground mb-6">
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl mb-3 text-foreground font-serif">{cat.category_name}</h3>
                      {cat.description && (
                        <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-2">{cat.description}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Subtle background shift on hover */}
                  <div className="absolute inset-0 bg-muted/0 group-hover:bg-muted/30 transition-colors duration-500 -z-0"></div>
                  
                  <div className="absolute top-8 right-8 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Button asChild variant="outline" className="w-full h-12 text-sm font-medium rounded-md">
            <Link to="/artisans">Tous les services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceCategoriesSection;