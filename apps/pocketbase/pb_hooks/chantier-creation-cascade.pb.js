/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const chantier = e.record;
  const artisanId = chantier.get("artisan_id");
  const clientId = chantier.get("client_id");
  const montantTotal = chantier.get("montant_total");
  const clientPays = chantier.get("client_pays");
  const artisanMetier = chantier.get("artisan_metier");
  const artisanVille = chantier.get("artisan_ville");
  
  // Calculate 20% commission
  const commission = montantTotal * 0.2;
  
  try {
    // 1. Create commission_artisans record
    const commissionRecord = new $pb.Record("commissions_artisans", {
      artisan_id: artisanId,
      artisan_nom: chantier.get("artisan_nom"),
      artisan_metier: artisanMetier,
      artisan_ville: artisanVille,
      chantier_id: chantier.id,
      montant_chantier: montantTotal,
      pourcentage_commission: 20,
      montant_commission: commission,
      statut: "due"
    });
    $app.save(commissionRecord);
    
    // 2. Update artisan record
    const artisan = $app.findRecordById("artisans", artisanId);
    if (artisan) {
      artisan.set("nombre_chantiers_completes", (artisan.get("nombre_chantiers_completes") || 0) + 1);
      artisan.set("chiffre_affaires_genere", (artisan.get("chiffre_affaires_genere") || 0) + montantTotal);
      artisan.set("commissions_generees", (artisan.get("commissions_generees") || 0) + commission);
      $app.save(artisan);
    }
    
    // 3. Update commissions_par_metier
    let metierRecord = $app.findFirstRecordByData("commissions_par_metier", "metier", artisanMetier);
    if (!metierRecord) {
      metierRecord = new $pb.Record("commissions_par_metier", {
        metier: artisanMetier,
        nombre_chantiers: 1,
        montant_total_chantiers: montantTotal,
        commission_totale: commission,
        nombre_artisans: 1
      });
    } else {
      metierRecord.set("nombre_chantiers", (metierRecord.get("nombre_chantiers") || 0) + 1);
      metierRecord.set("montant_total_chantiers", (metierRecord.get("montant_total_chantiers") || 0) + montantTotal);
      metierRecord.set("commission_totale", (metierRecord.get("commission_totale") || 0) + commission);
    }
    $app.save(metierRecord);
    
    // 4. Update commissions_par_ville
    let villeRecord = $app.findFirstRecordByData("commissions_par_ville", "ville", artisanVille);
    if (!villeRecord) {
      villeRecord = new $pb.Record("commissions_par_ville", {
        ville: artisanVille,
        nombre_chantiers: 1,
        montant_total_chantiers: montantTotal,
        commission_totale: commission,
        nombre_artisans: 1
      });
    } else {
      villeRecord.set("nombre_chantiers", (villeRecord.get("nombre_chantiers") || 0) + 1);
      villeRecord.set("montant_total_chantiers", (villeRecord.get("montant_total_chantiers") || 0) + montantTotal);
      villeRecord.set("commission_totale", (villeRecord.get("commission_totale") || 0) + commission);
    }
    $app.save(villeRecord);
    
    // 5. Update demandes_par_pays
    let paysRecord = $app.findFirstRecordByData("demandes_par_pays", "pays", clientPays);
    if (!paysRecord) {
      paysRecord = new $pb.Record("demandes_par_pays", {
        pays: clientPays,
        nombre_demandes: 0,
        nombre_chantiers: 1,
        valeur_totale_demandes: 0,
        valeur_totale_chantiers: montantTotal,
        commission_totale: commission
      });
    } else {
      paysRecord.set("nombre_chantiers", (paysRecord.get("nombre_chantiers") || 0) + 1);
      paysRecord.set("valeur_totale_chantiers", (paysRecord.get("valeur_totale_chantiers") || 0) + montantTotal);
      paysRecord.set("commission_totale", (paysRecord.get("commission_totale") || 0) + commission);
    }
    $app.save(paysRecord);
    
    // 6. Create notifications_admin record
    const notif = new $pb.Record("notifications_admin", {
      type: "nouveau_chantier",
      titre: "Nouveau chantier créé",
      description: "Nouveau chantier créé pour " + chantier.get("artisan_nom") + " - Montant: " + montantTotal
    });
    $app.save(notif);
    
    // 7. Update admin_dashboard_stats
    const stats = $app.findFirstRecordByData("admin_dashboard_stats", "id", "!=", "");
    if (stats) {
      stats.set("total_chantiers_en_cours", (stats.get("total_chantiers_en_cours") || 0) + 1);
      stats.set("valeur_totale_chantiers", (stats.get("valeur_totale_chantiers") || 0) + montantTotal);
      stats.set("commissions_totales", (stats.get("commissions_totales") || 0) + commission);
      $app.save(stats);
    }
  } catch (err) {
    console.log("Error in chantier-creation-cascade hook:", err);
  }
  
  e.next();
}, "chantiers");