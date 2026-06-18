/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  const original = e.record.original();
  const wasCompleted = original.get("completed");
  const isNowCompleted = e.record.get("completed");
  
  // Only proceed if completed changed from false/null to true
  if (!isNowCompleted || wasCompleted === isNowCompleted) {
    e.next();
    return;
  }
  
  const artisanId = e.record.get("artisan_id");
  
  if (!artisanId) {
    console.error("missions-update-score: artisan_id is missing from mission record");
    e.next();
    return;
  }
  
  try {
    // Call scoring service to calculate artisan score
    scoringService.calculateArtisanScore(artisanId);
    console.log("missions-update-score: calculateArtisanScore completed for artisan " + artisanId);
    
    // Call scoring service to update artisan badge
    scoringService.updateArtisanBadge(artisanId);
    console.log("missions-update-score: updateArtisanBadge completed for artisan " + artisanId);
  } catch (error) {
    console.error("missions-update-score: Error updating score/badge for artisan " + artisanId + ": " + error.message);
  }
  
  e.next();
}, "missions");