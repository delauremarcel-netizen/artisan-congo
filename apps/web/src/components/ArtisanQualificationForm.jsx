import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWhatsAppLink } from '@/lib/WhatsAppIntegration.js';
import { Briefcase, MapPin, Award, Phone, Send, CheckCircle2, ArrowRight } from 'lucide-react';

const ArtisanQualificationForm = ({ onCancel }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    metier: '',
    location: '',
    bio: '',
    phone: ''
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleSubmit = () => {
    const url = generateWhatsAppLink('artisan', data);
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
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= i ? 'bg-primary' : 'bg-primary/20'}`} />
        ))}
      </div>

      <div className="p-5 sm:p-6 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="a1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Quel est votre métier principal ?</h3>
                <p className="text-sm text-muted-foreground">Sélectionnez votre domaine d'expertise.</p>
              </div>
              <div className="space-y-4">
                <Select value={data.metier} onValueChange={(val) => setData({ ...data, metier: val })}>
                  <SelectTrigger className="w-full h-12 text-base">
                    <SelectValue placeholder="Choisir un métier..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plomberie">Plomberie</SelectItem>
                    <SelectItem value="Électricité">Électricité</SelectItem>
                    <SelectItem value="Menuiserie">Menuiserie</SelectItem>
                    <SelectItem value="Maçonnerie">Maçonnerie</SelectItem>
                    <SelectItem value="Peinture">Peinture</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleNext} disabled={!data.metier} className="w-full h-12">
                  Continuer <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="a2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Où intervenez-vous ?</h3>
                <p className="text-sm text-muted-foreground">Sélectionnez votre ville d'activité principale.</p>
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
            <motion.div key="a3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Décrivez votre expérience</h3>
                <p className="text-sm text-muted-foreground">Présentez-vous brièvement (années d'expérience, spécialités...).</p>
              </div>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Ex: Je suis menuisier depuis 10 ans, spécialisé dans les meubles sur mesure..." 
                  className="min-h-[120px] resize-none text-base"
                  value={data.bio}
                  onChange={(e) => setData({ ...data, bio: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="h-12 flex-1">Retour</Button>
                  <Button onClick={handleNext} disabled={data.bio.length < 10} className="h-12 flex-1">
                    Continuer <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="a4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Votre numéro WhatsApp</h3>
                <p className="text-sm text-muted-foreground">Pour que nous puissions vous recontacter rapidement.</p>
              </div>
              <div className="space-y-4">
                <Input 
                  type="tel"
                  placeholder="+242 XX XXX XX XX" 
                  className="h-12 text-base"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(3)} className="h-12 flex-1">Retour</Button>
                  <Button onClick={handleNext} disabled={data.phone.length < 8} className="h-12 flex-1">
                    Vérifier <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="a5" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-medium text-foreground">Dossier prêt !</h3>
                <p className="text-sm text-muted-foreground mt-1">Vérifiez vos informations avant de finaliser.</p>
              </div>

              <div className="bg-muted/40 rounded-xl p-4 space-y-4 border border-border/50">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Métier</span>
                    <span className="text-sm font-medium text-foreground">{data.metier}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Secteur</span>
                    <span className="text-sm font-medium text-foreground">{data.location}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Expérience</span>
                    <span className="text-sm text-foreground line-clamp-2">{data.bio}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Contact</span>
                    <span className="text-sm font-medium text-foreground">{data.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button onClick={handleSubmit} className="w-full h-12 bg-[#25D366] hover:bg-[#1DA851] text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Soumettre via WhatsApp
                </Button>
                <Button variant="ghost" onClick={() => setStep(1)} className="w-full h-10 text-muted-foreground">
                  Modifier les informations
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArtisanQualificationForm;