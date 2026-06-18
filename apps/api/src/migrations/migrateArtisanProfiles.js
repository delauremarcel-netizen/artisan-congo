import 'dotenv/config';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { calculateArtisanScore } from '../services/scoringService.js';

/**
 * Migration script to update all artisan profiles with initial verification status and scores
 * Fetches all artisans, updates their status, and calculates initial scores
 */
export async function runMigration() {
  logger.info('Starting artisan profiles migration...');

  let migratedCount = 0;
  let errorCount = 0;
  const errors = [];

  try {
    // Fetch all artisans from artisans collection
    logger.info('Fetching all artisans from artisans collection...');
    const artisans = await pb.collection('artisans').getFullList();
    logger.info(`Found ${artisans.length} artisans to migrate`);

    // Process each artisan
    for (const artisan of artisans) {
      try {
        logger.info(`Processing artisan: ${artisan.id} (${artisan.nom})`);

        // Update artisan with verification status and badge
        const updateData = {
          statut_artisan: 'verifie',
          charte_acceptee: true,
          badge: 'verifie',
          last_activity: new Date().toISOString(),
        };

        logger.info(`Updating artisan ${artisan.id} with verification status...`);
        await pb.collection('artisans').update(artisan.id, updateData);

        // Calculate initial score
        logger.info(`Calculating score for artisan ${artisan.id}...`);
        const scoreResult = await calculateArtisanScore(artisan.id);

        // Update artisan with calculated score
        logger.info(`Updating artisan ${artisan.id} with calculated score: ${scoreResult.score_global}`);
        await pb.collection('artisans').update(artisan.id, {
          score_global: scoreResult.score_global,
        });

        migratedCount++;
        logger.info(`✓ Successfully migrated artisan ${artisan.id} (${artisan.nom})`);
      } catch (error) {
        errorCount++;
        const errorMsg = `Failed to migrate artisan ${artisan.id} (${artisan.nom}): ${error.message}`;
        logger.error(errorMsg);
        errors.push(errorMsg);
        // Continue processing remaining artisans
      }
    }

    // Log migration summary
    logger.info('Migration completed', {
      totalArtisans: artisans.length,
      migratedCount,
      errorCount,
      successRate: `${((migratedCount / artisans.length) * 100).toFixed(2)}%`,
    });

    if (errors.length > 0) {
      logger.warn('Migration completed with errors:', errors);
    }

    return {
      success: true,
      totalArtisans: artisans.length,
      migratedCount,
      errorCount,
      errors: errors.length > 0 ? errors : null,
    };
  } catch (error) {
    logger.error('Migration failed with critical error:', error.message);
    throw new Error(`Artisan profiles migration failed: ${error.message}`);
  }
}