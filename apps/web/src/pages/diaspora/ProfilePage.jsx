import React from 'react';
import DiasporaNav from './DiasporaNav.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ProfilePage = () => {
  return (
    <div className="w-full bg-muted/30 min-h-screen pb-16">
      <DiasporaNav />
      <div className="container mx-auto px-4 max-w-3xl pt-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Mon Profil</h1>
        
        <div className="space-y-8">
          <Card className="bg-card border-border/50 premium-shadow rounded-2xl">
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Prénom & Nom</Label>
                  <Input defaultValue="Jean-Baptiste L." className="bg-background text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Pays de résidence</Label>
                  <Input defaultValue="France" className="bg-background text-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <Input defaultValue="jean.baptiste@example.com" type="email" className="bg-background text-foreground" />
              </div>
              <Button className="mt-2">Enregistrer les modifications</Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 premium-shadow rounded-2xl">
            <CardHeader>
              <CardTitle>Préférences de Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Rapports de chantier hebdomadaires</p>
                  <p className="text-sm text-muted-foreground">Recevoir un email avec les photos chaque vendredi.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Alertes de paiement (SMS)</p>
                  <p className="text-sm text-muted-foreground">Être notifié quand une étape nécessite validation.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;