/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    let collection = new Collection({
        type: "auth",
        name: "entreprises",
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "id = @request.auth.id",
        deleteRule: "id = @request.auth.id",
        authRule: "",
        fields: [
        {
                "hidden": false,
                "id": "text4330674364",
                "name": "nom_entreprise",
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
                "id": "select9916502765",
                "name": "secteur_activite",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                        "hotel",
                        "restaurant",
                        "immobilier",
                        "entreprise",
                        "commerce",
                        "villa",
                        "residence"
                ]
        },
        {
                "hidden": false,
                "id": "number2477690012",
                "name": "nombre_sites",
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
                "id": "text4006957347",
                "name": "adresse_principale",
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
                "id": "text8506718437",
                "name": "telephone",
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
                "id": "email1452242593",
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
                "id": "text8418915384",
                "name": "contact_principal_nom",
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
                "id": "text5046284329",
                "name": "contact_principal_prenom",
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
                "id": "email6382982397",
                "name": "contact_principal_email",
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
                "id": "text7593302611",
                "name": "contact_principal_telephone",
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
                "id": "text0292948542",
                "name": "contact_principal_fonction",
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
                "id": "text0315238520",
                "name": "types_interventions",
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
                "id": "text3341241808",
                "name": "frequence_interventions",
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
                "id": "number8560764491",
                "name": "budget_mensuel",
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
                "id": "bool3279969578",
                "name": "contrats_maintenance",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "bool"
        },
        {
                "hidden": false,
                "id": "bool9475406834",
                "name": "demandes_urgence",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "bool"
        },
        {
                "hidden": false,
                "id": "select8675825705",
                "name": "statut",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                        "actif",
                        "inactif"
                ]
        },
        {
                "hidden": false,
                "id": "select4690102844",
                "name": "plan",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                        "starter",
                        "pro",
                        "enterprise"
                ]
        },
        {
                "hidden": false,
                "id": "autodate5104720703",
                "name": "date_inscription",
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
                "id": "date1513004873",
                "name": "date_expiration_plan",
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
                "id": "autodate6458947833",
                "name": "created_at",
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
                "id": "autodate7271866358",
                "name": "updated_at",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "autodate",
                "onCreate": true,
                "onUpdate": true
        }
],
        authAlert: { enabled: false },
    })

    try {
        app.save(collection)
    } catch (e) {
        if (e.message.includes("Collection name must be unique")) {
            console.log("Collection already exists, skipping")
            return
        }
        throw e
    }
}, (app) => {
    try {
        let collection = app.findCollectionByNameOrId("entreprises")
        app.delete(collection)
    } catch (e) {
        if (e.message.includes("no rows in result set")) {
            console.log("Collection not found, skipping revert");
            return;
        }
        throw e;
    }
})