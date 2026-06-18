/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const demande = e.record;
  const clientId = demande.get("client_id");
  const clientPays = demande.get("client_pays");
  const budgetEstime = demande.get("budget_estime") || 0;
  
  try {
    // 1. Update users record (client_id)
    const client = $app.findRecordById("users", clientId);
    if (client) {
      client.set("nombre_demandes", (client.get("nombre_demandes") || 0) + 1);
      $app.save(client);
    }
    
    // 2. Update demandes_par_pays
    let paysRecord = $app.findFirstRecordByData("demandes_par_pays", "pays", clientPays);
    if (!paysRecord) {
      paysRecord = new $pb.Record("demandes_par_pays", {
        pays: clientPays,
        nombre_demandes: 1,
        nombre_chantiers: 0,
        valeur_totale_demandes: budgetEstime,
        valeur_totale_chantiers: 0,
        commission_totale: 0
      });
    } else {
      paysRecord.set("nombre_demandes", (paysRecord.get("nombre_demandes") || 0) + 1);
      paysRecord.set("valeur_totale_demandes", (paysRecord.get("valeur_totale_demandes") || 0) + budgetEstime);
    }
    $app.save(paysRecord);
    
    // 3. Create notifications_admin record
    const notif = new $pb.Record("notifications_admin", {
      type: "nouveau_client",
      titre: "Nouvelle demande client",
      description: "Nouvelle demande de " + demande.get("client_nom") + " - Catégorie: " + demande.get("service_categorie")
    });
    $app.save(notif);
    
    // 4. Update admin_dashboard_stats
    const stats = $app.findFirstRecordByData("admin_dashboard_stats", "id", "!=", "");
    if (stats) {
      stats.set("total_demandes", (stats.get("total_demandes") || 0) + 1);
      stats.set("demandes_en_cours", (stats.get("demandes_en_cours") || 0) + 1);
      $app.save(stats);
    }
  } catch (err) {
    console.log("Error in demande-creation-cascade hook:", err);
  }
  
  e.next();
}, "demandes_clients");