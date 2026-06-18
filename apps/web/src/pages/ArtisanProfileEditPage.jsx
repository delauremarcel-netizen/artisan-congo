import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Loader2 } from 'lucide-react';

const ArtisanProfileEditPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    city: '',
    description: '',
    email: '',
    experience: '',
    portfolio: '',
    facebook: '',
    instagram: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (redirect = false) => {
    if (!currentUser?.id) return;
    setIsSubmitting(true);
    try {
      await pb.collection('artisans').update(currentUser.id, {
        ...formData,
        profileComplete: true,
        status: 'En attente'
      }, { $autoCancel: false });
      
      toast.success('Profil mis à jour avec succès');
      if (redirect) navigate('/artisan/dashboard');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <SEOHead title="Compléter mon profil | Artisan Congo" />
      
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Compléter mon profil</h1>
          <p className="text-muted-foreground">Plus votre profil est complet, plus vous attirerez de clients.</p>
        </div>

        <div className="space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Métier</Label>
              <Select onValueChange={(v) => handleSelectChange('category', v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un métier" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Électricien">Électricien</SelectItem>
                  <SelectItem value="Plombier">Plombier</SelectItem>
                  <SelectItem value="Maçon">Maçon</SelectItem>
                  <SelectItem value="Menuisier">Menuisier</SelectItem>
                  <SelectItem value="Peintre">Peintre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ville</Label>
              <Select onValueChange={(v) => handleSelectChange('city', v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner une ville" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kinshasa">Kinshasa</SelectItem>
                  <SelectItem value="Lubumbashi">Lubumbashi</SelectItem>
                  <SelectItem value="Goma">Goma</SelectItem>
                  <SelectItem value="Bukavu">Bukavu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              placeholder="Décrivez votre expérience et vos services..."
              className="min-h-[120px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">{formData.description.length}/500</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Email (Optionnel)</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Années d'expérience</Label>
              <Select onValueChange={(v) => handleSelectChange('experience', v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Moins de 1 an">Moins de 1 an</SelectItem>
                  <SelectItem value="1-3 ans">1-3 ans</SelectItem>
                  <SelectItem value="3-5 ans">3-5 ans</SelectItem>
                  <SelectItem value="5-10 ans">5-10 ans</SelectItem>
                  <SelectItem value="Plus de 10 ans">Plus de 10 ans</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Button onClick={() => handleSave(false)} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
              Enregistrer et continuer
            </Button>
            <Button onClick={() => handleSave(true)} disabled={isSubmitting} variant="secondary" className="flex-1">
              Enregistrer et revenir au tableau de bord
            </Button>
            <Button onClick={() => navigate('/artisan/dashboard')} variant="ghost" className="flex-1">
              Ignorer pour maintenant
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtisanProfileEditPage;