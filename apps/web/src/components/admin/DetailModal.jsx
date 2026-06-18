import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Briefcase, Calendar, User } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DetailModal = ({ isOpen, onClose, data, type = 'artisan' }) => {
  if (!data) return null;

  const renderArtisanDetails = () => {
    const avatarUrl = data.photos && data.photos.length > 0 
      ? pb.files.getUrl(data, data.photos[0]) 
      : null;

    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border">
            {avatarUrl ? (
              <img src={avatarUrl} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-muted-foreground/50" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold">{data.name}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">{data.category}</Badge>
              <Badge variant={data.status === 'Validé' ? 'success' : data.status === 'En attente' ? 'warning' : 'secondary'}>
                {data.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" /> <span className="text-foreground">{data.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" /> <span className="text-foreground">{data.phone || 'Non renseigné'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" /> <span className="text-foreground">{data.city}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-4 h-4" /> <span className="text-foreground">{data.experience_years || 0} ans d'expérience</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" /> <span className="text-foreground">Inscrit le {format(new Date(data.created), 'dd/MM/yyyy', { locale: fr })}</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Biographie</h4>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            {data.bio || 'Aucune biographie renseignée.'}
          </p>
        </div>

        {data.services_offered && (
          <div>
            <h4 className="font-semibold mb-2">Services proposés</h4>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              {data.services_offered}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderLeadDetails = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Demande #{data.id}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{data.category}</Badge>
            <Badge variant={data.status === 'Nouveau' ? 'default' : data.status === 'Terminé' ? 'success' : 'secondary'}>
              {data.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted p-4 rounded-xl">
          <div>
            <span className="text-muted-foreground block mb-1">Client</span>
            <span className="font-medium">{data.client_name}</span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-1">Téléphone</span>
            <span className="font-medium">{data.client_phone}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground block mb-1">Email</span>
            <span className="font-medium">{data.client_email}</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Description du projet</h4>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg whitespace-pre-wrap">
            {data.project_description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block mb-1">Artisan assigné</span>
            <span className="font-medium">{data.expand?.assigned_artisan?.name || 'Aucun artisan assigné'}</span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-1">Date de création</span>
            <span className="font-medium">{format(new Date(data.created), 'dd/MM/yyyy HH:mm', { locale: fr })}</span>
          </div>
        </div>

        {data.notes && (
          <div>
            <h4 className="font-semibold mb-2">Notes Admin</h4>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border">
              {data.notes}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails {type === 'artisan' ? "de l'artisan" : "de la demande"}</DialogTitle>
          <DialogDescription>
            Informations complètes du profil.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {type === 'artisan' ? renderArtisanDetails() : renderLeadDetails()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;