const jsonschema = require('jsonschema')//logique de traitement
const uuidv4 = require('uuid/v4');
const bikeschema = require ("../dto/Bike")

const addbike = function (newbike, store) {  //newbike est pour l'instant un objet json {"taille": "tgdet", "prix":244, "qualite":3.2}
    let id = makeid(newbike)  //ne pas oublier de ecrire la fonction makeid
    //console.log (newbike);
    store.bikes[id] = {
        "_links": {
            "self": ("/bikes/" + id)
        },
        "id": id,
        "data": newbike
    };
    return JSON.stringify(store.bikes[id]);
};

const removebike = function (id, store) {
    delete store.bikes[id];
    return (true);
};

const updatebike = function (id, newbike, store) {
    store.bikes[id].data = newbike;
    return JSON.stringify(store.bikes[id]);
};

const readbikes = function (store) {
    let ret = {
        "_links": {
            "self": "/bikes"
        },
        "results": [
        ]
    }
    let i = 0;
    for (const key in store.bikes) {
        ret.results[i] = {
            "_links": store.bikes[key]._links,
            "id": store.bikes[key].id
        };
        i++;
    };
    ret = JSON.stringify(ret);
    //console.log(ret);
    return (ret);
};

const readbike = function (id, store) {
    //    console.log (id);
    //  console.log (store.bikes[id]);
    return JSON.stringify(store.bikes[id]);
};

const makeid = function (bike) {
    return (uuidv4());
}

const testbike = function (string) {
    let bike = JSON.parse(string)
    if (jsonschema.validate(bike, bikeschema).errors.length == 0) {
        return true;
    }
    else { 
        return (false);
    }
}

/*
var bike = {
    "poids_kg": 4.1,
    "mise_circulation": "2015-06-21",
    "prix_EUR": 299.99,
    "qualité": 3.2,
    "avis_consommateurs": 4.1,
    "réference": "FR42R34DY"
  };
  var bike2 = {
    "poids_kg": 4.1,
    "mise_circulation": "2014-06-21",
    "prix_EUR": 299.99,
    "qualité": 3.2,
    "avis_consommateurs": 4.1,
    "réference": "FR42R34DY"
  };
  console.log (store);
  addbike (bike);
  addbike (bike2);
console.log (readbikes ());
  //console.log (store.bikes["identifiant_trucmuche2015-06-21"]);
*/

module.exports = { addbike, readbike, readbikes, removebike, testbike, updatebike }




