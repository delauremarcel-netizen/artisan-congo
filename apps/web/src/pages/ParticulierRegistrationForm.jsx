import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ParticulierRegistrationForm = () => {
  const navigate = useNavigate();
  const { signupData, signup } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    if (!signupData) {
      navigate('/signup');
    }
  }, [signupData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Le nom est obligatoire');
      return;
    }

    setLoading(true);
    try {
      const completeData = {
        ...signupData,
        ...formData,
        account_type: 'particulier'
      };

      await signup(completeData, 'users');
      toast.success('Bienvenue ! Votre compte client a été créé.');
      navigate('/dashboard/particulier');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Profil Client (Étape 3/3) - ArtisanCongo</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 py-12 px-4 flex justify-center items-start">
        <Card className="w-full max-w-lg border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Finaliser votre profil Client</CardTitle>
            <CardDescription>Étape 3 sur 3 : Vos informations personnelles</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="Ex: Jean Dupont"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone (Optionnel)</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  placeholder="Pour vous contacter facilement"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Finalisation...' : 'Terminer mon inscription'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ParticulierRegistrationForm;