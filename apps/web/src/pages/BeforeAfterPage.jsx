import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Wallet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const mockTransformations = [
  {
    id: 1,
    title: 'Rénovation Complète Villa',
    type: 'Rénovation',
    location: 'Brazzaville, Bacongo',
    duration: '4 mois',
    budget: '25,000 €',
    artisan: 'Koffi B. (Top Artisan)',
    before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Construction R+1',
    type: 'Construction',
    location: 'Pointe-Noire, Mpita',
    duration: '8 mois',
    budget: '45,000 €',
    artisan: 'Construction Pro Sarl',
    before: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Extension Maison Familiale',
    type: 'Extension',
    location: 'Brazzaville, Talangaï',
    duration: '2 mois',
    budget: '12,000 €',
    artisan: 'Menuiserie & Co',
    before: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&auto=format&fit=crop'
  }
];

const BeforeAfterPage = () => {
  const [filter, setFilter] = useState('Tous');
  const types = ['Tous', 'Construction', 'Rénovation', 'Extension'];

  const filtered = filter === 'Tous' ? mockTransformations : mockTransformations.filter(t => t.type === filter);

  return (
    <div className="w-full bg-background pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header & Stats */}
        <div className="flex flex-col lg:flex-row gap-12 justify-between items-center mb-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Transformations réussies</h1>
            <p className="text-xl text-muted-foreground">
              Des fondations aux finitions, voyez les résultats concrets des projets gérés à distance via Artisan Congo.
            </p>
          </div>
          
          <div className="flex gap-6 bg-card premium-shadow p-6 rounded-2xl w-full lg:w-auto">
            <div>
              <p className="text-3xl font-extrabold text-primary">150+</p>
              <p className="text-sm text-muted-foreground font-medium">Projets livrés</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="text-3xl font-extrabold text-secondary">98%</p>
              <p className="text-sm text-muted-foreground font-medium">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {types.map(type => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              className="rounded-full font-medium"
              onClick={() => setFilter(type)}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Card className="bg-card border-none premium-shadow rounded-2xl overflow-hidden h-full flex flex-col">
                <div className="relative aspect-video w-full overflow-hidden flex">
                  {/* Before */}
                  <div className="w-1/2 relative h-full">
                    <img src={project.before} alt="Avant" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white px-2 py-1 text-xs font-bold rounded-md">Avant</div>
                  </div>
                  {/* After */}
                  <div className="w-1/2 relative h-full border-l-2 border-white">
                    <img src={project.after} alt="Après" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 text-xs font-bold rounded-md">Après</div>
                  </div>
                </div>
                
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg leading-tight">{project.title}</h3>
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2">
                      {project.type}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6 text-sm text-muted-foreground flex-grow">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {project.location}</div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Durée: {project.duration}</div>
                    <div className="flex items-center gap-2"><Wallet className="w-4 h-4" /> Budget: {project.budget}</div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <p className="text-sm font-medium text-foreground">Réalisé par {project.artisan}</p>
                    <ArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterPage;