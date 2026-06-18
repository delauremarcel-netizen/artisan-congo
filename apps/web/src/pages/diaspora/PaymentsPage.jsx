import React from 'react';
import DiasporaNav from './DiasporaNav.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

const PaymentsPage = () => {
  return (
    <div className="w-full bg-muted/30 min-h-screen pb-16">
      <DiasporaNav />
      <div className="container mx-auto px-4 max-w-7xl pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Paiements Sécurisés</h1>
          <Button className="rounded-full px-6 font-bold">Effectuer un paiement</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card border-none premium-shadow rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Le compte séquestre Artisan Congo</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Votre argent est en sécurité. Lorsque vous payez une étape, les fonds sont bloqués sur un compte neutre en Europe. L'artisan ne reçoit l'argent au Congo que lorsque vous avez validé le rapport photo de l'étape terminée. Zéro risque de disparition avec les fonds.
                </p>
                <div className="flex gap-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-8 opacity-50 grayscale" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/47/Wise_logo.svg" alt="Wise" className="h-8 opacity-50 grayscale" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 premium-shadow rounded-2xl">
              <CardHeader>
                <CardTitle>Structure type de paiement par étapes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { stage: "Démarrage / Fondations", pct: "30%", desc: "Achat matériaux initiaux" },
                    { stage: "Élévation / Murs", pct: "30%", desc: "Débloqué après validation fondations" },
                    { stage: "Toiture & Menuiserie", pct: "20%", desc: "Débloqué après validation murs" },
                    { stage: "Finitions & Remise clés", pct: "20%", desc: "Débloqué après inspection finale" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center p-4 border border-border rounded-xl">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center font-bold text-lg mr-4 shrink-0">
                        {step.pct}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{step.stage}</p>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
             <Card className="bg-primary text-primary-foreground border-none premium-shadow rounded-2xl sticky top-24">
              <CardContent className="p-8 text-center">
                <Lock className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Tranquillité d'esprit</h3>
                <p className="text-primary-foreground/80 text-sm mb-6">
                  Finis les envois Western Union risqués à la famille qui disparaissent. Payez directement, suivez la progression, libérez les fonds.
                </p>
                <Button variant="secondary" className="w-full font-bold">Lire nos CGV Financières</Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;