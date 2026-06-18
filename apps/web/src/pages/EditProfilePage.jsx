import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const CATEGORIES = [
  'Plomberie', 'Menuiserie', 'Électricité', 'Maçonnerie', 'Peinture',
  'Soudure', 'Réparation Auto', 'Construction', 'Paysagisme', 'Carrelage',
  'Couverture', 'Serrurerie', 'Climatisation', 'Plomberie Sanitaire',
  'Électricité Industrielle', 'Charpenterie', 'Vitrerie', 'Chauffage',
  'Isolation', 'Démolition', 'Terrassement', 'Béton', 'Ferronnerie',
  'Plâtrerie', 'Décoration Intérieure'
];

const CITIES = ['Pointe-Noire', 'Brazzaville', 'Kinshasa', 'Lubumbashi', 'Kolwezi'];

const EditProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    category: '',
    city: '',
    bio: '',
    experience_years: '',
    services_offered: '',
    phone: ''
  });

  useEffect(() => {
    if (currentUser?.id) {
      fetchProfile();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const profiles = await pb.collection('artisan_profiles').getFullList({
        filter: `artisan_id = "${currentUser.id}"`,
        $autoCancel: false
      });

      if (profiles.length > 0) {
        const profile = profiles[0];
        setProfileData({
          name: profile.name || '',
          category: profile.category || '',
          city: profile.city || '',
          bio: profile.bio || '',
          experience_years: profile.experience_years || '',
          services_offered: profile.services_offered || '',
          phone: profile.phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileData.name || !profileData.category) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    setIsSaving(true);
    try {
      const profiles = await pb.collection('artisan_profiles').getFullList({
        filter: `artisan_id = "${currentUser.id}"`,
        $autoCancel: false
      });

      if (profiles.length > 0) {
        await pb.collection('artisan_profiles').update(profiles[0].id, profileData, {
          $autoCancel: false
        });
      } else {
        await pb.collection('artisan_profiles').create({
          ...profileData,
          artisan_id: currentUser.id,
          profile_visibility: 'visible'
        }, { $autoCancel: false });
      }

      toast.success('Profil mis à jour avec succès');
      navigate('/artisan/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Modifier mon profil</h1>

        <Card>
          <CardHeader>
            <CardTitle>Informations du profil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Votre nom complet"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select value={profileData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Select value={profileData.city} onValueChange={(value) => handleChange('city', value)}>
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+242 XX XXX XXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Années d'expérience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={profileData.experience_years}
                    onChange={(e) => handleChange('experience_years', e.target.value)}
                    placeholder="Ex: 5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Parlez de vous, votre expérience, vos compétences..."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="services">Services offerts</Label>
                <Textarea
                  id="services"
                  value={profileData.services_offered}
                  onChange={(e) => handleChange('services_offered', e.target.value)}
                  placeholder="Listez les services que vous proposez..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/artisan/dashboard')}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfilePage;