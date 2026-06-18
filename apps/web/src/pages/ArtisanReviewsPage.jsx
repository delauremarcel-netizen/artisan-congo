import React, { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import ArtisanSidebar from '@/components/ArtisanSidebar.jsx';
import ReviewCard from '@/components/ReviewCard.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const ArtisanReviewsPage = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const reviewsPerPage = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);

        let sortOption = '-created';
        if (sortBy === 'oldest') sortOption = 'created';
        if (sortBy === 'highest') sortOption = '-rating';
        if (sortBy === 'lowest') sortOption = 'rating';

        const reviewsData = await pb.collection('reviews').getList(currentPage, reviewsPerPage, {
          filter: `artisan_id = "${currentUser.id}"`,
          sort: sortOption,
          $autoCancel: false,
        });

        setReviews(reviewsData.items);
        setTotalPages(reviewsData.totalPages);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        toast.error('Erreur lors du chargement des avis');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentUser, currentPage, sortBy]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <ArtisanSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-32" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <ArtisanSidebar />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Mes Avis
            </h1>
            <p className="text-muted-foreground">
              {reviews.length} avis au total
            </p>
          </div>

          {/* Summary Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Note moyenne
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold text-foreground">
                      {calculateAverageRating()}
                    </span>
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(parseFloat(calculateAverageRating())))}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Trier par
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Plus récent</SelectItem>
                      <SelectItem value="oldest">Plus ancien</SelectItem>
                      <SelectItem value="highest">Note la plus élevée</SelectItem>
                      <SelectItem value="lowest">Note la plus basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <span className="text-sm text-muted-foreground px-4">
                    Page {currentPage} sur {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Aucun avis pour le moment
                </h3>
                <p className="text-muted-foreground">
                  Les avis de vos clients apparaîtront ici.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanReviewsPage;