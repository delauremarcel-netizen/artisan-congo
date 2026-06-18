import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail, User, Phone, MapPin, Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { PROFESSIONS } from '@/lib/professions.js';
import { formatWhatsAppNumber, validateWhatsAppNumber } from '@/lib/whatsappUtils.js';

const CITIES = ['Pointe-Noire', 'Brazzaville', 'Kinshasa', 'Lubumbashi', 'Kolwezi'];

const ArtisanRegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    city: '',
    category: '',
    bio: '',
    experience_years: '',
    services_offered: '',
    password: '',
    passwordConfirm: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let error = null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\+\-\(\)]{9,15}$/;

    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Nom requis.';
        else if (value.trim().length < 3) error = 'Min 3 caractères.';
        break;
      case 'email':
        if (!value.trim()) error = 'Email requis.';
        else if (!emailRegex.test(value)) error = 'Email invalide.';
        break;
      case 'whatsapp':
        if (!value.trim()) error = 'WhatsApp requis.';
        else if (!validateWhatsAppNumber(value)) error = 'Format invalide.';
        break;
      case 'phone':
        if (value.trim() && !phoneRegex.test(value)) error = 'Format invalide.';
        break;
      case 'city':
        if (!value) error = 'Ville requise.';
        break;
      case 'category':
        if (!value) error = 'Métier requis.';
        break;
      case 'password':
        if (!value) error = 'Mot de passe requis.';
        else if (value.length < 8) error = 'Min 8 caractères.';
        break;
      case 'passwordConfirm':
        if (value !== formData.password) error = 'Mots de passe différents.';
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = () => {
    const fieldsToValidate = ['name', 'email', 'whatsapp', 'city', 'category', 'password', 'passwordConfirm'];
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
      const isFieldValid = validateField(field, formData[field]);
      if (!isFieldValid) isValid = false;
      setTouched(prev => ({ ...prev, [field]: true }));
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setLoading(true);
    try {
      const formattedWhatsapp = formatWhatsAppNumber(formData.whatsapp);

      const data = new FormData();
      data.append('email', formData.email.trim());
      data.append('password', formData.password);
      data.append('passwordConfirm', formData.passwordConfirm);
      data.append('name', formData.name.trim());
      data.append('phone', formData.phone.trim());
      data.append('whatsapp', formattedWhatsapp);
      data.append('city', formData.city);
      data.append('category', formData.category);
      data.append('bio', formData.bio.trim());
      data.append('experience_years', formData.experience_years ? parseInt(formData.experience_years, 10) : 0);
      data.append('services_offered', formData.services_offered.trim());
      
      // Critical fields for admin validation flow
      data.append('account_type', 'artisan');
      data.append('status', 'pending');
      data.append('validation_status', 'En attente');
      data.append('is_visible', false);

      for (let file of selectedFiles) {
        data.append('photos', file);
      }

      await pb.collection('artisans').create(data, { $autoCancel: false });
      
      setIsSuccess(true);
      toast.success('✅ Inscription réussie ! Votre profil est en attente de validation.');
      
      setTimeout(() => {
        navigate('/artisans');
      }, 3000);
      
    } catch (error) {
      console.error('Registration error:', error);
      if (error.status === 409) {
        toast.error('Cette adresse email est déjà enregistrée.');
        setErrors(prev => ({ ...prev, email: 'Email déjà utilisé.' }));
      } else {
        toast.error('Erreur lors de l\'inscription. Veuillez vérifier les informations.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="bg-card p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-border">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Inscription réussie !</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Votre profil a été créé avec succès. Il est actuellement en attente de validation par notre équipe.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/artisans')} className="w-full h-12 rounded-xl text-lg">
              Aller à la page artisans
            </Button>
            <p className="text-sm text-muted-foreground mt-4">Redirection automatique dans 3 secondes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Formulaire Inscription Artisan - ArtisanCongo</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 py-12 px-4 flex justify-center items-start pt-24">
        <Card className="w-full max-w-3xl border-border/50 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-primary p-8 text-primary-foreground text-center border-b-0">
            <CardTitle className="text-3xl font-extrabold tracking-tight mb-2 text-white">Rejoignez notre réseau d'experts</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
              Créez votre profil artisan pour développer votre clientèle.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 sm:p-8 bg-background">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Lock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-xl">Identifiants de connexion</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email"
                        value={formData.email} 
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={`pl-10 bg-muted/50 ${touched.email && errors.email ? 'border-destructive' : touched.email && !errors.email ? 'border-green-500' : ''}`} 
                        placeholder="exemple@email.com"
                      />
                    </div>
                    {touched.email && errors.email && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/>{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          value={formData.password} 
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          onBlur={() => handleBlur('password')}
                          className={`pl-10 pr-10 bg-muted/50 ${touched.password && errors.password ? 'border-destructive' : touched.password && !errors.password ? 'border-green-500' : ''}`} 
                          placeholder="Min. 8 caractères"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                          {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      </div>
                      {touched.password && errors.password && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/>{errors.password}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passwordConfirm">Confirmez le mot de passe <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="passwordConfirm" 
                          type={showPasswordConfirm ? "text" : "password"}
                          value={formData.passwordConfirm} 
                          onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
                          onBlur={() => handleBlur('passwordConfirm')}
                          className={`pl-10 pr-10 bg-muted/50 ${touched.passwordConfirm && errors.passwordConfirm ? 'border-destructive' : touched.passwordConfirm && !errors.passwordConfirm ? 'border-green-500' : ''}`} 
                        />
                        <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2">
                          {showPasswordConfirm ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      </div>
                      {touched.passwordConfirm && errors.passwordConfirm && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/>{errors.passwordConfirm}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b pb-2">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-xl">Profil Public</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet ou Nom d'entreprise <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        className={`pl-10 bg-muted/50 ${touched.name && errors.name ? 'border-destructive' : touched.name && !errors.name ? 'border-green-500' : ''}`} 
                      />
                    </div>
                    {touched.name && errors.name && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/>{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">Numéro WhatsApp <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="whatsapp" 
                          value={formData.whatsapp} 
                          onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                          onBlur={() => handleBlur('whatsapp')}
                          className={`pl-10 bg-muted/50 ${touched.whatsapp && errors.whatsapp ? 'border-destructive' : touched.whatsapp && !errors.whatsapp ? 'border-green-500' : ''}`} 
                          placeholder="06 123 45 67"
                        />
                      </div>
                      {touched.whatsapp && errors.whatsapp && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/>{errors.whatsapp}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone Secondaire</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          value={formData.phone} 
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          onBlur={() => handleBlur('phone')}
                          className={`pl-10 bg-muted/50 ${touched.phone && errors.phone ? 'border-destructive' : ''}`} 
                        />
                      </div>
                      {touched.phone && errors.phone && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/>{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville principale <span className="text-destructive">*</span></Label>
                      <Select 
                        value={formData.city} 
                        onValueChange={(val) => { handleInputChange('city', val); handleBlur('city'); }}
                      >
                        <SelectTrigger className={`bg-muted/50 ${touched.city && errors.city ? 'border-destructive' : touched.city && !errors.city ? 'border-green-500' : ''}`}>
                          <SelectValue placeholder="Sélectionnez une ville" />
                        </SelectTrigger>
                        <SelectContent>
                          {CITIES.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {touched.city && errors.city && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/>{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Métier principal <span className="text-destructive">*</span></Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(val) => { handleInputChange('category', val); handleBlur('category'); }}
                      >
                        <SelectTrigger className={`bg-muted/50 ${touched.category && errors.category ? 'border-destructive' : touched.category && !errors.category ? 'border-green-500' : ''}`}>
                          <SelectValue placeholder="Sélectionnez votre métier" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROFESSIONS.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {touched.category && errors.category && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/>{errors.category}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg rounded-xl shadow-lg transition-transform active:scale-[0.98]" 
                  disabled={loading || Object.values(errors).some(e => e !== null)}
                >
                  {loading ? 'Création en cours...' : 'Soumettre mon inscription'}
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Déjà inscrit ? <Link to="/artisan/login" className="text-primary font-semibold hover:underline">Connectez-vous</Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ArtisanRegistrationForm;