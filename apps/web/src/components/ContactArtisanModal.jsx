import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const CATEGORIES = [
  'Plomberie', 'Menuiserie', 'Électricité', 'Maçonnerie', 'Peinture',
  'Soudure', 'Réparation Auto', 'Construction', 'Paysagisme', 'Carrelage',
  'Couverture', 'Serrurerie', 'Climatisation', 'Autre'
];

const ContactArtisanModal = ({ artisanId, artisanName, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    message: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client_name || !formData.client_email || !formData.client_phone || !formData.message) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    try {
      await pb.collection('contact_requests').create({
        artisan_id: artisanId,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        message: formData.message,
        status: 'new'
      }, { $autoCancel: false });

      toast.success('Votre message a été envoyé avec succès');
      setFormData({
        client_name: '',
        client_email: '',
        client_phone: '',
        message: '',
        category: ''
      });
      onClose();
    } catch (error) {
      console.error('Error sending contact request:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Contacter {artisanName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              value={formData.client_name}
              onChange={(e) => handleChange('client_name', e.target.value)}
              placeholder="Votre nom"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.client_email}
              onChange={(e) => handleChange('client_email', e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.client_phone}
              onChange={(e) => handleChange('client_phone', e.target.value)}
              placeholder="+242 XX XXX XXXX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie de service</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
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
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Décrivez votre projet ou votre besoin..."
              rows={5}
              required
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi...' : 'Envoyer le message'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactArtisanModal;