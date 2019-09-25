//prop de obj: {"url": path, "method": method, "body": request's body (string), "store": object containing all bikes (see router.js) }
var { addbike, readbike, readbikes, removebike, testbike } = require("../api/controller")
let Bike = {};//completer avec un bon json
let Bikes = {};//completer avec un bon json
let deletedBike = {};//completer avec un bon json
var ret = function (obj_path) { return (null) };

var url_parser = function (obj) {
    let parsurl = obj.url.split('/');
    if ((obj.url) === "/bikes") {
        if (obj.method === "GET") {
            ret = function (obj_path) {
                return (Bikes);
            }
        }
        else if (obj.method === "POST") {
            if (testbike(obj.body)) {
                ret = function (obj_path) {
                    return (Bike);
                }
            }
        }
    }
    else if (parsurl[1] === "bike" && parsurl[2]) {
        if (obj.method === "GET") {
            if (obj.store.bikes[parsurl[2]]) {
                ret = function (obj_path) {
                    return (Bike);
                }
            }
        }
        else if (obj.method === "PUT") {
            if (obj.store.bikes[parsurl[2]]) {
                if (testbike(obj.body)) {
                    ret = function (obj_path) {
                        return (Bike);
                    }
                }
            }
        }
        else if (obj.method === "DELETE") {
            if (obj.store.bikes[parsurl[2]]) {
                ret = function (obj_path) {
                    return (deletedBike);
                }
            }
        }
    }
    return (ret);
}