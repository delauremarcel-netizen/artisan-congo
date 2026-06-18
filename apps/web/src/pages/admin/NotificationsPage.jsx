import React, { useState, useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Trash2, Info, UserPlus, FileText } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiServerClient.fetch('/admin/notifications?limit=50');
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin notifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'nouvel_artisan': return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'nouveau_devis': return <FileText className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <SEOHead title="Notifications Admin | Artisan Congo" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6" /> Notifications
          </h1>
          <p className="text-muted-foreground mt-1">Alerte système et événements importants.</p>
        </div>
        <Button variant="outline" className="bg-white">
          <CheckCircle className="w-4 h-4 mr-2" /> Tout marquer comme lu
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Chargement...</div>
        ) : notifications.length === 0 ? (
          <Card className="admin-card bg-muted/20 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-foreground">Aucune notification</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map(notif => (
            <Card key={notif.id} className={`admin-card transition-colors ${!notif.is_read ? 'bg-primary/5 border-primary/20' : ''}`}>
              <CardContent className="p-4 sm:p-5 flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notif.is_read ? 'bg-background shadow-sm' : 'bg-muted'}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className={`font-semibold ${!notif.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{notif.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(notif.created).toLocaleDateString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                </div>
                <div className="flex flex-col justify-center shrink-0">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4"/></Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;