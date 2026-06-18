import 'dotenv/config';
import cron from 'node-cron';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { calculateArtisanScore, updateArtisanBadge } from '../services/scoringService.js';

/**
 * Initialize daily score recalculation cron job
 * Runs at 00:00 UTC every day to recalculate scores and update badges for all artisans
 */
export function initializeDailyScoreRecalculation() {
  logger.info('Initializing daily score recalculation cron job...');

  // Schedule cron job: 0 0 * * * = 00:00 UTC every day
  const job = cron.schedule('0 0 * * *', async () => {
    const startTime = new Date();
    logger.info('Daily score recalculation cron job started', { timestamp: startTime.toISOString() });

    let processedCount = 0;
    let errorCount = 0;
    const errors = [];

    try {
      // Fetch all artisans from artisans collection
      logger.info('Fetching all artisans for score recalculation...');
      const artisans = await pb.collection('artisans').getFullList();
      logger.info(`Found ${artisans.length} artisans for score recalculation`);

      // Process each artisan
      for (const artisan of artisans) {
        try {
          logger.info(`Recalculating score for artisan: ${artisan.id} (${artisan.nom})`);

          // Calculate score
          const scoreResult = await calculateArtisanScore(artisan.id);
          logger.info(`Score calculated for artisan ${artisan.id}: ${scoreResult.score_global}`);

          // Update badge based on new score
          const badgeResult = await updateArtisanBadge(artisan.id);
          logger.info(`Badge updated for artisan ${artisan.id}: ${badgeResult.badge}`);

          processedCount++;
        } catch (error) {
          errorCount++;
          const errorMsg = `Failed to recalculate score for artisan ${artisan.id} (${artisan.nom}): ${error.message}`;
          logger.error(errorMsg);
          errors.push(errorMsg);
          // Continue processing remaining artisans
        }
      }

      const endTime = new Date();
      const duration = endTime - startTime;

      // Log completion
      logger.info('Daily score recalculation cron job completed', {
        timestamp: endTime.toISOString(),
        processedCount,
        errorCount,
        totalArtisans: artisans.length,
        durationMs: duration,
      });

      if (errors.length > 0) {
        logger.warn('Score recalculation completed with errors:', {
          errorCount,
          errors: errors.slice(0, 10), // Log first 10 errors
        });
      }
    } catch (error) {
      logger.error('Daily score recalculation cron job failed with critical error:', {
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      // Do not crash the cron job - continue running
    }
  });

  logger.info('Daily score recalculation cron job scheduled (0 0 * * * UTC)');
  return job;
}