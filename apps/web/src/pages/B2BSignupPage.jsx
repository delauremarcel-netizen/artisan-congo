import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useB2BAuth } from '@/contexts/B2BAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead.jsx';

const B2BSignupPage = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useB2BAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Step 1: Enterprise Info
    nom_entreprise: '',
    secteur_activite: '',
    nombre_sites: '',
    adresse_principale: '',
    telephone: '',
    email: '',
    password: '',
    
    // Step 2: Primary Contact
    contact_principal_nom: '',
    contact_principal_prenom: '',
    contact_principal_email: '',
    contact_principal_telephone: '',
    contact_principal_fonction: '',
    
    // Step 3: Needs
    types_interventions: '',
    frequence_interventions: '',
    budget_mensuel: '',
    contrats_maintenance: false,
    demandes_urgence: false,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    // Basic validation per step
    if (step === 1) {
      if (!formData.nom_entreprise || !formData.email || !formData.password || !formData.secteur_activite) {
        toast.error("Veuillez remplir les champs obligatoires (Nom, Secteur, Email, Mot de passe).");
        return;
      }
      if (formData.password.length < 8) {
        toast.error("Le mot de passe doit contenir au moins 8 caractères.");
        return;
      }
    } else if (step === 2) {
      if (!formData.contact_principal_nom || !formData.contact_principal_email) {
        toast.error("Veuillez indiquer au moins le nom et l'email du contact principal.");
        return;
      }
    } else if (step === 3) {
      if (!formData.types_interventions || !formData.frequence_interventions) {
        toast.error("Veuillez spécifier vos types et fréquence d'interventions.");
        return;
      }
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        passwordConfirm: formData.password,
        nombre_sites: Number(formData.nombre_sites) || 1,
        budget_mensuel: formData.budget_mensuel ? Number(formData.budget_mensuel) : null,
        statut: 'inactif', // Requires admin approval or email validation usually
        account_type: 'entreprise'
      };

      await signup(payload);
      toast.success("Compte entreprise créé avec succès !");
      navigate('/b2b/dashboard');
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead title="Créer un compte B2B | Artisan Congo" />
      
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Inscription Entreprise</h1>
          <p className="text-muted-foreground">Rejoignez Artisan Congo B2B pour simplifier vos travaux.</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
          
          {[1, 2, 3, 4].map(num => (
            <div 
              key={num} 
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                ${step >= num ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}
            >
              {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
            </div>
          ))}
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Informations de l'entreprise"}
              {step === 2 && "Contact principal"}
              {step === 3 && "Vos besoins techniques"}
              {step === 4 && "Confirmation"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Dites-nous en plus sur votre structure."}
              {step === 2 && "Qui sera l'administrateur du compte ?"}
              {step === 3 && "Afin de mieux configurer votre espace."}
              {step === 4 && "Vérifiez vos informations avant de valider."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nom_entreprise">Nom de l'entreprise *</Label>
                  <Input id="nom_entreprise" value={formData.nom_entreprise} onChange={e => handleChange('nom_entreprise', e.target.value)} placeholder="Ex: Meridian Hotels SA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secteur_activite">Secteur d'activité *</Label>
                  <Select value={formData.secteur_activite} onValueChange={v => handleChange('secteur_activite', v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hôtellerie</SelectItem>
                      <SelectItem value="restaurant">Restauration</SelectItem>
                      <SelectItem value="immobilier">Immobilier / Syndic</SelectItem>
                      <SelectItem value="commerce">Commerce / Retail</SelectItem>
                      <SelectItem value="entreprise">Bureaux / Tertiaire</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre_sites">Nombre de sites/bâtiments</Label>
                  <Input id="nombre_sites" type="number" min="1" value={formData.nombre_sites} onChange={e => handleChange('nombre_sites', e.target.value)} placeholder="Ex: 3" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="adresse_principale">Adresse du siège</Label>
                  <Input id="adresse_principale" value={formData.adresse_principale} onChange={e => handleChange('adresse_principale', e.target.value)} placeholder="Adresse complète" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email de l'entreprise * (Connexion)</Label>
                  <Input id="email" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="contact@entreprise.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone de l'entreprise</Label>
                  <Input id="telephone" value={formData.telephone} onChange={e => handleChange('telephone', e.target.value)} placeholder="+242 06 XXX XX XX" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input id="password" type="password" value={formData.password} onChange={e => handleChange('password', e.target.value)} placeholder="Minimum 8 caractères" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_nom">Nom *</Label>
                  <Input id="contact_nom" value={formData.contact_principal_nom} onChange={e => handleChange('contact_principal_nom', e.target.value)} placeholder="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_prenom">Prénom</Label>
                  <Input id="contact_prenom" value={formData.contact_principal_prenom} onChange={e => handleChange('contact_principal_prenom', e.target.value)} placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_fonction">Fonction</Label>
                  <Input id="contact_fonction" value={formData.contact_principal_fonction} onChange={e => handleChange('contact_principal_fonction', e.target.value)} placeholder="Ex: Facility Manager" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_telephone">Téléphone direct</Label>
                  <Input id="contact_telephone" value={formData.contact_principal_telephone} onChange={e => handleChange('contact_principal_telephone', e.target.value)} placeholder="+242..." />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contact_email">Email direct *</Label>
                  <Input id="contact_email" type="email" value={formData.contact_principal_email} onChange={e => handleChange('contact_principal_email', e.target.value)} placeholder="john.doe@entreprise.com" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="types_interventions">Quels types d'interventions recherchez-vous le plus ? *</Label>
                  <Input id="types_interventions" value={formData.types_interventions} onChange={e => handleChange('types_interventions', e.target.value)} placeholder="Ex: Plomberie, Climatisation, Électricité..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequence_interventions">Fréquence estimée des interventions *</Label>
                  <Select value={formData.frequence_interventions} onValueChange={v => handleChange('frequence_interventions', v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quotidien">Quotidien</SelectItem>
                      <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                      <SelectItem value="mensuel">Mensuel</SelectItem>
                      <SelectItem value="ponctuel">Ponctuel (quelques fois par an)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget_mensuel">Budget maintenance mensuel estimé (FCFA) - Optionnel</Label>
                  <Input id="budget_mensuel" type="number" value={formData.budget_mensuel} onChange={e => handleChange('budget_mensuel', e.target.value)} placeholder="Ex: 500000" />
                </div>
                
                <div className="pt-4 space-y-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="contrats" checked={formData.contrats_maintenance} onCheckedChange={c => handleChange('contrats_maintenance', c)} />
                    <Label htmlFor="contrats" className="font-normal cursor-pointer">Nous souhaitons mettre en place des contrats de maintenance préventive.</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="urgence" checked={formData.demandes_urgence} onCheckedChange={c => handleChange('demandes_urgence', c)} />
                    <Label htmlFor="urgence" className="font-normal cursor-pointer">Nous avons régulièrement besoin de dépannages d'urgence (24/7).</Label>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 bg-muted/50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg border-b pb-2">Récapitulatif</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Entreprise:</span>
                    <span className="font-medium">{formData.nom_entreprise}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Contact:</span>
                    <span className="font-medium">{formData.contact_principal_nom} {formData.contact_principal_prenom}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Besoins:</span>
                    <span className="font-medium">{formData.types_interventions}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground pt-4">
                  En cliquant sur "Créer mon compte", vous acceptez nos conditions générales d'utilisation B2B.
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between pt-6 border-t mt-2">
            <Button variant="outline" onClick={prevStep} disabled={step === 1 || isSubmitting}>
              Précédent
            </Button>
            
            {step < 4 ? (
              <Button onClick={nextStep}>Suivant</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Créer mon compte
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ? <Link to="/b2b/login" className="text-primary hover:underline font-medium">Connectez-vous</Link>
        </div>
      </div>
    </div>
  );
};

export default B2BSignupPage;