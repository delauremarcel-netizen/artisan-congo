import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, BellRing } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const AdminNotificationsPage = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const [formData, setFormData] = useState({
    recipient_type: 'all',
    recipient_category: '',
    recipient_subscription_status: '',
    message_title: '',
    message_content: ''
  });

  const categories = [
    'Plomberie', 'Menuiserie', 'Électricité', 'Maçonnerie', 'Peinture', 'Soudure', 'Réparation automobile', 
    'Construction', 'Paysagisme', 'Carrelage', 'Couverture', 'Serrurerie', 'Climatisation', 'Plomberie Sanitaire', 
    'Électricité Industrielle', 'Charpenterie', 'Vitrerie', 'Chauffage', 'Isolation', 'Démolition', 'Terrassement', 
    'Béton', 'Ferronnerie', 'Plâtrerie', 'Décoration Intérieure'
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const records = await pb.collection('admin_notifications').getFullList({
        sort: '-created_date',
        $autoCancel: false
      });
      setNotifications(records);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.message_title || !formData.message_content) {
      toast.error('Veuillez remplir le titre et le contenu');
      return;
    }

    setSending(true);
    try {
      await pb.collection('admin_notifications').create({
        admin_id: currentUser.id,
        ...formData,
        status: 'sent'
      }, { $autoCancel: false });
      
      toast.success('Notification envoyée avec succès');
      setFormData({
        recipient_type: 'all', recipient_category: '', recipient_subscription_status: '', message_title: '', message_content: ''
      });
      fetchNotifications();
    } catch (error) {
      toast.error('Échec de l\'envoi de la notification');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Centre de Notifications - Admin</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background pt-20">
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-5rem)]">
          <AdminSidebar />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/20">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight">Centre de Notifications</h1>
              <p className="text-muted-foreground mt-1">Diffuser des annonces aux artisans</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="shadow-sm border-border/50 sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-primary" /> Nouvelle diffusion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSend} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Audience</Label>
                        <Select value={formData.recipient_type} onValueChange={(v) => setFormData({...formData, recipient_type: v})}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Sélectionner l'audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous les artisans</SelectItem>
                            <SelectItem value="category">Catégorie spécifique</SelectItem>
                            <SelectItem value="subscription_status">Par statut d'abonnement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.recipient_type === 'category' && (
                        <div className="space-y-2">
                          <Label>Sélectionner la catégorie</Label>
                          <Select value={formData.recipient_category} onValueChange={(v) => setFormData({...formData, recipient_category: v})}>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {formData.recipient_type === 'subscription_status' && (
                        <div className="space-y-2">
                          <Label>Sélectionner le statut</Label>
                          <Select value={formData.recipient_subscription_status} onValueChange={(v) => setFormData({...formData, recipient_subscription_status: v})}>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Forfait actif uniquement</SelectItem>
                              <SelectItem value="expired">Forfait expiré uniquement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2 pt-2">
                        <Label>Sujet</Label>
                        <Input 
                          value={formData.message_title}
                          onChange={(e) => setFormData({...formData, message_title: e.target.value})}
                          placeholder="Titre de l'annonce"
                          className="bg-background"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Contenu du message</Label>
                        <Textarea 
                          value={formData.message_content}
                          onChange={(e) => setFormData({...formData, message_content: e.target.value})}
                          placeholder="Tapez votre message ici..."
                          className="bg-background resize-none h-32"
                        />
                      </div>

                      <Button type="submit" className="w-full mt-2" disabled={sending}>
                        {sending ? 'Envoi en cours...' : 'Envoyer la diffusion'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="shadow-sm border-border/50 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BellRing className="w-5 h-5 text-secondary" /> Historique des diffusions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-12 text-muted-foreground">Chargement de l'historique...</div>
                    ) : notifications.length === 0 ? (
                      <div className="text-center py-12 border border-dashed rounded-xl bg-muted/30 text-muted-foreground">
                        Aucune notification envoyée pour le moment.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="p-4 border rounded-xl bg-card hover:bg-muted/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-foreground">{notif.message_title}</h4>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                {new Date(notif.created_date).toLocaleString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {notif.message_content}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs font-normal">
                                À: {notif.recipient_type === 'all' ? 'Tous' : notif.recipient_type === 'category' ? notif.recipient_category : notif.recipient_subscription_status}
                              </Badge>
                              <Badge className="bg-green-500/10 text-green-600 border-none px-2 py-0">
                                {notif.status === 'sent' ? 'envoyé' : notif.status === 'read' ? 'lu' : 'non lu'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminNotificationsPage;