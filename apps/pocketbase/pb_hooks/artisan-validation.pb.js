/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  const artisan = e.record;
  const statut = artisan.get("statut");
  
  // Only trigger if status changed to 'actif'
  if (statut === "actif") {
    try {
      // 1. Set date_validation to current date
      const today = new Date().toISOString().split('T')[0];
      artisan.set("date_validation", today);
      $app.save(artisan);
      
      // 2. Create notifications_admin record
      const notif = new $pb.Record("notifications_admin", {
        type: "nouvel_artisan",
        titre: "Artisan validé",
        description: "L'artisan " + artisan.get("name") + " (" + artisan.get("category") + ") a été validé"
      });
      $app.save(notif);
      
      // 3. Update admin_dashboard_stats
      const stats = $app.findFirstRecordByData("admin_dashboard_stats", "id", "!=", "");
      if (stats) {
        stats.set("artisans_actifs", (stats.get("artisans_actifs") || 0) + 1);
        stats.set("artisans_en_attente", Math.max(0, (stats.get("artisans_en_attente") || 0) - 1));
        $app.save(stats);
      }
    } catch (err) {
      console.log("Error in artisan-validation hook:", err);
    }
  }
  
  e.next();
}, "artisans");