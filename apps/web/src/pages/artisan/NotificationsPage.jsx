import React, { useState, useEffect } from 'react';
import { ArtisanDashboardLayout } from '@/components/artisan/ArtisanDashboardLayout.jsx';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle2, Trash2, FileText, MessageSquare, Star, AlertTriangle, DollarSign } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const getIconForType = (type) => {
  switch(type) {
    case 'nouveau_devis': return <FileText className="w-5 h-5 text-blue-500" />;
    case 'devis_accepte': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'devis_refuse': return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case 'commission_payee': return <DollarSign className="w-5 h-5 text-green-500" />;
    case 'avis_recu': return <Star className="w-5 h-5 text-yellow-500" />;
    case 'message_client': return <MessageSquare className="w-5 h-5 text-blue-500" />;
    default: return <Bell className="w-5 h-5 text-muted-foreground" />;
  }
};

const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      try {
        const res = await pb.collection('artisan_notifications').getList(1, 50, {
          filter: `artisan_id="${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setNotifications(res.items);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      await pb.collection('artisan_notifications').update(id, { lu: true }, { $autoCancel: false });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
    } catch (e) { console.error(e); }
  };

  return (
    <ArtisanDashboardLayout>
      <SEOHead title="Notifications | ArtisanCongo" />
      
      <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">Restez informé de l'activité de votre compte.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm"><CheckCircle2 className="w-4 h-4 mr-2" /> Tout marquer lu</Button>
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4 mr-2" /> Tout supprimer</Button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Chargement...</div>
          ) : notifications.length === 0 ? (
            <Card className="dashboard-card bg-muted/30 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-foreground">Aucune notification</p>
                <p className="text-muted-foreground">Vous êtes à jour !</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notif) => (
              <Card key={notif.id} className={`dashboard-card transition-colors ${!notif.lu ? 'bg-blue-500/5 border-blue-500/20' : ''}`}>
                <CardContent className="p-4 sm:p-6 flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notif.lu ? 'bg-background shadow-sm' : 'bg-muted'}`}>
                    {getIconForType(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className={`font-semibold ${!notif.lu ? 'text-foreground' : 'text-muted-foreground'}`}>{notif.titre}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(notif.created).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notif.description}</p>
                    {!notif.lu && (
                      <button onClick={() => markAsRead(notif.id)} className="text-xs font-medium text-blue-600 mt-3 hover:underline">
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ArtisanDashboardLayout>
  );
};

export default NotificationsPage;