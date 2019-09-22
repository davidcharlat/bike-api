// logique de routage, qui consiste à associer une url et une méthode à un controller donné
var http = require('http');
var url = require('url');
var store = require('./store');
var { addbike, readbike, readbikes, removebike, testbike } = require("./controller")
var server = http.createServer(function (req, res) {
    //console.log ("server");
    var page = url.parse(req.url).pathname;
    let parsurl = page.split('/');
    if (req.method === 'GET') {
        if (page === '/bikes') {
            res.writeHead(200, { "content-type": "application/json" });
            res.write(readbikes());
            //res.results là aussi changer
            res.end();
        }
        else if (parsurl[1] === "bikes") {
            if (store.bikes[parsurl[2]]) {
                res.writeHead(200, { "content-type": "application/json" });
                res.write(readbike(parsurl[2]));
                res.end();
            }
            else {
                res.writeHead(404, { "content-type": "text/plain" });
                res.write("error, id not found");
                res.end();
            }
        }
        else {
            res.writeHead(404, { "content-type": "text/plain" });
            res.write("error, page not found");
            res.end();
        }
    }
    else if (req.method === 'POST') {
        if (page === '/bikes') {
            var body = '';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                if (testbike(body)) {//
                    var bike = JSON.parse(body)
                    res.writeHead(201, { "content-type": "application/json" });
                    res.write(addbike(bike));
                    res.end();
                }
                //console.log(body);
            });
        }
        else {
            res.writeHead(405, { "content-type": "text/plain" });
            res.write("error, method not allowed");
            res.end()
        }
    }
});
module.exports = server;