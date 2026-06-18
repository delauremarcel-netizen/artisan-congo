/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const artisanId = e.record.get("artisanId");
  
  if (!artisanId) {
    e.next();
    return;
  }
  
  // Get all avis records for this artisan
  const avisList = $app.findRecordsByFilter("avis", "artisanId = '" + artisanId + "'", "-created", 0);
  
  if (!avisList || avisList.length === 0) {
    e.next();
    return;
  }
  
  // Calculate average rating
  let totalNote = 0;
  for (let i = 0; i < avisList.length; i++) {
    const note = avisList[i].get("note");
    if (note) {
      totalNote += parseFloat(note);
    }
  }
  
  const averageNote = totalNote / avisList.length;
  const nombreAvis = avisList.length;
  
  // Update artisan record
  const artisan = $app.findRecordById("artisans", artisanId);
  if (artisan) {
    artisan.set("avisNote", averageNote);
    artisan.set("nombreAvis", nombreAvis);
    
    try {
      $app.save(artisan);
    } catch (err) {
      console.log("Error updating artisan rating:", err);
    }
  }
  
  e.next();
}, "avis");