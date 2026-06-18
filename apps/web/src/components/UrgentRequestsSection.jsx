import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, MapPin, Wrench, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';

const UrgentRequestsSection = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrgent = async () => {
      try {
        const records = await pb.collection('quote_requests').getList(1, 5, {
          filter: 'status="nouvelle"',
          sort: '-created',
          $autoCancel: false
        });
        setRequests(records.items);
      } catch (error) {
        console.error('Error fetching urgent requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUrgent();
  }, []);

  if (loading) {
    return (
      <Card className="mb-8">
        <CardHeader><CardTitle>Demandes Urgentes</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return null; // Don't show if no urgent requests
  }

  return (
    <Card className="mb-8 border-red-200 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" /> Demandes à assigner d'urgence
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/quotes?filter=nouvelle">Voir tout <ArrowRight className="w-4 h-4 ml-1" /></Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests.map(req => (
            <div key={req.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-red-50/50 rounded-xl border border-red-100 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="bg-red-500">Nouvelle</Badge>
                  <span className="font-semibold flex items-center gap-1"><Wrench className="w-3 h-3"/> {req.service_type}</span>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {req.location}</span>
                  <span>•</span>
                  <span>{new Date(req.created).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button size="sm" asChild className="w-full sm:w-auto">
                  <Link to={`/admin/quotes?id=${req.id}`}>Assigner</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UrgentRequestsSection;