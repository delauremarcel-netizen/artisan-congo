import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Home, UserPlus, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PLATFORM_PHONE_NUMBER, getWhatsAppLink } from '@/lib/whatsappConfig.js';

const SuccessModal = ({ open, onOpenChange, registrationId, onReset }) => {
  const navigate = useNavigate();

  const handleCopy = () => {
    if (registrationId) {
      navigator.clipboard.writeText(registrationId);
      toast.success('ID copié dans le presse-papiers');
    }
  };

  const handleHome = () => {
    onOpenChange(false);
    navigate('/');
  };

  const handleReset = () => {
    onOpenChange(false);
    if (onReset) onReset();
  };

  const handleWhatsAppClick = () => {
    window.open(getWhatsAppLink("Bonjour, je viens de soumettre une demande sur la plateforme."), '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center p-8">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-foreground mb-2">Inscription Réussie !</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Merci ! Votre inscription a été reçue. Notre équipe va l'examiner et nous vous contacterons bientôt.
          </DialogDescription>
        </DialogHeader>

        {registrationId && (
          <div className="bg-muted rounded-xl p-5 my-6 border border-border relative group">
            <p className="text-sm font-medium text-muted-foreground mb-2">Votre ID d'inscription</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-2xl font-mono font-extrabold text-primary tracking-wider">{registrationId}</p>
              <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4 text-sm text-muted-foreground mb-6">
          <p>Prochaines étapes :</p>
          <ul className="text-left space-y-2 max-w-xs mx-auto">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
              Vérification de vos informations par notre équipe
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
              Appel de confirmation sous 48h
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
              Activation de votre profil public
            </li>
          </ul>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 mb-8 border border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Vous pouvez aussi nous contacter directement sur WhatsApp:{' '}
            <a 
              href={`https://wa.me/${PLATFORM_PHONE_NUMBER.replace('+', '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              {PLATFORM_PHONE_NUMBER}
            </a>
          </p>
          <Button 
            onClick={handleWhatsAppClick}
            className="w-full bg-[#007A5E] hover:bg-[#1B5E3F] text-white h-10 rounded-lg shadow-sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contacter sur WhatsApp
          </Button>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2">
          <Button variant="outline" className="w-full sm:w-1/2 h-12" onClick={handleReset}>
            <UserPlus className="w-4 h-4 mr-2" />
            Nouvelle inscription
          </Button>
          <Button className="w-full sm:w-1/2 h-12" onClick={handleHome}>
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;