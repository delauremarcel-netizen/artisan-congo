import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';

const RatingDistributionChart = ({ artisanId }) => {
  const [distribution, setDistribution] = useState({
    5: { count: 0, percent: 0 },
    4: { count: 0, percent: 0 },
    3: { count: 0, percent: 0 },
    2: { count: 0, percent: 0 },
    1: { count: 0, percent: 0 },
  });
  const [stats, setStats] = useState({ total: 0, average: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!artisanId) return;
      
      setLoading(true);
      try {
        const records = await pb.collection('ratings').getFullList({
          filter: `artisan_id="${artisanId}"`,
          $autoCancel: false
        });

        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let sum = 0;
        const total = records.length;

        records.forEach(record => {
          const rating = Math.round(record.rating);
          if (counts[rating] !== undefined) {
            counts[rating]++;
          }
          sum += record.rating;
        });

        const newDistribution = {};
        Object.keys(counts).forEach(key => {
          newDistribution[key] = {
            count: counts[key],
            percent: total > 0 ? Math.round((counts[key] / total) * 100) : 0
          };
        });

        setDistribution(newDistribution);
        setStats({
          total,
          average: total > 0 ? (sum / total).toFixed(1) : 0
        });
      } catch (error) {
        console.error('Error fetching rating distribution:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [artisanId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 flex-1 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (stats.total === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Star className="w-8 h-8 mx-auto mb-2 opacity-20" />
        <p>Aucun avis pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground">{stats.average.toString().replace('.', ',')}</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(stats.average) ? 'fill-[#FFD700] text-[#FFD700]' : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{stats.total} avis au total</div>
        </div>
      </div>

      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 w-16 shrink-0 text-muted-foreground">
              <span className="font-medium">{stars}</span>
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            
            <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#FFD700] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${distribution[stars].percent}%` }}
              />
            </div>
            
            <div className="w-20 shrink-0 text-right text-muted-foreground flex justify-end gap-2">
              <span className="font-medium text-foreground">{distribution[stars].percent}%</span>
              <span className="text-xs opacity-70 w-6">({distribution[stars].count})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingDistributionChart;