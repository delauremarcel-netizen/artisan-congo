import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const ContactFormModal = ({ isOpen, onClose, artisanId, artisanName }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message) {
      toast.error('Veuillez écrire un message.');
      return;
    }

    if (!isAuthenticated && (!formData.name || !formData.email)) {
      toast.error('Veuillez renseigner votre nom et email.');
      return;
    }

    setLoading(true);
    try {
      // Simulate sending a message to 'messages' collection
      // For unauthenticated users, we create a pseudo-sender ID or use their email
      const senderId = isAuthenticated ? currentUser.id : `guest_${Date.now()}`;
      const conversationId = `conv_${artisanId}_${senderId}`;

      await pb.collection('messages').create({
        sender_id: senderId,
        receiver_id: artisanId,
        artisan_id: artisanId,
        message_text: `[De: ${formData.name || currentUser?.name || 'Visiteur'} - ${formData.email || currentUser?.email}] ${formData.message}`,
        read_status: 'unread',
        conversation_id: conversationId
      }, { $autoCancel: false });

      toast.success(`Message envoyé à ${artisanName}`);
      onClose();
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Impossible d\'envoyer le message. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-border/60">
        <div className="bg-primary/5 p-6 border-b border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Contacter {artisanName}</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5">
              Envoyez un message direct à cet artisan pour discuter de vos besoins.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isAuthenticated && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="contact-name">Nom complet <span className="text-destructive">*</span></Label>
                <Input
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-email">Email <span className="text-destructive">*</span></Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-phone">Téléphone</Label>
                  <Input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5 pt-2">
            <Label htmlFor="message">Votre message <span className="text-destructive">*</span></Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Bonjour, je vous contacte pour..."
              className="min-h-[150px] resize-y"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormModal;