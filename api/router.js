// logique de routage, qui consiste à associer une url et une méthode à un controller donné
var http = require('http');
var url = require('url');
var store = require('./store');
var { addbike, readbike, readbikes, removebike, testbike, updatebike } = require("./controller")
var body = '';
var server = http.createServer(function (req, res) {
    //console.log ("server");
    var page = url.parse(req.url).pathname;
    let parsurl = page.split('/');
    if (req.headers.accept != "application/json") {
        res.writeHead(415, { "content-type": "text/plain" });
        res.write("error, must accept application/json");
        res.end();
    }
    else if (page === '/bikes') {
        if (req.method === 'GET') {
            res.writeHead(200, { "content-type": "application/json" });
            res.write(readbikes(store));
            //res.results là aussi changer
            res.end();
        }
        else if (req.method === 'POST') {
            body = '';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                if (testbike(body)) {//
                    var bike = JSON.parse(body)
                    res.writeHead(201, { "content-type": "application/json" });
                    res.write(addbike(bike, store));
                    res.end();
                }
                else {
                    res.writeHead(400, { "content-type": "text/plain" });
                    res.write("error, invalid request");
                    res.end()
                }
            });
        }
        else {
            res.writeHead(405, { "content-type": "text/plain" });
            res.write("error, method not allowed");
            res.end()
        }
    }
    else if (parsurl[1] === "bikes") {
        if (store.bikes[parsurl[2]]) {
            if (req.method === 'GET') {
                res.writeHead(200, { "content-type": "application/json" });
                res.write(readbike(parsurl[2], store));
                res.end();
            }
            else if (req.method === 'PUT') {
                body = '';
                req.on('data', function (data) {
                    body += data;
                });
                req.on('end', function () {
                    if (testbike(body)) {
                        let temp = updatebike(parsurl[2], JSON.parse (body), store);
                        if (temp) {
                            res.writeHead(201, { "content-type": "application/json" });
                            res.write(temp);
                            res.end()
                        }
                        else {
                            res.writeHead(500, { "content-type": "text/plain" });
                            res.write("internal error, please try again");
                            res.end()
                        }
                    }
                    else {
                        res.writeHead(400, { "content-type": "text/plain" });
                        res.write("error, invalid request");
                        res.end()
                    }
                });
            }
            else if (req.method === 'DELETE') {
                if (removebike(parsurl[2], store)) {
                    res.writeHead(204, { "content-type": "text/plain" });
                    res.write("resource succefully deleted");
                    res.end()
                }
                else {
                    res.writeHead(500, { "content-type": "text/plain" });
                    res.write("internal error, please try again");
                    res.end()
                }
            }
            else {
                res.writeHead(405, { "content-type": "text/plain" });
                res.write("error, method not allowed");
                res.end()
            }
        }
        else {
            if (req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE') {
                res.writeHead(404, { "content-type": "text/plain" });
                res.write("error, id not found");
                res.end();
            }
            else {
                res.writeHead(405, { "content-type": "text/plain" });
                res.write("error, method not allowed");
                res.end()
            }
        }
    }
});
module.exports = server;