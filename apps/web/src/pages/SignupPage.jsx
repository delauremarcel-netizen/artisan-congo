
import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, User, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/30">
      <header className="p-4 border-b bg-background">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à l'accueil
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Rejoignez Artisan Congo</h1>
            <p className="text-lg text-muted-foreground">Comment souhaitez-vous utiliser notre plateforme ?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/signup-client" className="group">
              <div className="h-full bg-card border-2 border-transparent p-8 rounded-2xl shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <User className="w-8 h-8 text-primary group-hover:text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Je suis un client</h2>
                <p className="text-muted-foreground">Je cherche des professionnels qualifiés pour réaliser mes travaux en toute sécurité.</p>
              </div>
            </Link>

            <Link to="/signup-artisan" className="group">
              <div className="h-full bg-card border-2 border-transparent p-8 rounded-2xl shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Hammer className="w-8 h-8 text-primary group-hover:text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Je suis un artisan</h2>
                <p className="text-muted-foreground">Je souhaite proposer mes services, trouver de nouveaux chantiers et développer mon activité.</p>
              </div>
            </Link>
          </div>

          <div className="mt-10 text-center text-sm">
            <p className="text-muted-foreground">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
