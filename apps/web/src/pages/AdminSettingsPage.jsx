import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import AdminDashboardLayout from '@/components/AdminDashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Save, Globe, DollarSign, MessageCircle, Mail, ShieldCheck, Bell, Sliders } from 'lucide-react';

const AdminSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

  // Settings states mapped directly to DB schema
  const [formData, setFormData] = useState({
    site_name: 'Artisan Congo',
    site_description: '',
    contact_email: '',
    support_email: '',
    commission_rate: 10,
    require_email_verification: false,
    require_phone_verification: false,
    auto_approve_artisans: false,
    artisan_registration_enabled: true,
    client_registration_enabled: true,
  });

  // UI-only placeholders for settings not in DB schema but requested in UI
  const [mockData, setMockData] = useState({
    whatsapp_number: '33605884875',
    currency: 'FCFA',
    maintenance_mode: false
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // Assuming a single global settings record exists. We get the first one.
        const records = await pb.collection('admin_settings').getList(1, 1, { $autoCancel: false });
        if (records.items.length > 0) {
          const s = records.items[0];
          setSettingsId(s.id);
          setFormData({
            site_name: s.site_name || '',
            site_description: s.site_description || '',
            contact_email: s.contact_email || '',
            support_email: s.support_email || '',
            commission_rate: s.commission_rate || 10,
            require_email_verification: !!s.require_email_verification,
            require_phone_verification: !!s.require_phone_verification,
            auto_approve_artisans: !!s.auto_approve_artisans,
            artisan_registration_enabled: !!s.artisan_registration_enabled,
            client_registration_enabled: !!s.client_registration_enabled,
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        // Do not block UI, allow them to see the default form
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMockChange = (field, value) => {
    setMockData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (settingsId) {
        await pb.collection('admin_settings').update(settingsId, formData, { $autoCancel: false });
      } else {
        // Create if doesn't exist
        const newRecord = await pb.collection('admin_settings').create(formData, { $autoCancel: false });
        setSettingsId(newRecord.id);
      }
      toast.success('Paramètres enregistrés avec succès.');
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de l\'enregistrement des paramètres.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout title="Paramètres" breadcrumbs={[{ label: 'Paramètres' }]}>
        <div className="flex items-center justify-center h-64"><span className="animate-pulse text-muted-foreground">Chargement des paramètres...</span></div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title="Paramètres du Système" breadcrumbs={[{ label: 'Paramètres' }]}>
      <Helmet><title>Paramètres | Admin ArtisanCongo</title></Helmet>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        {/* Navigation Sidebar (ScrollSpy style) */}
        <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-[100px] space-y-2">
          <Card className="border-border shadow-sm p-2">
            <nav className="flex flex-col gap-1 text-sm font-medium">
              <a href="#general" className="px-3 py-2 rounded-lg hover:bg-muted text-foreground flex items-center gap-2"><Globe className="w-4 h-4"/> Général</a>
              <a href="#commission" className="px-3 py-2 rounded-lg hover:bg-muted text-foreground flex items-center gap-2"><DollarSign className="w-4 h-4"/> Commissions</a>
              <a href="#whatsapp" className="px-3 py-2 rounded-lg hover:bg-muted text-foreground flex items-center gap-2"><MessageCircle className="w-4 h-4"/> WhatsApp</a>
              <a href="#email" className="px-3 py-2 rounded-lg hover:bg-muted text-foreground flex items-center gap-2"><Mail className="w-4 h-4"/> Emails</a>
              <a href="#security" className="px-3 py-2 rounded-lg hover:bg-muted text-foreground flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Sécurité</a>
              <a href="#advanced" className="px-3 py-2 rounded-lg hover:bg-muted text-foreground flex items-center gap-2"><Sliders className="w-4 h-4"/> Avancé</a>
            </nav>
          </Card>
          
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            {saving ? <span className="animate-spin mr-2 border-2 border-current border-t-transparent rounded-full w-4 h-4" /> : <Save className="w-4 h-4 mr-2" />}
            Enregistrer tout
          </Button>
        </div>

        {/* Settings Sections */}
        <div className="flex-1 space-y-8 min-w-0 pb-20">
          
          {/* Section 1: Général */}
          <Card id="general" className="scroll-mt-24 border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><Globe className="w-5 h-5 text-primary"/> Paramètres Généraux</CardTitle>
              <CardDescription>Informations de base de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="site_name">Nom du site</Label>
                <Input id="site_name" value={formData.site_name} onChange={(e) => handleChange('site_name', e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="site_desc">Description SEO</Label>
                <Textarea id="site_desc" value={formData.site_description} onChange={(e) => handleChange('site_description', e.target.value)} rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Commission */}
          <Card id="commission" className="scroll-mt-24 border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary"/> Paramètres Commission</CardTitle>
              <CardDescription>Taux appliqués sur les devis validés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 max-w-md">
                <Label htmlFor="comm_rate">Taux de commission par défaut (%)</Label>
                <Input id="comm_rate" type="number" min="0" max="100" value={formData.commission_rate} onChange={(e) => handleChange('commission_rate', Number(e.target.value))} />
                <p className="text-xs text-muted-foreground">Appliqué automatiquement lors de la création d'un devis si aucun taux spécifique n'est défini.</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: WhatsApp */}
          <Card id="whatsapp" className="scroll-mt-24 border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><MessageCircle className="w-5 h-5 text-primary"/> Paramètres WhatsApp</CardTitle>
              <CardDescription>Configuration du numéro de contact centralisé</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 max-w-md">
                <Label htmlFor="wa_num">Numéro WhatsApp Officiel (format international)</Label>
                <Input id="wa_num" value={mockData.whatsapp_number} onChange={(e) => handleMockChange('whatsapp_number', e.target.value)} placeholder="Ex: 33605884875" />
                <p className="text-xs text-muted-foreground">Numéro utilisé pour la redirection depuis les profils artisans.</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Email */}
          <Card id="email" className="scroll-mt-24 border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><Mail className="w-5 h-5 text-primary"/> Paramètres Email</CardTitle>
              <CardDescription>Adresses de contact et de support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact_email">Email de Contact</Label>
                  <Input id="contact_email" type="email" value={formData.contact_email} onChange={(e) => handleChange('contact_email', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="support_email">Email du Support Technique</Label>
                  <Input id="support_email" type="email" value={formData.support_email} onChange={(e) => handleChange('support_email', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Security */}
          <Card id="security" className="scroll-mt-24 border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary"/> Sécurité & Inscriptions</CardTitle>
              <CardDescription>Contrôlez l'accès et les validations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Inscriptions Artisans</Label>
                  <p className="text-sm text-muted-foreground">Autoriser de nouveaux artisans à s'inscrire.</p>
                </div>
                <Switch checked={formData.artisan_registration_enabled} onCheckedChange={(v) => handleChange('artisan_registration_enabled', v)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Inscriptions Clients</Label>
                  <p className="text-sm text-muted-foreground">Autoriser de nouveaux clients à créer un compte.</p>
                </div>
                <Switch checked={formData.client_registration_enabled} onCheckedChange={(v) => handleChange('client_registration_enabled', v)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Validation Automatique</Label>
                  <p className="text-sm text-muted-foreground">Approuver automatiquement les profils sans validation manuelle.</p>
                </div>
                <Switch checked={formData.auto_approve_artisans} onCheckedChange={(v) => handleChange('auto_approve_artisans', v)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Vérification Email Obligatoire</Label>
                  <p className="text-sm text-muted-foreground">Exiger la validation de l'email avant connexion.</p>
                </div>
                <Switch checked={formData.require_email_verification} onCheckedChange={(v) => handleChange('require_email_verification', v)} />
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Advanced */}
          <Card id="advanced" className="scroll-mt-24 border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><Sliders className="w-5 h-5 text-primary"/> Paramètres Avancés</CardTitle>
              <CardDescription>Configuration technique de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-orange-600 font-semibold">Mode Maintenance</Label>
                  <p className="text-sm text-muted-foreground">Verrouille le site pour tous les utilisateurs non-admins.</p>
                </div>
                <Switch checked={mockData.maintenance_mode} onCheckedChange={(v) => handleMockChange('maintenance_mode', v)} />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminSettingsPage;