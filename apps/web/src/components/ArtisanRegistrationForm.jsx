import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import PhotoUploadSection from './PhotoUploadSection.jsx';
import { 
  validateName, 
  validateEmail, 
  validatePhone, 
  validateCity, 
  validateCategory, 
  validatePassword, 
  validateConfirmPassword,
  validateExperience
} from '@/lib/validateArtisanSignup.js';

const METIERS = [
  'Plomberie', 'Menuiserie', 'Électricité', 'Maçonnerie', 'Peinture', 'Soudure', 
  'Réparation automobile', 'Construction', 'Paysagisme', 'Carrelage', 'Couverture', 
  'Autre'
];
const LOCALISATIONS = ['Pointe-Noire', 'Brazzaville', 'Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Autre'];

const STORAGE_KEY = 'artisan_registration_draft';

const ArtisanRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', passwordConfirm: '', metier: '', phone: '', location: '', description: '', experience_years: '', services_offered: ''
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const { password, passwordConfirm, ...safeDraft } = JSON.parse(draft);
        setFormData(prev => ({ ...prev, ...safeDraft }));
        toast.info('Brouillon restauré');
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.name || formData.phone || formData.description) {
        const { password, passwordConfirm, ...safeDraft } = formData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safeDraft));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData]);

  const validateField = (name, value) => {
    let error = null;
    switch (name) {
      case 'name': error = validateName(value); break;
      case 'email': error = validateEmail(value); break;
      case 'password': error = validatePassword(value); break;
      case 'passwordConfirm': error = validateConfirmPassword(formData.password, value); break;
      case 'phone': error = validatePhone(value); break;
      case 'metier': error = validateCategory(value); break;
      case 'location': error = validateCity(value); break;
      case 'experience_years': error = validateExperience(value); break;
      case 'description':
        if (!value || value.trim().length < 20) error = 'Min 20 caractères';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(k => {
      const err = validateField(k, formData[k]);
      if(err) newErrors[k] = err;
    });
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    setIsSubmitting(true);
    try {
      const expYears = parseInt(formData.experience_years, 10) || 0;
      const cleanEmail = formData.email.trim().toLowerCase();
      const cleanPhone = formData.phone.trim();

      const payloadLog = {
        name: formData.name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        category: formData.metier,
        city: formData.location,
        experience_years: expYears,
        bio: formData.description.trim(),
        services_offered: formData.services_offered.trim(),
        status: 'pending',
        account_type: 'artisan'
      };
      console.log('Submitting Artisan Payload:', payloadLog);

      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('email', cleanEmail);
      submitData.append('emailVisibility', true);
      submitData.append('password', formData.password);
      submitData.append('passwordConfirm', formData.passwordConfirm);
      submitData.append('phone', cleanPhone);
      submitData.append('category', formData.metier);
      submitData.append('city', formData.location);
      submitData.append('bio', formData.description.trim());
      submitData.append('services_offered', formData.services_offered.trim());
      submitData.append('experience_years', expYears);
      submitData.append('status', 'pending');
      submitData.append('validation_status', 'En attente');
      submitData.append('is_visible', false);
      submitData.append('account_type', 'artisan');
      
      files.forEach(f => submitData.append('portfolio_photos', f));

      await pb.collection('artisans').create(submitData, { $autoCancel: false });
      
      toast.success('Inscription réussie ! En attente de validation.');
      localStorage.removeItem(STORAGE_KEY);
      
      navigate('/artisan-confirmation', { 
        replace: true,
        state: { 
          artisan: {
            name: formData.name.trim(),
            email: cleanEmail,
            phone: cleanPhone,
            city: formData.location,
            category: formData.metier
          }
        }
      });
    } catch (error) {
      console.error('Registration Error:', error);
      if (!error.status) {
        toast.error('Erreur réseau - veuillez vérifier votre connexion internet.');
      } else if (error.status === 409 || (error.data?.data?.email?.code === 'validation_not_unique')) {
        toast.error('Cet email est déjà utilisé. Veuillez en utiliser un autre.');
        setErrors(prev => ({ ...prev, email: 'Cet email est déjà utilisé.' }));
      } else if (error.status === 400) {
        toast.error('Une erreur est survenue. Vérifiez les champs en rouge.');
      } else {
        toast.error('Erreur serveur - veuillez réessayer plus tard.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 md:p-10 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-border">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <h2 className="text-2xl text-foreground">Profil Professionnel</h2>
        {localStorage.getItem(STORAGE_KEY) && (
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 bg-muted px-3 py-1.5 rounded-md">
            <Save className="w-3 h-3" /> Brouillon
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div>
          <Label className="premium-label" htmlFor="name">Entreprise ou Nom <span className="text-destructive">*</span></Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} className={`premium-input ${errors.name ? 'border-destructive' : ''}`} />
          {errors.name && <p className="text-xs text-destructive mt-1 font-semibold">{errors.name}</p>}
        </div>

        <div>
          <Label className="premium-label" htmlFor="email">Email <span className="text-destructive">*</span></Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={`premium-input ${errors.email ? 'border-destructive' : ''}`} />
          {errors.email && <p className="text-xs text-destructive mt-1 font-semibold">{errors.email}</p>}
        </div>

        <div>
          <Label className="premium-label" htmlFor="password">Mot de passe <span className="text-destructive">*</span></Label>
          <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className={`premium-input ${errors.password ? 'border-destructive' : ''}`} />
          {errors.password && <p className="text-xs text-destructive mt-1 font-semibold">{errors.password}</p>}
        </div>

        <div>
          <Label className="premium-label" htmlFor="passwordConfirm">Confirmer <span className="text-destructive">*</span></Label>
          <Input id="passwordConfirm" name="passwordConfirm" type="password" value={formData.passwordConfirm} onChange={handleChange} className={`premium-input ${errors.passwordConfirm ? 'border-destructive' : ''}`} />
          {errors.passwordConfirm && <p className="text-xs text-destructive mt-1 font-semibold">{errors.passwordConfirm}</p>}
        </div>

        <div>
          <Label className="premium-label" htmlFor="metier">Métier <span className="text-destructive">*</span></Label>
          <Select value={formData.metier} onValueChange={(v) => handleSelectChange('metier', v)}>
            <SelectTrigger className={`premium-input ${errors.metier ? 'border-destructive' : ''}`}><SelectValue placeholder="Sélectionnez..." /></SelectTrigger>
            <SelectContent>
              {METIERS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.metier && <p className="text-xs text-destructive mt-1 font-semibold">{errors.metier}</p>}
        </div>

        <div>
          <Label className="premium-label" htmlFor="location">Ville <span className="text-destructive">*</span></Label>
          <Select value={formData.location} onValueChange={(v) => handleSelectChange('location', v)}>
            <SelectTrigger className={`premium-input ${errors.location ? 'border-destructive' : ''}`}><SelectValue placeholder="Sélectionnez..." /></SelectTrigger>
            <SelectContent>
              {LOCALISATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.location && <p className="text-xs text-destructive mt-1 font-semibold">{errors.location}</p>}
        </div>

        <div>
          <Label className="premium-label" htmlFor="phone">Téléphone <span className="text-destructive">*</span></Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className={`premium-input ${errors.phone ? 'border-destructive' : ''}`} />
          {errors.phone && <p className="text-xs text-destructive mt-1 font-semibold">{errors.phone}</p>}
        </div>

        <div>
          <Label className="premium-label" htmlFor="experience_years">Expérience (années) <span className="text-destructive">*</span></Label>
          <Input id="experience_years" name="experience_years" type="number" min="0" value={formData.experience_years} onChange={handleChange} className={`premium-input ${errors.experience_years ? 'border-destructive' : ''}`} />
          {errors.experience_years && <p className="text-xs text-destructive mt-1 font-semibold">{errors.experience_years}</p>}
        </div>
      </div>

      <div>
        <Label className="premium-label" htmlFor="description">Bio & Expertise <span className="text-destructive">*</span></Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`premium-input min-h-[120px] resize-y py-3 ${errors.description ? 'border-destructive' : ''}`} />
        {errors.description && <p className="text-xs text-destructive mt-1 font-semibold">{errors.description}</p>}
      </div>

      <div className="pt-4 border-t border-border">
        <h3 className="text-lg mb-2">Photos (Optionnel)</h3>
        <PhotoUploadSection files={files} setFiles={setFiles} />
      </div>

      <Button type="submit" className="btn-premium btn-premium-primary btn-premium-lg w-full" disabled={isSubmitting}>
        {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Création...</> : 'Soumettre ma candidature'}
      </Button>
    </form>
  );
};

export default ArtisanRegistrationForm;