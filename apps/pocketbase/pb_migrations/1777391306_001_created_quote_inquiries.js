/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields":     [
          {
                "autogeneratePattern": "[a-z0-9]{15}",
                "hidden": false,
                "id": "text0754660342",
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
                "id": "text5591828507",
                "name": "name",
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
                "id": "email4146038236",
                "name": "email",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "email",
                "exceptDomains": [],
                "onlyDomains": []
          },
          {
                "hidden": false,
                "id": "text4752406541",
                "name": "phone",
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
                "id": "text5833254839",
                "name": "project_description",
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
                "id": "select3892019697",
                "name": "location",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "Pointe-Noire",
                      "Brazzaville",
                      "Kinshasa",
                      "Lubumbashi",
                      "Kolwezi"
                ]
          },
          {
                "hidden": false,
                "id": "select7095801485",
                "name": "category",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "Plomberie",
                      "\u00c9lectricit\u00e9",
                      "Menuiserie",
                      "Ma\u00e7onnerie",
                      "Peinture",
                      "Soudure",
                      "R\u00e9paration Auto",
                      "Construction",
                      "Paysagisme",
                      "Carrelage",
                      "Couverture",
                      "Serrurerie",
                      "Climatisation",
                      "Plomberie Sanitaire",
                      "\u00c9lectricit\u00e9 Industrielle",
                      "Charpenterie",
                      "Vitrerie",
                      "Chauffage",
                      "Isolation",
                      "D\u00e9molition",
                      "Terrassement",
                      "B\u00e9ton",
                      "Ferronnerie",
                      "Pl\u00e2trerie",
                      "D\u00e9coration Int\u00e9rieure"
                ]
          },
          {
                "hidden": false,
                "id": "number0109889353",
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
                "id": "select4067065275",
                "name": "preferred_contact_method",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "WhatsApp",
                      "Phone",
                      "Email"
                ]
          },
          {
                "hidden": false,
                "id": "autodate8562699333",
                "name": "created",
                "onCreate": true,
                "onUpdate": false,
                "presentable": false,
                "system": false,
                "type": "autodate"
          },
          {
                "hidden": false,
                "id": "autodate8592619311",
                "name": "updated",
                "onCreate": true,
                "onUpdate": true,
                "presentable": false,
                "system": false,
                "type": "autodate"
          }
    ],
    "id": "pbc_6112395381",
    "indexes": [],
    "listRule": null,
    "name": "quote_inquiries",
    "system": false,
    "type": "base",
    "updateRule": null,
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
    const collection = app.findCollectionByNameOrId("pbc_6112395381");
    return app.delete(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})