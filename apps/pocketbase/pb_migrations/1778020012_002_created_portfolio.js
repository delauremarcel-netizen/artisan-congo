/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Fetch related collections to get their IDs
  const artisan_profilesCollection = app.findCollectionByNameOrId("artisan_profiles");

  const collection = new Collection({
    "createRule": "artisan_id = @request.auth.id",
    "deleteRule": "artisan_id = @request.auth.id",
    "fields":     [
          {
                "autogeneratePattern": "[a-z0-9]{15}",
                "hidden": false,
                "id": "text2599989211",
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
                "id": "relation8874049814",
                "name": "artisan_id",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "relation",
                "cascadeDelete": false,
                "collectionId": artisan_profilesCollection.id,
                "displayFields": [],
                "maxSelect": 1,
                "minSelect": 0
          },
          {
                "hidden": false,
                "id": "text9275934519",
                "name": "titre",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 100,
                "min": 0,
                "pattern": ""
          },
          {
                "hidden": false,
                "id": "text7204151412",
                "name": "description",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 1000,
                "min": 0,
                "pattern": ""
          },
          {
                "hidden": false,
                "id": "text2600234574",
                "name": "categorie",
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
                "id": "file8468188109",
                "name": "images",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "file",
                "maxSelect": 10,
                "maxSize": 20971520,
                "mimeTypes": [
                      "image/jpeg",
                      "image/png",
                      "image/webp"
                ],
                "thumbs": []
          },
          {
                "hidden": false,
                "id": "number7974426243",
                "name": "budget",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "number",
                "max": null,
                "min": null,
                "onlyInt": false
          },
          {
                "hidden": false,
                "id": "date5808899672",
                "name": "date_debut",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "date",
                "max": "",
                "min": ""
          },
          {
                "hidden": false,
                "id": "date4139654883",
                "name": "date_fin",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "date",
                "max": "",
                "min": ""
          },
          {
                "hidden": false,
                "id": "text1683930434",
                "name": "localisation",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 0,
                "min": 0,
                "pattern": ""
          },
          {
                "hidden": false,
                "id": "text5575253992",
                "name": "client_nom",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 0,
                "min": 0,
                "pattern": ""
          },
          {
                "hidden": false,
                "id": "text8591071335",
                "name": "client_avis",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 500,
                "min": 0,
                "pattern": ""
          },
          {
                "hidden": false,
                "id": "number0981097397",
                "name": "client_rating",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "number",
                "max": 5,
                "min": 1,
                "onlyInt": false
          },
          {
                "hidden": false,
                "id": "select8825931527",
                "name": "statut",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "public",
                      "draft"
                ]
          },
          {
                "hidden": false,
                "id": "bool1098192834",
                "name": "featured",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "bool"
          },
          {
                "hidden": false,
                "id": "number2557282266",
                "name": "views_count",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "number",
                "max": null,
                "min": null,
                "onlyInt": false
          },
          {
                "hidden": false,
                "id": "autodate4783779400",
                "name": "created",
                "onCreate": true,
                "onUpdate": false,
                "presentable": false,
                "system": false,
                "type": "autodate"
          },
          {
                "hidden": false,
                "id": "autodate4511857142",
                "name": "updated",
                "onCreate": true,
                "onUpdate": true,
                "presentable": false,
                "system": false,
                "type": "autodate"
          }
    ],
    "id": "pbc_6000168321",
    "indexes": [],
    "listRule": "artisan_id.is_visible = true || artisan_id = @request.auth.id",
    "name": "portfolio",
    "system": false,
    "type": "base",
    "updateRule": "artisan_id = @request.auth.id",
    "viewRule": "artisan_id.is_visible = true || artisan_id = @request.auth.id"
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
    const collection = app.findCollectionByNameOrId("pbc_6000168321");
    return app.delete(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})