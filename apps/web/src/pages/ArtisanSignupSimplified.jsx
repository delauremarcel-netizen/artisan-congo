import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Smartphone, MapPin, Wrench, Star, Camera, Loader2, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { 
  validateName, 
  validatePhone, 
  validateCity, 
  validateCategory, 
  validateExperience, 
  validateEmail, 
  validatePassword,
  validatePhoto
} from '@/lib/validateArtisanSignup.js';

const CITIES = ['Pointe-Noire', 'Brazzaville', 'Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Autre'];
const CATEGORIES = [
  'Électricien', 'Plombier', 'Maçon', 'Peintre', 'Carreleur', 'Serrurier', 'Vitrier', 
  'Couvreur', 'Menuisier', 'Charpentier', 'Jardinier', 'Nettoyeur', 'Autre'
];
const EXPERIENCE_LEVELS = ['Moins de 1 an', '1-3 ans', '3-5 ans', '5-10 ans', 'Plus de 10 ans'];

const ArtisanSignupSimplified = () => {
  const navigate = useNavigate();
  const { artisanSignup } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    city: '',
    category: '',
    experience: '',
    photo: null,
    email: '',
    password: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleNextStep1 = () => {
    const nameErr = validateName(formData.name);
    const phoneErr = validatePhone(formData.whatsapp);
    
    if (nameErr || phoneErr) {
      setErrors({ name: nameErr, whatsapp: phoneErr });
      if (nameErr) toast.error(nameErr);
      else if (phoneErr) toast.error(phoneErr);
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    const catErr = validateCategory(formData.category);
    const cityErr = validateCity(formData.city);
    const expErr = validateExperience(formData.experience);
    const photoErr = validatePhoto(formData.photo);
    
    if (catErr || cityErr || expErr || photoErr) {
      setErrors({ category: catErr, city: cityErr, experience: expErr, photo: photoErr });
      if (catErr) toast.error(catErr);
      else if (cityErr) toast.error(cityErr);
      else if (expErr) toast.error(expErr);
      else if (photoErr) toast.error(photoErr);
      return;
    }
    setStep(3);
  };

  const handleSubmit = async () => {
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    
    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      if (emailErr) toast.error(emailErr);
      else if (passErr) toast.error(passErr);
      return;
    }

    setIsSubmitting(true);
    
    try {
      let expYears = 0;
      if (formData.experience === '1-3 ans') expYears = 2;
      else if (formData.experience === '3-5 ans') expYears = 4;
      else if (formData.experience === '5-10 ans') expYears = 7;
      else if (formData.experience === 'Plus de 10 ans') expYears = 12;

      const cleanEmail = formData.email.trim().toLowerCase();
      const cleanPhone = formData.whatsapp.trim();

      const payloadLog = {
        name: formData.name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        whatsapp: cleanPhone,
        city: formData.city,
        category: formData.category,
        experience_years: expYears,
        status: 'pending',
        account_type: 'artisan'
      };
      console.log('Submitting Artisan Payload:', payloadLog);

      const submissionData = new FormData();
      submissionData.append('name', formData.name.trim());
      submissionData.append('email', cleanEmail);
      submissionData.append('emailVisibility', true);
      submissionData.append('password', formData.password);
      submissionData.append('passwordConfirm', formData.password);
      submissionData.append('phone', cleanPhone);
      submissionData.append('whatsapp', cleanPhone);
      submissionData.append('city', formData.city);
      submissionData.append('category', formData.category);
      submissionData.append('experience_years', expYears);
      submissionData.append('status', 'pending');
      submissionData.append('validation_status', 'En attente');
      submissionData.append('is_visible', false);
      submissionData.append('account_type', 'artisan');
      
      if (formData.photo) {
        submissionData.append('profile_photo', formData.photo);
      }

      await artisanSignup(submissionData);
      
      toast.success('Votre inscription a été enregistrée avec succès.');
      
      navigate('/artisan-confirmation', { 
        replace: true,
        state: { 
          artisan: {
            name: formData.name.trim(),
            email: cleanEmail,
            phone: cleanPhone,
            city: formData.city,
            category: formData.category
          }
        }
      });

    } catch (error) {
      console.error('Erreur inscription artisan:', error);
      
      if (!error.status) {
        toast.error('Erreur réseau - veuillez vérifier votre connexion internet.');
      } else if (error.status === 409 || (error.data?.data?.email?.code === 'validation_not_unique')) {
        toast.error('Cet email est déjà utilisé. Veuillez en utiliser un autre.');
        setErrors(prev => ({ ...prev, email: 'Email déjà utilisé.' }));
      } else if (error.status === 400) {
        toast.error('Une erreur est survenue. Merci de vérifier les informations saisies.');
      } else {
        toast.error('Erreur serveur - veuillez réessayer plus tard.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4 py-12">
      <SEOHead title="Inscription Artisan | ArtisanCongo" />
      
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
        <span className="text-sm font-medium text-muted-foreground">
          Étape {step} sur 3
        </span>
      </div>

      <div className="w-full max-w-md bg-card border border-border shadow-lg rounded-2xl overflow-hidden">
        <div className="w-full h-1.5 bg-muted flex">
          <div className={`h-full bg-primary transition-all duration-300 ease-out ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">Créez votre profil artisan</h1>
                <p className="text-sm text-muted-foreground">Commençons par vos informations de base</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">Nom et prénom <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Jean Dupont"
                      className={`pl-10 h-12 bg-background focus-visible:ring-primary ${errors.name ? 'border-destructive' : 'border-border'}`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-foreground font-medium">Téléphone WhatsApp <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="Ex: +243 123 456 789"
                      className={`pl-10 h-12 bg-background focus-visible:ring-primary ${errors.whatsapp ? 'border-destructive' : 'border-border'}`}
                    />
                  </div>
                  {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
                </div>
              </div>

              <Button 
                onClick={handleNextStep1}
                className="w-full h-12 text-base font-semibold mt-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                Continuer
              </Button>
              
              <div className="text-center mt-4">
                <Link to="/artisan-login" className="text-sm text-primary font-medium hover:underline">
                  Déjà inscrit ? Connectez-vous
                </Link>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">Votre expertise</h1>
                <p className="text-sm text-muted-foreground">Dites-nous en plus sur vos services</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Métier <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={formData.category} onValueChange={(val) => handleInputChange('category', val)}>
                      <SelectTrigger className={`pl-10 h-12 bg-background ${errors.category ? 'border-destructive' : 'border-border'}`}>
                        <SelectValue placeholder="Sélectionnez votre métier" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Ville <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={formData.city} onValueChange={(val) => handleInputChange('city', val)}>
                      <SelectTrigger className={`pl-10 h-12 bg-background ${errors.city ? 'border-destructive' : 'border-border'}`}>
                        <SelectValue placeholder="Sélectionnez votre ville" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Années d'expérience <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={formData.experience} onValueChange={(val) => handleInputChange('experience', val)}>
                      <SelectTrigger className={`pl-10 h-12 bg-background ${errors.experience ? 'border-destructive' : 'border-border'}`}>
                        <SelectValue placeholder="Votre expérience" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map(exp => (
                          <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.experience && <p className="text-xs text-destructive mt-1">{errors.experience}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium text-sm flex items-center gap-2">
                    Ajouter une photo <span className="text-muted-foreground font-normal">(Optionnel)</span>
                  </Label>
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-muted/30 transition-colors relative ${errors.photo ? 'border-destructive bg-destructive/5' : 'border-border hover:border-primary hover:bg-primary/5'}`}>
                    <input 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const photoError = validatePhoto(e.target.files[0]);
                          if (photoError) {
                            setErrors(prev => ({ ...prev, photo: photoError }));
                          } else {
                            handleInputChange('photo', e.target.files[0]);
                          }
                        }
                      }}
                    />
                    {formData.photo ? (
                      <div className="text-primary font-medium flex flex-col items-center gap-2">
                        <Camera className="w-6 h-6" />
                        <span className="text-sm truncate max-w-[200px]">{formData.photo.name}</span>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Cliquez ou glissez une photo ici</span>
                      </>
                    )}
                  </div>
                  {errors.photo && <p className="text-xs text-destructive mt-1">{errors.photo}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <Button 
                  onClick={handleNextStep2}
                  className="w-full h-12 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                >
                  Continuer
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-full h-12 text-base font-medium rounded-lg text-muted-foreground hover:text-foreground"
                >
                  Retour
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">Sécurisez votre compte</h1>
                <p className="text-sm text-muted-foreground">Ces identifiants vous permettront de vous connecter</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">Adresse email <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Ex: jean@example.com"
                      className={`pl-10 h-12 bg-background focus-visible:ring-primary ${errors.email ? 'border-destructive' : 'border-border'}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">Mot de passe <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Minimum 8 caractères"
                      className={`pl-10 pr-10 h-12 bg-background focus-visible:ring-primary ${errors.password ? 'border-destructive' : 'border-border'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full h-12 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm relative overflow-hidden"
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finalisation...</>
                  ) : (
                    'Créer mon compte'
                  )}
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="w-full h-12 text-base font-medium rounded-lg text-muted-foreground hover:text-foreground"
                >
                  Retour
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed">
                En créant un compte, vous acceptez nos <Link to="/terms" className="underline hover:text-primary">conditions d'utilisation</Link> et notre <Link to="/privacy" className="underline hover:text-primary">politique de confidentialité</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanSignupSimplified;