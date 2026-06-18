import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, CheckCircle2, XCircle, AlertCircle, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

const NotificationsPanel = ({ artisanId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [artisanId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('notifications').getList(1, 50, {
        filter: `artisan_id="${artisanId}"`,
        sort: '-created',
        $autoCancel: false
      });
      setNotifications(records.items);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Erreur lors du chargement des notifications.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await pb.collection('notifications').update(id, { read: true }, { $autoCancel: false });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Erreur lors de la mise à jour.');
    }
  };

  const getIconAndColor = (type) => {
    switch (type) {
      case 'approved':
        return { icon: <CheckCircle2 className="w-5 h-5 text-success" />, bg: 'bg-success/10' };
      case 'rejected':
        return { icon: <XCircle className="w-5 h-5 text-destructive" />, bg: 'bg-destructive/10' };
      case 'suspended':
        return { icon: <AlertCircle className="w-5 h-5 text-accent" />, bg: 'bg-accent/10' };
      case 'deleted':
        return { icon: <Trash2 className="w-5 h-5 text-muted-foreground" />, bg: 'bg-muted' };
      default:
        return { icon: <Bell className="w-5 h-5 text-primary" />, bg: 'bg-primary/10' };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bell className="w-5 h-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
            <Bell className="w-12 h-12 mb-3 text-muted" />
            <p>Aucune notification pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {notifications.map((notif) => {
              const { icon, bg } = getIconAndColor(notif.status_change);
              const date = new Date(notif.created).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              return (
                <div 
                  key={notif.id} 
                  className={`flex gap-4 p-4 rounded-xl border transition-all ${notif.read ? 'bg-background opacity-75' : 'bg-muted/30 border-primary/20 shadow-sm'}`}
                >
                  <div className={`p-2 rounded-full h-fit flex-shrink-0 ${bg}`}>
                    {icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm ${notif.read ? 'text-muted-foreground' : 'font-medium text-foreground'}`}>
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <Clock className="w-3 h-3" />
                      <span>{date}</span>
                    </div>
                  </div>
                  {!notif.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs shrink-0" 
                      onClick={() => markAsRead(notif.id)}
                    >
                      Marquer lu
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;