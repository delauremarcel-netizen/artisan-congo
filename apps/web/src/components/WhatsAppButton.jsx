import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { generateWhatsAppLink, trackWhatsAppClick, validateWhatsAppNumber } from '@/lib/whatsappUtils.js';

const WhatsAppButton = ({ artisan, className, variant = "default" }) => {
  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    
    if (!artisan) return;

    const phone = artisan.whatsapp || artisan.phone;
    if (!validateWhatsAppNumber(phone)) {
      toast.error(`Numéro invalide: ${phone || 'Non renseigné'}`);
      return;
    }

    // 1. Fire-and-forget tracking (does not await, to prevent Safari popup blocker)
    trackWhatsAppClick(artisan.id).catch(err => {
      console.error('Failed to track WhatsApp click:', err);
    });

    // 2. Synchronous window.open to guarantee the tab opens
    try {
      const whatsappUrl = generateWhatsAppLink(artisan);
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback for strict popup blockers
        toast.error('Le bloqueur de pop-up a empêché l\'ouverture de WhatsApp. Veuillez l\'autoriser.');
      }
    } catch (error) {
      toast.error('Impossible d\'ouvrir WhatsApp. Veuillez réessayer.');
    }
  };

  if (!artisan) return null;

  return (
    <Button 
      onClick={handleWhatsAppClick} 
      variant={variant} 
      className={`gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-sm transition-transform active:scale-[0.98] ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
      Contacter
    </Button>
  );
};

export default WhatsAppButton;