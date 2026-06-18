import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient.js';

const ReviewsList = ({ artisanId }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, [artisanId, sortBy]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      let sortField = '-created';
      if (sortBy === 'highest') sortField = '-rating';
      if (sortBy === 'lowest') sortField = 'rating';

      const records = await pb.collection('reviews').getFullList({
        filter: `artisan_id = "${artisanId}"`,
        sort: sortField,
        $autoCancel: false
      });

      setReviews(records);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    if (reviews.length === 0) return { average: 0, distribution: [] };

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = (total / reviews.length).toFixed(1);

    const distribution = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: reviews.filter(r => r.rating === stars).length
    }));

    return { average, distribution };
  };

  const { average, distribution } = calculateStats();

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun avis pour le moment</h3>
          <p className="text-muted-foreground">Cet artisan n'a pas encore reçu d'avis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold text-foreground mb-2">{average}</div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                {renderStars(Math.round(parseFloat(average)))}
              </div>
              <p className="text-muted-foreground">Basé sur {reviews.length} avis</p>
            </div>

            {/* Rating Distribution Chart */}
            <div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={distribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stars" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tous les avis ({reviews.length})</h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Plus récents</SelectItem>
            <SelectItem value="highest">Note la plus élevée</SelectItem>
            <SelectItem value="lowest">Note la plus basse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {paginatedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{review.customer_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(review.created), 'dd MMMM yyyy')}
                  </p>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-foreground leading-relaxed">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;