/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  const artisanId = e.record.get("artisan_id");
  
  if (!artisanId) {
    console.error("reviews-update-score-on-update: artisan_id is missing from review record");
    e.next();
    return;
  }
  
  try {
    // Call scoring service to calculate artisan score
    scoringService.calculateArtisanScore(artisanId);
    console.log("reviews-update-score-on-update: calculateArtisanScore completed for artisan " + artisanId);
    
    // Call scoring service to update artisan badge
    scoringService.updateArtisanBadge(artisanId);
    console.log("reviews-update-score-on-update: updateArtisanBadge completed for artisan " + artisanId);
  } catch (error) {
    console.error("reviews-update-score-on-update: Error updating score/badge for artisan " + artisanId + ": " + error.message);
  }
  
  e.next();
}, "reviews");