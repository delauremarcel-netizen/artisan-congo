import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

/**
 * Calculate artisan score based on reviews, missions, and completion rate
 * @param {string} artisanId - The ID of the artisan
 * @returns {Promise<{success: boolean, score_global: number, artisanId: string}>}
 */
export async function calculateArtisanScore(artisanId) {
  if (!artisanId) {
    throw new Error('artisanId is required');
  }

  logger.info('Calculating score for artisan', { artisanId });

  try {
    // Fetch artisan from artisans collection
    const artisan = await pb.collection('artisans').getOne(artisanId);
    logger.info('Artisan profile fetched', { artisanId, artisanName: artisan.nom });

    // Fetch all reviews for this artisan
    const reviewsResponse = await pb.collection('avis').getFullList({
      filter: `artisan_id = "${artisanId}"`,
    });
    const reviews = reviewsResponse || [];
    logger.info('Reviews fetched', { artisanId, reviewsCount: reviews.length });

    // Fetch all demandes for this artisan
    const demandesResponse = await pb.collection('demandes').getFullList({
      filter: `artisan_id = "${artisanId}"`,
    });
    const demandes = demandesResponse || [];
    logger.info('Demandes fetched', { artisanId, demandesCount: demandes.length });

    // Calculate metrics
    const reviews_count = reviews.length;
    const demandes_count = demandes.length;

    // Calculate rating average
    let rating_average = 0;
    if (reviews_count > 0) {
      const totalRating = reviews.reduce((sum, review) => {
        const rating = parseFloat(review.note) || 0;
        return sum + rating;
      }, 0);
      rating_average = totalRating / reviews_count;
    }
    logger.info('Rating average calculated', { artisanId, rating_average });

    // Calculate completion rate
    let completed_demandes = 0;
    let completion_rate = 0;
    if (demandes_count > 0) {
      completed_demandes = demandes.filter((demande) => demande.statut === 'terminée').length;
      completion_rate = (completed_demandes / demandes_count) * 100;
    }
    logger.info('Completion rate calculated', { artisanId, completed_demandes, completion_rate });

    // Default response rate
    const response_rate = 100;

    // Apply scoring formula
    const score_global = Math.round(
      ((rating_average / 5) * 40 +
        Math.min(demandes_count / 10, 1) * 30 +
        (completion_rate / 100) * 20 +
        (response_rate / 100) * 10) *
        100
    );

    logger.info('Score calculated', {
      artisanId,
      score_global,
      rating_average,
      demandes_count,
      completion_rate,
      response_rate,
    });

    // Update artisans record
    const updatedArtisan = await pb.collection('artisans').update(artisanId, {
      avisNote: rating_average,
      nombreAvis: reviews_count,
      score_global,
      last_activity: new Date().toISOString(),
    });

    logger.info('Artisan profile updated with score', {
      artisanId,
      score_global,
      rating_average,
      reviews_count,
      demandes_count,
    });

    return {
      success: true,
      score_global,
      artisanId,
    };
  } catch (error) {
    logger.error('Error calculating artisan score', {
      artisanId,
      error: error.message,
    });
    throw new Error(`Failed to calculate score for artisan ${artisanId}: ${error.message}`);
  }
}

/**
 * Update artisan badge based on score and status
 * @param {string} artisanId - The ID of the artisan
 * @returns {Promise<{success: boolean, badge: string, artisanId: string}>}
 */
export async function updateArtisanBadge(artisanId) {
  if (!artisanId) {
    throw new Error('artisanId is required');
  }

  logger.info('Updating badge for artisan', { artisanId });

  try {
    // Fetch artisan from artisans collection
    const artisan = await pb.collection('artisans').getOne(artisanId);
    logger.info('Artisan profile fetched for badge update', {
      artisanId,
      artisanName: artisan.nom,
      is_suspended: artisan.is_suspended,
      score_global: artisan.score_global,
      statut_artisan: artisan.statut_artisan,
    });

    // Determine badge based on logic
    let badge = 'debutant'; // Default badge

    if (artisan.is_suspended === true) {
      badge = 'suspendu';
      logger.info('Badge determined: suspendu (artisan is suspended)', { artisanId });
    } else if (artisan.score_global >= 85) {
      badge = 'top';
      logger.info('Badge determined: top (score >= 85)', { artisanId, score: artisan.score_global });
    } else if (artisan.statut_artisan === 'certifie' && artisan.score_global >= 80) {
      badge = 'premium';
      logger.info('Badge determined: premium (certified and score >= 80)', {
        artisanId,
        score: artisan.score_global,
      });
    } else if (artisan.statut_artisan === 'verifie') {
      badge = 'verifie';
      logger.info('Badge determined: verifie (verified status)', { artisanId });
    } else {
      logger.info('Badge determined: debutant (default)', { artisanId });
    }

    // Update artisans with badge
    const updatedArtisan = await pb.collection('artisans').update(artisanId, {
      badge,
    });

    logger.info('Artisan badge updated successfully', { artisanId, badge });

    return {
      success: true,
      badge,
      artisanId,
    };
  } catch (error) {
    logger.error('Error updating artisan badge', {
      artisanId,
      error: error.message,
    });
    throw new Error(`Failed to update badge for artisan ${artisanId}: ${error.message}`);
  }
}