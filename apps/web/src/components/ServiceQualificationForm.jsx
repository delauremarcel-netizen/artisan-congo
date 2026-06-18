import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWhatsAppLink } from '@/lib/WhatsAppIntegration.js';
import { Wrench, MapPin, FileText, Send, CheckCircle2, ArrowRight } from 'lucide-react';

const ServiceQualificationForm = ({ onCancel }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    service: '',
    location: '',
    description: ''
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleSubmit = () => {
    const url = generateWhatsAppLink('service', data);
    window.open(url, '_blank');
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border border-border/50 shadow-sm overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-muted/30 px-4 py-3 border-b border-border/50 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= i ? 'bg-primary' : 'bg-primary/20'}`} />
        ))}
      </div>

      <div className="p-5 sm:p-6 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">De quel service avez-vous besoin ?</h3>
                <p className="text-sm text-muted-foreground">Sélectionnez le type d'artisan recherché.</p>
              </div>
              <div className="space-y-4">
                <Select value={data.service} onValueChange={(val) => setData({ ...data, service: val })}>
                  <SelectTrigger className="w-full h-12 text-base">
                    <SelectValue placeholder="Choisir un métier..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plombier">Plombier</SelectItem>
                    <SelectItem value="Électricien">Électricien</SelectItem>
                    <SelectItem value="Menuisier">Menuisier</SelectItem>
                    <SelectItem value="Maçon">Maçon</SelectItem>
                    <SelectItem value="Peintre">Peintre</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleNext} disabled={!data.service} className="w-full h-12">
                  Continuer <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Où se trouve le chantier ?</h3>
                <p className="text-sm text-muted-foreground">Indiquez la ville d'intervention.</p>
              </div>
              <div className="space-y-4">
                <Select value={data.location} onValueChange={(val) => setData({ ...data, location: val })}>
                  <SelectTrigger className="w-full h-12 text-base">
                    <SelectValue placeholder="Choisir une ville..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brazzaville">Brazzaville</SelectItem>
                    <SelectItem value="Pointe-Noire">Pointe-Noire</SelectItem>
                    <SelectItem value="Dolisie">Dolisie</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="h-12 flex-1">Retour</Button>
                  <Button onClick={handleNext} disabled={!data.location} className="h-12 flex-1">
                    Continuer <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Décrivez votre besoin</h3>
                <p className="text-sm text-muted-foreground">Plus vous donnez de détails, plus l'estimation sera précise.</p>
              </div>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Ex: J'ai une fuite d'eau sous l'évier de la cuisine..." 
                  className="min-h-[120px] resize-none text-base"
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="h-12 flex-1">Retour</Button>
                  <Button onClick={handleNext} disabled={data.description.length < 10} className="h-12 flex-1">
                    Vérifier <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-medium text-foreground">Demande prête !</h3>
                <p className="text-sm text-muted-foreground mt-1">Vérifiez vos informations avant l'envoi.</p>
              </div>

              <div className="bg-muted/40 rounded-xl p-4 space-y-4 border border-border/50">
                <div className="flex items-start gap-3">
                  <Wrench className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Service</span>
                    <span className="text-sm font-medium text-foreground">{data.service}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Lieu</span>
                    <span className="text-sm font-medium text-foreground">{data.location}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Description</span>
                    <span className="text-sm text-foreground">{data.description}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button onClick={handleSubmit} className="w-full h-12 bg-[#25D366] hover:bg-[#1DA851] text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer sur WhatsApp
                </Button>
                <Button variant="ghost" onClick={() => setStep(1)} className="w-full h-10 text-muted-foreground">
                  Modifier la demande
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ServiceQualificationForm;