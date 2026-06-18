import React, { useState, useEffect } from 'react';
import { ArtisanDashboardLayout } from '@/components/artisan/ArtisanDashboardLayout.jsx';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    bio: '',
    experience_years: 0,
    city: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        whatsapp: currentUser.whatsapp || '',
        bio: currentUser.bio || '',
        experience_years: currentUser.experience_years || 0,
        city: currentUser.city || ''
      });
    }
  }, [currentUser]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await pb.collection('artisans').update(currentUser.id, formData, { $autoCancel: false });
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ArtisanDashboardLayout>
      <SEOHead title="Mon Profil | ArtisanCongo" />
      
      <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations publiques et vos paramètres.</p>
        </div>

        <Tabs defaultValue="infos" className="w-full">
          <TabsList className="w-full h-auto flex-wrap bg-muted/50 p-1 rounded-xl justify-start mb-6">
            <TabsTrigger value="infos" className="rounded-lg">Informations</TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg">Services</TabsTrigger>
            <TabsTrigger value="dispo" className="rounded-lg">Disponibilité</TabsTrigger>
            <TabsTrigger value="charte" className="rounded-lg">Charte Qualité</TabsTrigger>
          </TabsList>

          <TabsContent value="infos" className="space-y-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nom complet / Entreprise</Label>
                    <Input 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville d'intervention</Label>
                    <Input 
                      value={formData.city} 
                      onChange={e => setFormData({...formData, city: e.target.value})} 
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input 
                      value={formData.whatsapp} 
                      onChange={e => setFormData({...formData, whatsapp: e.target.value})} 
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Bio professionnelle</Label>
                    <Textarea 
                      value={formData.bio} 
                      onChange={e => setFormData({...formData, bio: e.target.value})} 
                      className="min-h-[120px] bg-background"
                      placeholder="Décrivez votre expérience et vos spécialités..."
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-border">
                  <Button onClick={handleSave} disabled={saving} className="px-8">
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card className="dashboard-card">
              <CardContent className="p-12 text-center text-muted-foreground">
                Gestion des services en cours de développement.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dispo">
            <Card className="dashboard-card">
              <CardContent className="p-12 text-center text-muted-foreground">
                Gestion des disponibilités en cours de développement.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charte">
            <Card className="dashboard-card">
              <CardContent className="p-12 text-center text-muted-foreground">
                Charte qualité en cours de développement.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ArtisanDashboardLayout>
  );
};

export default ProfilePage;