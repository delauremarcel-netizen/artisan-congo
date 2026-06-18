/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("artisan_profiles");

  const record0 = new Record(collection);
    const record0_artisan_idLookup = app.findFirstRecordByFilter("users", "email='jean.dupont@email.com'");
    if (!record0_artisan_idLookup) { throw new Error("Lookup failed for artisan_id: no record in 'users' matching \"email='jean.dupont@email.com'\""); }
    record0.set("artisan_id", record0_artisan_idLookup.id);
    record0.set("name", "Jean Dupont");
    record0.set("category", "\u00c9lectricit\u00e9");
    record0.set("city", "Kinshasa");
    record0.set("bio", "\u00c9lectricien professionnel avec 10 ans d'exp\u00e9rience");
    record0.set("experience_years", 10);
    record0.set("profile_visibility", "visible");
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    const record1_artisan_idLookup = app.findFirstRecordByFilter("users", "email='marie.kamba@email.com'");
    if (!record1_artisan_idLookup) { throw new Error("Lookup failed for artisan_id: no record in 'users' matching \"email='marie.kamba@email.com'\""); }
    record1.set("artisan_id", record1_artisan_idLookup.id);
    record1.set("name", "Marie Kamba");
    record1.set("category", "Plomberie");
    record1.set("city", "Kinshasa");
    record1.set("bio", "Plombi\u00e8re exp\u00e9riment\u00e9e, travaux rapides et fiables");
    record1.set("experience_years", 8);
    record1.set("profile_visibility", "visible");
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    const record2_artisan_idLookup = app.findFirstRecordByFilter("users", "email='pierre.mwamba@email.com'");
    if (!record2_artisan_idLookup) { throw new Error("Lookup failed for artisan_id: no record in 'users' matching \"email='pierre.mwamba@email.com'\""); }
    record2.set("artisan_id", record2_artisan_idLookup.id);
    record2.set("name", "Pierre Mwamba");
    record2.set("category", "Menuiserie");
    record2.set("city", "Lubumbashi");
    record2.set("bio", "Menuisier sp\u00e9cialis\u00e9 en mobilier sur mesure");
    record2.set("experience_years", 12);
    record2.set("profile_visibility", "visible");
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    const record3_artisan_idLookup = app.findFirstRecordByFilter("users", "email='sophie.ndombe@email.com'");
    if (!record3_artisan_idLookup) { throw new Error("Lookup failed for artisan_id: no record in 'users' matching \"email='sophie.ndombe@email.com'\""); }
    record3.set("artisan_id", record3_artisan_idLookup.id);
    record3.set("name", "Sophie Ndombe");
    record3.set("category", "Peinture");
    record3.set("city", "Kinshasa");
    record3.set("bio", "Peintre d\u00e9corateur, finitions impeccables");
    record3.set("experience_years", 7);
    record3.set("profile_visibility", "visible");
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    const record4_artisan_idLookup = app.findFirstRecordByFilter("users", "email='luc.kasongo@email.com'");
    if (!record4_artisan_idLookup) { throw new Error("Lookup failed for artisan_id: no record in 'users' matching \"email='luc.kasongo@email.com'\""); }
    record4.set("artisan_id", record4_artisan_idLookup.id);
    record4.set("name", "Luc Kasongo");
    record4.set("category", "Ma\u00e7onnerie");
    record4.set("city", "Kolwezi");
    record4.set("bio", "Ma\u00e7on qualifi\u00e9 pour tous types de construction");
    record4.set("experience_years", 15);
    record4.set("profile_visibility", "visible");
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})