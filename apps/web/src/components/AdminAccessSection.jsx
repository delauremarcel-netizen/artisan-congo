import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, Users, Activity, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AdminAccessSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Espace Réservé
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 text-balance">
                Espace Admin
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Accès sécurisé au tableau de bord administrateur. Gérez la plateforme, validez les profils et suivez les performances en temps réel.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-background p-2 rounded-lg shadow-sm border border-border/50 shrink-0 mt-1">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Gestion des artisans</h4>
                  <p className="text-sm text-muted-foreground">Validation des profils et modération des comptes.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-background p-2 rounded-lg shadow-sm border border-border/50 shrink-0 mt-1">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Suivi des demandes</h4>
                  <p className="text-sm text-muted-foreground">Supervision des devis et des mises en relation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-background p-2 rounded-lg shadow-sm border border-border/50 shrink-0 mt-1">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Analytics et performances</h4>
                  <p className="text-sm text-muted-foreground">Tableaux de bord détaillés et statistiques d'utilisation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Login Card */}
          <div className="lg:pl-12">
            <Card className="bg-card border-border/50 premium-shadow-hover rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <CardContent className="p-8 md:p-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">Connexion Administrateur</h3>
                <p className="text-muted-foreground mb-8">
                  Veuillez vous identifier pour accéder aux outils de gestion de la plateforme ArtisanCongo.
                </p>

                <Button asChild className="w-full h-14 text-base font-semibold rounded-xl bg-foreground text-background hover:bg-foreground/90 group smooth-transition">
                  <Link to="/admin/login">
                    Accéder à l'Admin
                    <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <div className="mt-6 flex items-center justify-center text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 mr-1.5" />
                  Connexion chiffrée et sécurisée
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AdminAccessSection;