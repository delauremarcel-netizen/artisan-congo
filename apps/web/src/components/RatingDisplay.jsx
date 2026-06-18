import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient';

const RatingDisplay = ({ artisanId }) => {
  const [data, setData] = useState({ avg: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artisanId) return;

    const fetchRatingStats = async () => {
      try {
        const records = await pb.collection('ratings').getFullList({
          filter: `artisan_id="${artisanId}"`,
          fields: 'rating',
          $autoCancel: false
        });

        if (records.length > 0) {
          const sum = records.reduce((acc, curr) => acc + curr.rating, 0);
          setData({
            avg: sum / records.length,
            count: records.length
          });
        }
      } catch (error) {
        console.error('Error fetching rating stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatingStats();
  }, [artisanId]);

  if (loading) {
    return <Skeleton className="h-8 w-40 rounded-lg" />;
  }

  if (data.count === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground/80 bg-muted/40 w-max px-3 py-1.5 rounded-lg border border-border/50">
        <Star className="w-4 h-4" />
        <span className="text-sm font-medium">Nouveau sur la plateforme</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-lg border shadow-sm w-max">
        <span className="font-bold text-lg leading-none text-foreground">
          {data.avg.toFixed(1).replace('.', ',')}
        </span>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${star <= Math.round(data.avg) ? 'star-filled' : 'star-empty'}`}
            />
          ))}
        </div>
      </div>
      <span className="text-sm text-muted-foreground font-medium underline decoration-dashed decoration-muted-foreground/30 underline-offset-4 cursor-default">
        {data.count} avis {data.count > 1 ? 'clients' : 'client'}
      </span>
    </div>
  );
};

export default RatingDisplay;