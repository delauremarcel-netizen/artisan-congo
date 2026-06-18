import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, FileText, Image as ImageIcon, Send, MessageSquare, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockProjects } from '@/lib/diasporaMockData';

const LiveTrackingPage = () => {
  const project = mockProjects[0]; // Use first mock project for demo

  return (
    <div className="w-full bg-muted/30 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Suivi en temps réel (Démo)</h1>
          <p className="text-muted-foreground">Voici l'interface que vous verrez une fois votre projet lancé.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Timeline - Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card premium-shadow border-none rounded-2xl overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border/50 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{project.location}</p>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                    {project.progress}% Complété
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative pl-8 space-y-10 before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border before:to-border">
                  
                  {project.stages.map((stage, i) => {
                    const isCompleted = stage.status === 'Complété';
                    const isCurrent = stage.status === 'En cours';
                    
                    return (
                      <div key={i} className="relative">
                        <div className={`absolute left-[-2.6rem] w-8 h-8 rounded-full border-4 border-card flex items-center justify-center ${isCompleted ? 'bg-primary' : isCurrent ? 'bg-secondary' : 'bg-muted'}`}>
                          {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                          {isCurrent && <Clock className="w-4 h-4 text-white" />}
                        </div>
                        
                        <div className={`p-5 rounded-2xl border ${isCurrent ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}>
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-lg">{stage.name}</h4>
                            <span className="text-sm text-muted-foreground">{stage.date}</span>
                          </div>
                          
                          {isCurrent && (
                            <div className="mt-4">
                              <p className="text-sm text-foreground/80 mb-4">"Pose de la charpente terminée aujourd'hui. Nous commençons la couverture métallique demain matin." - {project.artisan_name}</p>
                              <div className="flex gap-2 mb-4">
                                <img src="https://images.unsplash.com/photo-1672524456904-b89440cf5ac9?w=150&h=150&fit=crop" className="w-20 h-20 rounded-lg object-cover" alt="Travaux" />
                                <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=150&h=150&fit=crop" className="w-20 h-20 rounded-lg object-cover" alt="Travaux 2" />
                                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-col text-muted-foreground cursor-pointer hover:bg-muted/80">
                                  <ImageIcon className="w-6 h-6 mb-1" />
                                  <span className="text-xs">+3</span>
                                </div>
                              </div>
                              <Button size="sm" className="w-full">Valider cette étape pour débloquer le paiement</Button>
                            </div>
                          )}
                          
                          {isCompleted && (
                            <div className="flex items-center text-sm text-primary font-medium mt-2">
                              <CheckCircle className="w-4 h-4 mr-2" /> Validé et payé
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Budget & Chat */}
          <div className="space-y-6">
            <Card className="bg-card premium-shadow border-none rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-secondary" /> Résumé Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Engagé</span>
                      <span className="font-bold">{project.budget_spent.toLocaleString()} €</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: `${(project.budget_spent / project.budget_initial) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm pt-3 border-t border-border">
                    <span className="text-muted-foreground">Budget Total</span>
                    <span className="font-bold">{project.budget_initial.toLocaleString()} €</span>
                  </div>
                  <Button variant="outline" className="w-full mt-2" asChild>
                    <Link to="/diaspora/budget">Voir le détail</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card premium-shadow border-none rounded-2xl flex flex-col h-[400px]">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Chef de Projet
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">KB</div>
                    <div className="bg-card border border-border rounded-2xl rounded-tl-none p-3 text-sm shadow-sm">
                      Bonjour, les matériaux pour la toiture ont été livrés ce matin.
                      <span className="block text-[10px] text-muted-foreground mt-1">10:45</span>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">Moi</div>
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-3 text-sm shadow-sm">
                      Super nouvelle, merci pour l'update. J'attends les photos de la pose.
                      <span className="block text-[10px] text-primary-foreground/70 mt-1">11:02</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-border bg-card">
                  <div className="relative">
                    <Input placeholder="Votre message..." className="pr-10 rounded-full" />
                    <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 rounded-full">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LiveTrackingPage;