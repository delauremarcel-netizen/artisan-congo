/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  const commission = e.record;
  const statut = commission.get("statut");
  
  // Only trigger if status changed to 'encaissee'
  if (statut === "encaissee") {
    try {
      const artisanId = commission.get("artisan_id");
      const montantCommission = commission.get("montant_commission");
      
      // 1. Set date_paiement to current date
      const today = new Date().toISOString().split('T')[0];
      commission.set("date_paiement", today);
      $app.save(commission);
      
      // 2. Update artisan record
      const artisan = $app.findRecordById("artisans", artisanId);
      if (artisan) {
        artisan.set("commissions_payees", (artisan.get("commissions_payees") || 0) + montantCommission);
        artisan.set("commissions_en_attente", Math.max(0, (artisan.get("commissions_en_attente") || 0) - montantCommission));
        $app.save(artisan);
      }
      
      // 3. Create notifications_admin record
      const notif = new $pb.Record("notifications_admin", {
        type: "nouvelle_commission",
        titre: "Commission payée",
        description: "Commission de " + montantCommission + " payée à " + commission.get("artisan_nom")
      });
      $app.save(notif);
      
      // 4. Update admin_dashboard_stats
      const stats = $app.findFirstRecordByData("admin_dashboard_stats", "id", "!=", "");
      if (stats) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        stats.set("revenus_mois", (stats.get("revenus_mois") || 0) + montantCommission);
        stats.set("revenus_annee", (stats.get("revenus_annee") || 0) + montantCommission);
        $app.save(stats);
      }
    } catch (err) {
      console.log("Error in commission-payment hook:", err);
    }
  }
  
  e.next();
}, "commissions_artisans");