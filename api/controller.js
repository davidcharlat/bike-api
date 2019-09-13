//logique de traitement
const store = require('./store');

addbike = function addbike(newbike) {  //newbike est pour l'instant un objet json {"taille": "tgdet", "prix":244, "qualite":3.2}
    let id = makeid(newbike)  //ne pas oublier de ecrire la fonction makeid
    store.bikes[id] = {
        "_links": {
            "self": ("/bikes/" + id)
        },
        "id":id,
        "data":newbike,
    };
    return JSON.stringify(store.bikes[id]);
};

removebike = function (id) {
    delete store.bikes[id];
};

updatebike = function (id, newbike) {
    store.bikes[id].data = newbike;
    return JSON.stringify(store[id]);
};

readbikes = function (){
    let ret = ""; //pas tt a fait ça (voir consigne)
    for (const key in store.bikes) {
          ret += JSON.stringify (store.bikes[key]);
    };
    console.log (ret);
    return JSON.stringify (store.bikes);
};

readbike = function (id){
    return JSON.stringify (store.bikes[id]);
};

makeid = function (bike) {
    return ("identifiant_trucmuche" + bike.mise_circulation);
}

testbike = function (string) {
    return true;
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

module.exports = {addbike, readbike, readbikes, removebike, testbike}




