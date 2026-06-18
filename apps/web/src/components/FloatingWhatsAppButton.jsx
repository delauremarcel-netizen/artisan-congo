import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsAppButton = () => {
  const PLATFORM_PHONE_NUMBER = "+33605884875";
  
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Bonjour, je souhaite avoir plus d'informations sur ArtisanCongo.");
    window.open(`https://wa.me/${PLATFORM_PHONE_NUMBER.replace(/\s+/g, '')}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95 group"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="font-medium hidden sm:block group-hover:block transition-all duration-300 overflow-hidden whitespace-nowrap">
        Contacter sur WhatsApp
      </span>
    </button>
  );
};

export default FloatingWhatsAppButton;