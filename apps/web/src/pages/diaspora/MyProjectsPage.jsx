import React from 'react';
import DiasporaNav from './DiasporaNav.jsx';
import { mockProjects } from '@/lib/diasporaMockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyProjectsPage = () => {
  return (
    <div className="w-full bg-muted/30 min-h-screen pb-16">
      <DiasporaNav />
      <div className="container mx-auto px-4 max-w-7xl pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mes Projets</h1>
          <Button className="rounded-full">Nouveau Projet</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map(project => (
            <Card key={project.id} className="bg-card border-border/50 premium-shadow rounded-2xl overflow-hidden flex flex-col">
              <div className="relative aspect-video">
                <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold">
                  {project.status}
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {project.location}</p>
                  <p className="flex items-center gap-2"><Wallet className="w-4 h-4"/> {project.budget_spent.toLocaleString()} / {project.budget_initial.toLocaleString()} €</p>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span>Avancement</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                <Button variant="outline" className="w-full rounded-xl" asChild>
                  <Link to="/suivi-live">Voir les détails <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProjectsPage;