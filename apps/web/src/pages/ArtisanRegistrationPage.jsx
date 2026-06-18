import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, TrendingUp, ShieldCheck, Star } from 'lucide-react';
import { toast } from 'sonner';

const ArtisanRegistrationPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    category: '',
    city: '',
    experience_years: '',
    bio: ''
  });

  const categories = [
    'Plomberie', 'Électricité', 'Menuiserie', 'Maçonnerie', 'Peinture', 'Soudure', 
    'Réparation Auto', 'Construction', 'Paysagisme', 'Carrelage', 'Couverture', 'Serrurerie', 'Climatisation', 'Autre'
  ];
  
  const cities = ['Pointe-Noire', 'Brazzaville', 'Kinshasa', 'Lubumbashi', 'Kolwezi', 'Autre'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.passwordConfirm) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }
    
    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create the user in PocketBase (artisans collection)
      const recordData = {
        ...formData,
        status: 'En attente', // Pending validation
        is_visible: false,
        account_type: 'artisan',
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : 0,
      };

      await pb.collection('artisans').create(recordData, { $autoCancel: false });
      
      toast.success("Inscription réussie ! Votre profil est en attente de validation.");
      navigate('/artisan-login');
      
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20 pt-20">
      <Helmet>
        <title>S'inscrire comme Artisan | ArtisanCongo</title>
        <meta name="description" content="Rejoignez le premier réseau d'artisans qualifiés au Congo. Développez votre clientèle et gérez vos devis facilement." />
      </Helmet>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-950 pt-16 pb-32 relative overflow-hidden border-b border-primary/20">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                Développez votre activité avec <span className="text-primary">ArtisanCongo</span>
              </h1>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                Rejoignez le réseau de confiance des professionnels du bâtiment et des services au Congo. Recevez des demandes qualifiées directement sur votre téléphone.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl backdrop-blur-sm">
                  <TrendingUp className="w-8 h-8 text-primary mb-3" />
                  <h3 className="text-white font-semibold mb-1">Plus de clients</h3>
                  <p className="text-sm text-slate-400">Accédez à des centaines de demandes de devis chaque mois.</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl backdrop-blur-sm">
                  <ShieldCheck className="w-8 h-8 text-secondary mb-3" />
                  <h3 className="text-white font-semibold mb-1">Gage de confiance</h3>
                  <p className="text-sm text-slate-400">Le badge "Artisan Vérifié" rassure vos futurs clients.</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl backdrop-blur-sm">
                  <Star className="w-8 h-8 text-accent mb-3" />
                  <h3 className="text-white font-semibold mb-1">Visibilité en ligne</h3>
                  <p className="text-sm text-slate-400">Un profil professionnel complet avec vos réalisations et avis.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 -mt-20 relative z-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="border-border shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-background border-b border-border px-8 py-6">
                <CardTitle className="text-2xl font-bold text-center">Créer votre compte artisan</CardTitle>
                <CardDescription className="text-center text-base">
                  Remplissez ce formulaire pour rejoindre la plateforme. Votre profil sera examiné par notre équipe avant d'être visible par les clients.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 bg-background">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Informations de connexion */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b border-border pb-2">Informations de connexion</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Adresse email <span className="text-destructive">*</span></Label>
                        <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="h-12 bg-muted/50 focus:bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone <span className="text-destructive">*</span></Label>
                        <Input id="phone" name="phone" type="tel" required placeholder="+242..." value={formData.phone} onChange={handleChange} className="h-12 bg-muted/50 focus:bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe <span className="text-destructive">*</span></Label>
                        <Input id="password" name="password" type="password" required minLength={8} value={formData.password} onChange={handleChange} className="h-12 bg-muted/50 focus:bg-background" />
                        <p className="text-xs text-muted-foreground">8 caractères minimum</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passwordConfirm">Confirmer mot de passe <span className="text-destructive">*</span></Label>
                        <Input id="passwordConfirm" name="passwordConfirm" type="password" required minLength={8} value={formData.passwordConfirm} onChange={handleChange} className="h-12 bg-muted/50 focus:bg-background" />
                      </div>
                    </div>
                  </div>

                  {/* Profil Professionnel */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b border-border pb-2">Profil Professionnel</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="name">Nom complet ou Nom de l'entreprise <span className="text-destructive">*</span></Label>
                        <Input id="name" name="name" required value={formData.name} onChange={handleChange} className="h-12 bg-muted/50 focus:bg-background" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Métier principal <span className="text-destructive">*</span></Label>
                        <Select required value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                          <SelectTrigger className="h-12 bg-muted/50 focus:bg-background">
                            <SelectValue placeholder="Sélectionnez votre métier" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville d'intervention <span className="text-destructive">*</span></Label>
                        <Select required value={formData.city} onValueChange={(val) => handleSelectChange('city', val)}>
                          <SelectTrigger className="h-12 bg-muted/50 focus:bg-background">
                            <SelectValue placeholder="Sélectionnez votre ville" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="experience_years">Années d'expérience</Label>
                        <Input id="experience_years" name="experience_years" type="number" min="0" placeholder="Ex: 5" value={formData.experience_years} onChange={handleChange} className="h-12 bg-muted/50 focus:bg-background" />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Description de vos services</Label>
                        <Textarea id="bio" name="bio" placeholder="Décrivez votre expérience, vos spécialités et ce qui vous démarque..." rows={5} value={formData.bio} onChange={handleChange} className="resize-none bg-muted/50 focus:bg-background" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col items-center gap-4">
                    <Button type="submit" size="lg" className="w-full md:w-auto px-12 h-14 text-lg font-bold" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Création en cours...
                        </>
                      ) : (
                        'Soumettre mon inscription'
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      Déjà inscrit ? <Link to="/artisan-login" className="text-primary font-semibold hover:underline">Connectez-vous ici</Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArtisanRegistrationPage;