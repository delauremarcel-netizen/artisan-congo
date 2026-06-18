/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Fetch related collections to get their IDs
  const usersCollection = app.findCollectionByNameOrId("users");
  const artisansCollection = app.findCollectionByNameOrId("artisans");

  const collection = new Collection({
    "createRule": "@request.auth.role = 'client'",
    "deleteRule": null,
    "fields":     [
          {
                "autogeneratePattern": "[a-z0-9]{15}",
                "hidden": false,
                "id": "text7075325656",
                "max": 15,
                "min": 15,
                "name": "id",
                "pattern": "^[a-z0-9]+$",
                "presentable": false,
                "primaryKey": true,
                "required": true,
                "system": true,
                "type": "text"
          },
          {
                "hidden": false,
                "id": "relation4160191274",
                "name": "clientId",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "relation",
                "cascadeDelete": false,
                "collectionId": usersCollection.id,
                "displayFields": [],
                "maxSelect": 1,
                "minSelect": 0
          },
          {
                "hidden": false,
                "id": "relation6524797474",
                "name": "artisanId",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "relation",
                "cascadeDelete": false,
                "collectionId": artisansCollection.id,
                "displayFields": [],
                "maxSelect": 1,
                "minSelect": 0
          },
          {
                "hidden": false,
                "id": "select7803394325",
                "name": "metier",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "Ma\u00e7on",
                      "Plombier",
                      "\u00c9lectricien",
                      "Peintre",
                      "Carreleur",
                      "Soudeur",
                      "Menuisier bois",
                      "Menuisier aluminium",
                      "Frigoriste",
                      "Climaticien",
                      "M\u00e9canicien automobile",
                      "R\u00e9parateur \u00e9lectrom\u00e9nager",
                      "Jardinier",
                      "Femme de m\u00e9nage",
                      "Agent de s\u00e9curit\u00e9",
                      "Informaticien",
                      "Photographe",
                      "Traiteur",
                      "Couturier",
                      "Homme \u00e0 tout faire"
                ]
          },
          {
                "hidden": false,
                "id": "text3602047371",
                "name": "description",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 0,
                "min": 0,
                "pattern": ""
          },
          {
                "hidden": false,
                "id": "text6474230336",
                "name": "localisation",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 0,
                "min": 0,
                "pattern": ""
          },
          {
                "hidden": false,
                "id": "number5235876878",
                "name": "montantEstime",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "number",
                "max": null,
                "min": null,
                "onlyInt": false
          },
          {
                "hidden": false,
                "id": "select5209215982",
                "name": "statut",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "en attente",
                      "accept\u00e9e",
                      "refus\u00e9e",
                      "en cours",
                      "termin\u00e9e",
                      "pay\u00e9e"
                ]
          },
          {
                "hidden": false,
                "id": "autodate7099924840",
                "name": "dateCreation",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "autodate",
                "onCreate": true,
                "onUpdate": false
          },
          {
                "hidden": false,
                "id": "date8684562383",
                "name": "dateAcceptation",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "date",
                "max": "",
                "min": ""
          },
          {
                "hidden": false,
                "id": "date7451295049",
                "name": "dateTerminaison",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "date",
                "max": "",
                "min": ""
          },
          {
                "hidden": false,
                "id": "date7503114603",
                "name": "dateExpiration",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "date",
                "max": "",
                "min": ""
          },
          {
                "hidden": false,
                "id": "autodate0087215540",
                "name": "created",
                "onCreate": true,
                "onUpdate": false,
                "presentable": false,
                "system": false,
                "type": "autodate"
          },
          {
                "hidden": false,
                "id": "autodate0701927169",
                "name": "updated",
                "onCreate": true,
                "onUpdate": true,
                "presentable": false,
                "system": false,
                "type": "autodate"
          }
    ],
    "id": "pbc_1010676462",
    "indexes": [],
    "listRule": "@request.auth.id = clientId || @request.auth.id = artisanId || @request.auth.role = 'admin'",
    "name": "demandes",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.role = 'admin' || (@request.auth.id = artisanId && statut = 'en attente')",
    "viewRule": null
  });

  try {
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("Collection name must be unique")) {
      console.log("Collection already exists, skipping");
      return;
    }
    throw e;
  }
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_1010676462");
    return app.delete(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
