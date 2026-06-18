import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWhatsAppQualificationLink } from '@/lib/WhatsAppIntegration.js';
import { Wrench, MapPin, FileText, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

const ServiceQualificationChatbot = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    service: '',
    location: '',
    description: ''
  });
  const [descInput, setDescInput] = useState('');

  const services = ['Plomberie', 'Électricité', 'Menuiserie', 'Maçonnerie', 'Peinture', 'Autre'];
  const locations = ['Brazzaville', 'Pointe-Noire', 'Autre'];

  const handleSelectService = (service) => {
    setData({ ...data, service });
    setStep(2);
  };

  const handleSelectLocation = (location) => {
    setData({ ...data, location });
    setStep(3);
  };

  const handleDescriptionSubmit = (e) => {
    e.preventDefault();
    if (descInput.trim().length > 0) {
      setData({ ...data, description: descInput.trim() });
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const sendToWhatsApp = () => {
    const link = generateWhatsAppQualificationLink(data.service, data.location, data.description);
    window.open(link, '_blank');
  };

  const resetFlow = () => {
    setData({ service: '', location: '', description: '' });
    setDescInput('');
    setStep(1);
  };

  // Animation variants
  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="flex flex-col h-full bg-card relative">
      {/* Step Progress Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-muted/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {step > 1 && step < 4 && (
            <button 
              onClick={handleBack}
              className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground active:scale-95"
              aria-label="Retour"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {step === 4 ? 'Résumé de la demande' : `Étape ${step} sur 3`}
          </span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-8 h-1.5 rounded-full transition-colors duration-300 ${
                step >= i ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl mb-6">
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  Bonjour ! 👋 <br/>
                  Quel type d'artisan recherchez-vous aujourd'hui ?
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2.5">
                {services.map((service) => (
                  <Button
                    key={service}
                    variant="outline"
                    onClick={() => handleSelectService(service)}
                    className="justify-start h-auto py-3.5 px-4 text-left font-normal hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all group"
                  >
                    <Wrench className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    {service}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl mb-6">
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  Excellent choix. <br/>
                  Dans quelle ville se trouve votre projet ?
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2.5">
                {locations.map((location) => (
                  <Button
                    key={location}
                    variant="outline"
                    onClick={() => handleSelectLocation(location)}
                    className="justify-start h-auto py-3.5 px-4 text-left font-normal hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all group"
                  >
                    <MapPin className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    {location}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4 flex flex-col h-full"
            >
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl mb-4">
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  Presque terminé ! <br/>
                  Décrivez brièvement votre besoin ou le problème rencontré.
                </p>
              </div>
              
              <form onSubmit={handleDescriptionSubmit} className="flex flex-col flex-1 gap-4">
                <Input
                  autoFocus
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  placeholder="Ex: Fuite d'eau sous l'évier de la cuisine..."
                  className="min-h-[120px] resize-none items-start align-top py-3 text-sm leading-relaxed bg-background"
                />
                <Button 
                  type="submit" 
                  disabled={descInput.trim().length === 0}
                  className="w-full h-12 mt-auto text-sm font-medium tracking-wide uppercase shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  Valider ma description
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 mb-6">
                <div className="w-14 h-14 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-foreground">Demande prête</h3>
                <p className="text-sm text-muted-foreground font-light">
                  Vérifiez vos informations avant de nous contacter
                </p>
              </div>
              
              <div className="bg-muted/40 rounded-xl p-5 space-y-5 border border-border/60">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 shadow-sm border border-border/50">
                    <Wrench className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Service</p>
                    <p className="text-sm font-medium text-foreground">{data.service}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 shadow-sm border border-border/50">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Localisation</p>
                    <p className="text-sm font-medium text-foreground">{data.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 shadow-sm border border-border/50">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Description</p>
                    <p className="text-sm text-foreground leading-relaxed">{data.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  onClick={sendToWhatsApp} 
                  className="w-full h-14 bg-[#25D366] hover:bg-[#1DA851] text-white shadow-xl shadow-[#25D366]/20 font-medium tracking-wide uppercase text-sm transition-all active:scale-[0.98]"
                >
                  <Send className="w-4 h-4 mr-2.5" />
                  Contacter sur WhatsApp
                </Button>
                
                <Button 
                  onClick={resetFlow} 
                  variant="ghost" 
                  className="w-full text-xs text-muted-foreground hover:text-foreground h-10"
                >
                  Modifier ma demande
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ServiceQualificationChatbot;