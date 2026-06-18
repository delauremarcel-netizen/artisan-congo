import React from 'react';
import { Calendar, User } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMissionStatusColor } from '@/lib/artisanUtils.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MissionCard = ({ mission, onViewDetails }) => {
  const formatDate = (date) => {
    if (!date) return 'Non définie';
    try {
      return format(new Date(date), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-2">
              {mission.title}
            </h3>
            {mission.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {mission.description}
              </p>
            )}
          </div>
          <Badge className={getMissionStatusColor(mission.status)}>
            {mission.status}
          </Badge>
        </div>

        <div className="space-y-2">
          {mission.company_id && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Client: {mission.company_name || mission.company_id}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Début: {formatDate(mission.created)}</span>
          </div>

          {mission.deadline && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Échéance: {formatDate(mission.deadline)}</span>
            </div>
          )}

          {mission.budget && (
            <div className="text-sm font-semibold text-foreground mt-2">
              Budget: {mission.budget.toLocaleString('fr-FR')} FCFA
            </div>
          )}
        </div>
      </CardContent>

      {onViewDetails && (
        <CardFooter className="p-6 pt-0">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onViewDetails(mission)}
          >
            Voir détails
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MissionCard;