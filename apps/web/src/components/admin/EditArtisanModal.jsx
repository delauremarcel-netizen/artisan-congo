import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Phone, Mail, User, Briefcase, CheckCircle2, XCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const CATEGORIES = [
  'Plomberie', 'Menuiserie', 'Électricité', 'Maçonnerie', 'Peinture', 
  'Soudure', 'Réparation Auto', 'Construction', 'Paysagisme', 'Carrelage', 
  'Couverture', 'Serrurerie', 'Climatisation', 'Plomberie Sanitaire', 
  'Électricité Industrielle', 'Charpenterie', 'Vitrerie', 'Chauffage', 
  'Isolation', 'Démolition', 'Terrassement', 'Béton', 'Ferronnerie', 
  'Plâtrerie', 'Décoration Intérieure'
];

const EditArtisanModal = ({ isOpen, onClose, artisan, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    phone: '',
    email: '',
    bio: '',
    availability: false,
    status: 'pending'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (artisan && isOpen) {
      setFormData({
        name: artisan.name || '',
        category: artisan.category || '',
        phone: artisan.phone || '',
        email: artisan.email || '',
        bio: artisan.bio || '',
        availability: artisan.availability === true,
        status: artisan.status || 'pending'
      });
    }
  }, [artisan, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!artisan) return;
    
    setIsSaving(true);
    try {
      await pb.collection('artisan_profiles').update(artisan.id, formData, { $autoCancel: false });
      
      toast.success('Profil artisan mis à jour avec succès.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Une erreur est survenue lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!artisan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Éditer le profil: {artisan.name}</DialogTitle>
          <DialogDescription>
            Modifiez les informations complètes de cet artisan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Nom complet</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleChange('name', e.target.value)} 
                className="pl-10 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">Catégorie / Métier</Label>
            <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">Numéro de téléphone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={(e) => handleChange('phone', e.target.value)} 
                placeholder="+33605884875"
                className="pl-10 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Adresse Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email"
                value={formData.email} 
                onChange={(e) => handleChange('email', e.target.value)} 
                placeholder="artisan@example.com"
                className="pl-10 text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio" className="text-foreground">Description / Bio</Label>
            <Textarea 
              id="bio" 
              value={formData.bio} 
              onChange={(e) => handleChange('bio', e.target.value)} 
              placeholder="Description de l'artisan..."
              className="min-h-[100px] text-foreground resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-foreground">Statut du profil</Label>
            <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Validé</SelectItem>
                <SelectItem value="rejected">Refusé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-row items-center justify-between rounded-xl border p-4 bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-base text-foreground">Disponibilité</Label>
              <div className="flex items-center gap-2 mt-1">
                {formData.availability ? (
                  <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Disponible
                  </span>
                ) : (
                  <span className="flex items-center text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Non disponible
                  </span>
                )}
              </div>
            </div>
            <Switch 
              checked={formData.availability} 
              onCheckedChange={(val) => handleChange('availability', val)}
              className={formData.availability ? "data-[state=checked]:bg-green-500" : "data-[state=unchecked]:bg-red-500"}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-end gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Enregistrer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditArtisanModal;