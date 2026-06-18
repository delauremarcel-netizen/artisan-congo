import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const result = await pb.collection('admin_settings').getList(1, 1, { $autoCancel: false });
        
        if (result.items.length > 0) {
          setSettings(result.items[0]);
        } else {
          // Create default if none exists
          const defaultSettings = {
            site_name: 'ArtisanCongo',
            site_description: 'Plateforme de connexion entre clients et artisans',
            contact_email: 'contact@artisancongo.com',
            support_email: 'support@artisancongo.com',
            commission_rate: 10,
            require_email_verification: false,
            require_phone_verification: false,
            auto_approve_artisans: false,
            artisan_registration_enabled: true,
            client_registration_enabled: true
          };
          const newRecord = await pb.collection('admin_settings').create(defaultSettings, { $autoCancel: false });
          setSettings(newRecord);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Erreur lors du chargement des paramètres');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!settings?.site_name?.trim()) newErrors.site_name = "Le nom du site est requis";
    if (!settings?.site_description?.trim()) newErrors.site_description = "La description est requise";
    if (!settings?.contact_email?.trim()) newErrors.contact_email = "L'email de contact est requis";
    if (!settings?.support_email?.trim()) newErrors.support_email = "L'email de support est requis";
    if (settings?.commission_rate === undefined || settings?.commission_rate === null || settings?.commission_rate === '') {
      newErrors.commission_rate = "Le taux de commission est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!settings?.id) return;
    
    try {
      setSaving(true);
      await pb.collection('admin_settings').update(settings.id, settings, { $autoCancel: false });
      toast.success('Paramètres enregistrés avec succès');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Erreur lors de l\'enregistrement des paramètres');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Clear error for this field when typing
    if (errors[key]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[key];
        return newErrs;
      });
    }
  };

  if (loading) return <Skeleton className="h-[600px] w-full rounded-2xl" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General Information */}
        <div className="bg-[hsl(var(--admin-card))] rounded-2xl border border-[hsl(var(--admin-border))] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-muted))]/20">
            <h2 className="text-xl font-bold text-[hsl(var(--admin-foreground))]">Informations Générales</h2>
            <p className="text-sm text-[hsl(var(--admin-muted-foreground))]">Paramètres principaux de la plateforme.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="site_name">Nom du site <span className="text-destructive">*</span></Label>
                <Input 
                  id="site_name" 
                  value={settings?.site_name || ''} 
                  onChange={e => updateSetting('site_name', e.target.value)}
                  className={`bg-[hsl(var(--admin-background))] border-[hsl(var(--admin-border))] ${errors.site_name ? 'border-destructive' : ''}`}
                />
                {errors.site_name && <p className="text-sm text-destructive">{errors.site_name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commission_rate">Taux de commission (%) <span className="text-destructive">*</span></Label>
                <Input 
                  id="commission_rate" 
                  type="number"
                  min="0" max="100"
                  step="0.1"
                  value={settings?.commission_rate ?? ''} 
                  onChange={e => updateSetting('commission_rate', Number(e.target.value))}
                  className={`bg-[hsl(var(--admin-background))] border-[hsl(var(--admin-border))] ${errors.commission_rate ? 'border-destructive' : ''}`}
                />
                {errors.commission_rate && <p className="text-sm text-destructive">{errors.commission_rate}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_description">Description du site <span className="text-destructive">*</span></Label>
              <Textarea 
                id="site_description" 
                value={settings?.site_description || ''} 
                onChange={e => updateSetting('site_description', e.target.value)}
                className={`bg-[hsl(var(--admin-background))] border-[hsl(var(--admin-border))] min-h-[100px] ${errors.site_description ? 'border-destructive' : ''}`}
              />
              {errors.site_description && <p className="text-sm text-destructive">{errors.site_description}</p>}
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-[hsl(var(--admin-card))] rounded-2xl border border-[hsl(var(--admin-border))] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-muted))]/20">
            <h2 className="text-xl font-bold text-[hsl(var(--admin-foreground))]">Contact & Support</h2>
            <p className="text-sm text-[hsl(var(--admin-muted-foreground))]">Adresses email utilisées pour les communications.</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email de contact <span className="text-destructive">*</span></Label>
              <Input 
                id="contact_email" 
                type="email"
                value={settings?.contact_email || ''} 
                onChange={e => updateSetting('contact_email', e.target.value)}
                className={`bg-[hsl(var(--admin-background))] border-[hsl(var(--admin-border))] ${errors.contact_email ? 'border-destructive' : ''}`}
              />
              {errors.contact_email && <p className="text-sm text-destructive">{errors.contact_email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="support_email">Email de support <span className="text-destructive">*</span></Label>
              <Input 
                id="support_email" 
                type="email"
                value={settings?.support_email || ''} 
                onChange={e => updateSetting('support_email', e.target.value)}
                className={`bg-[hsl(var(--admin-background))] border-[hsl(var(--admin-border))] ${errors.support_email ? 'border-destructive' : ''}`}
              />
              {errors.support_email && <p className="text-sm text-destructive">{errors.support_email}</p>}
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-[hsl(var(--admin-card))] rounded-2xl border border-[hsl(var(--admin-border))] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-muted))]/20">
            <h2 className="text-xl font-bold text-[hsl(var(--admin-foreground))]">Fonctionnalités</h2>
            <p className="text-sm text-[hsl(var(--admin-muted-foreground))]">Activez ou désactivez les fonctionnalités clés de la plateforme.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Inscriptions des artisans</Label>
                <p className="text-sm text-[hsl(var(--admin-muted-foreground))]">Permettre aux nouveaux artisans de s'inscrire.</p>
              </div>
              <Switch 
                checked={settings?.artisan_registration_enabled || false}
                onCheckedChange={checked => updateSetting('artisan_registration_enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Inscriptions des clients</Label>
                <p className="text-sm text-[hsl(var(--admin-muted-foreground))]">Permettre aux nouveaux clients de s'inscrire.</p>
              </div>
              <Switch 
                checked={settings?.client_registration_enabled || false}
                onCheckedChange={checked => updateSetting('client_registration_enabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Approbation automatique</Label>
                <p className="text-sm text-[hsl(var(--admin-muted-foreground))]">Valider automatiquement les nouveaux artisans.</p>
              </div>
              <Switch 
                checked={settings?.auto_approve_artisans || false}
                onCheckedChange={checked => updateSetting('auto_approve_artisans', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Vérification Email</Label>
                <p className="text-sm text-[hsl(var(--admin-muted-foreground))]">Rendre la vérification d'email obligatoire.</p>
              </div>
              <Switch 
                checked={settings?.require_email_verification || false}
                onCheckedChange={checked => updateSetting('require_email_verification', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Vérification Téléphone</Label>
                <p className="text-sm text-[hsl(var(--admin-muted-foreground))]">Rendre la vérification par SMS obligatoire.</p>
              </div>
              <Switch 
                checked={settings?.require_phone_verification || false}
                onCheckedChange={checked => updateSetting('require_phone_verification', checked)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <Button 
            type="submit" 
            disabled={saving} 
            className="bg-[hsl(var(--admin-primary))] text-white hover:bg-[hsl(var(--admin-primary))]/90 min-w-[200px] h-12 text-base font-semibold"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;