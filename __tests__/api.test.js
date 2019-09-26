var api = require('../api/router');
var supertest = require('supertest');

describe("Accept: application/json", function () {
    it('should respond error 415 if not "Accept: application/json" as GET method is used', function (done) {
        supertest(api)
            .get("/bikes")
            .expect(415)
            .end(function (err, res) {
                if (err) done(err);
                else done();
            });
    });
    it('should respond error 415 if not "Accept: application/json" as POST method is used', function (done) {
        supertest(api)
            .post("/bikes")
            .send({
                "poids_kg": 4.1,
                "mise_circulation": "2015-06-21",
                "prix_EUR": 299.99,
                "qualité": 3.2,
                "avis_consommateurs": 4.1,
                "réference": "FR42R34DY"
            })
            .expect(415)
            .end(function (err, res) {
                if (err) done(err);
                else done();
            });
    });
    it('should respond error 415 if not "Accept: application/json" as PUT method is used', function (done) {
        supertest(api)
            .put("/bikes")
            .expect(415)
            .end(function (err, res) {
                if (err) done(err);
                else done();
            });
    });
    it('should respond error 415 if not "Accept: application/json" as DELETE method is used', function (done) {
        supertest(api)
            .delete("/bikes")
            .expect(415)
            .end(function (err, res) {
                if (err) done(err);
                else done();
            });
    });
});

describe("GET /bikes", function () {
    it('should send an object with a result property discribing every bike', function (done) {
        supertest(api)
            .get("/bikes")
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                //console.log ("toto " + (JSON.parse (res.text)));
                if (err) done(err);
                else if (!JSON.parse(res.text).results) done("no result"); //voir si ça fonctionne (s'il faut pas parser et si done ("error") donne une erreur)
                else done();
            });
    });
});

describe('GET /bikes/<$id>', function () {
    it("should respond 404 when <$id> doesn't match", function (done) {
        supertest(api)
            .get('/bikes/kjehfbkezuzykjncije2344534RVCVReurhy')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function (err, res) {
                if (err) done(err);
                else done();
            });
    });
    it("should respond 200 if <$id> match", function (done) {
        supertest(api)
            .post("/bikes")
            .set('Accept', 'application/json')
            .send({
                "poids_kg": 4.1,
                "mise_circulation": "2015-06-21",
                "prix_EUR": 299.99,
                "qualité": 3.2,
                "avis_consommateurs": 4.1,
                "réference": "FR42R34DY"
            })
            .end(function (err, res) {
                if (err) done(err);
                else {
                    let iden = JSON.parse(res.text)._links.self;
                    supertest(api)
                        .get(iden)
                        .set('Accept', 'application/json')
                        .expect(200, {
                            "_links": {
                                "self": iden, //pareil
                            },
                            "id": (iden.split('/'))[2], //idem
                            "data": {
                                "poids_kg": 4.1,
                                "mise_circulation": "2015-06-21",
                                "prix_EUR": 299.99,
                                "qualité": 3.2,
                                "avis_consommateurs": 4.1,
                                "réference": "FR42R34DY"  //voir les sauts s'il faut retransformer en objet
                            }
                        })
                        .end(function (err, res) {
                            if (err) done(err);
                            else done();
                        });
                }
            });
    });
});

describe('POST /bikes', function () {
    it("should respond 400 for an invalid request", function (done) {
        supertest(api)
            .post("/bikes")
            .set('Accept', 'application/json')
            .send({
                "poids_kg": 4.1,
                "mise_circulation": "2015-06-21",
                "prix_EUR": 299.99,
                "qualité": 3.2,
                "avis_consommateurs": 4.1
            })
            .end(function (err, res) {
                if (err) done(err);
                else done();
            });
    });
    it("should respond 201 and return the new bike ID in response._links.self for a valid request", function (done) {
        supertest(api)
            .post("/bikes")
            .set('Accept', 'application/json')
            .send({
                "poids_kg": 4.1,
                "mise_circulation": "2015-06-21",
                "prix_EUR": 299.99,
                "qualité": 3.2,
                "avis_consommateurs": 4.1,
                "réference": "FR42R34DY"
            })
            .expect(201)
            .end(function (err, res) {
                if (err) done(err);
                else {
                    let iden = JSON.parse(res.text)._links.self;
                    if (!JSON.parse(res.text)._links.self) {
                        done("(response.text)._links.self isn't defined")
                    }
                    else if (JSON.parse(res.text).id != (iden.split('/'))[2]) {
                        done("(response.text).id doesn't match")
                    }
                    else
                        supertest(api)
                            .get(iden)
                            .set('Accept', 'application/json')
                            .expect(200, {
                                "_links": {
                                    "self": iden, //pareil
                                },
                                "id": (iden.split('/'))[2], //idem
                                "data": {
                                    "poids_kg": 4.1,
                                    "mise_circulation": "2015-06-21",
                                    "prix_EUR": 299.99,
                                    "qualité": 3.2,
                                    "avis_consommateurs": 4.1,
                                    "réference": "FR42R34DY"  //voir les sauts s'il faut retransformer en objet
                                }
                            })
                            .end(function (err, res) {
                                if (err) done(err);
                                else done();
                            });
                }
            });
    });
});

describe('POST /bikes/<$id>', function () {
    it("should respond 405", function (done) {
        supertest(api)
            .post("/bikes/toto")
            .set('Accept', 'application/json')
            .send({
                "poids_kg": 4.1,
                "mise_circulation": "2015-06-21",
                "prix_EUR": 299.99,
                "qualité": 3.2,
                "avis_consommateurs": 4.1
            })
            .expect(405)
            .end(function (err, res) {
                if (err) done(err);
                else done();
            });
    });
});

describe('DELETE /bikes', function () {
    it("should respond 405 if not /<$id> in path", function (done) {
        supertest(api)
            .delete("/bikes")
            .set('Accept', 'application/json')
            .expect(405)
            .end(function (err, res) {
                if (err) done(err);
                else done();
            });
    });
});

describe('DELETE /bikes/<$id>', function () {
    it("should respond 404 if <$id> doesn't match", function (done) {
        supertest(api)
            .delete('/bikes/kjehfbkezuzykjncije2344534RVCVReurhy')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function (err, res) {
                if (err) done(err);
                else done();
            });
    });
    it("should respond 204 if resource has been deleted", function (done) {
        supertest(api)
            .post("/bikes")
            .set('Accept', 'application/json')
            .send({
                "poids_kg": 4.1,
                "mise_circulation": "2015-06-21",
                "prix_EUR": 299.99,
                "qualité": 3.2,
                "avis_consommateurs": 4.1,
                "réference": "FR42R34DY"
            })
            .end(function (err, res) {
                if (err) done(err);
                else {
                    let iden = JSON.parse(res.text)._links.self;
                    if (!JSON.parse(res.text)._links.self) {
                        done("(response.text)._links.self isn't defined")
                    }
                    else if (JSON.parse(res.text).id != (iden.split('/'))[2]) {
                        done("(response.text).id doesn't match")
                    }
                    else {
                        supertest(api)
                            .delete(iden)
                            .set('Accept', 'application/json')
                            .expect(204)
                            .end(function (err2, res2) {
                                if (err2) done (err2)
                                else {
                                supertest(api)
                                    .get(iden)
                                    .set('Accept', 'application/json')
                                    .expect(404)
                                    .end(function (err, res) {
                                        if (err) done(err);
                                        else done();
                                    });
                                }
                            })
                    }
                }
            });
    });
});

describe('PUT /bikes', function () {
    it("should respond 405 if not /<$id> in path", function (done) {
        supertest(api)
            .put("/bikes")
            .set('Accept', 'application/json')
            .expect(405)
            .end(function (err, res) {
                if (err) done(err);
                else done();
            });
    });
});

describe('PUT /bikes/<$id>', function () {
    it("should respond 404 if <$id> doesn't match", function (done) {
        supertest(api)
            .put('/bikes/kjehfbkezuzykjncije2344534RVCVReurhy')
            .set('Accept', 'application/json')
            .send({
                "poids_kg": 4.1,
                "mise_circulation": "2015-06-21",
                "prix_EUR": 299.99,
                "qualité": 3.2,
                "avis_consommateurs": 4.1,
                "réference": "FR42R34DY"
            })
            .expect(404)
            .end(function (err, res) {
                if (err) done(err);
                else done();
            });
    });
    it("should respond 400 if the request is invalid", function (done) {
        supertest(api)
            .post("/bikes")
            .set('Accept', 'application/json')
            .send({
                "poids_kg": 4.1,
                "mise_circulation": "2015-06-21",
                "prix_EUR": 299.99,
                "qualité": 3.2,
                "avis_consommateurs": 4.1,
                "réference": "FR42R34DY"
            })
            .end(function (err, res) {
                if (err) done(err);
                else {
                    let iden = JSON.parse(res.text)._links.self;
                    if (!JSON.parse(res.text)._links.self) {
                        done("(response.text)._links.self isn't defined")
                    }
                    else if (JSON.parse(res.text).id != (iden.split('/'))[2]) {
                        done("(response.text).id doesn't match")
                    }
                    else {
                        supertest(api)
                            .put(iden)
                            .set('Accept', 'application/json')
                            .send({
                                "poids_kg": 4.1,
                                "mise_circulation": "2015-06-21",
                                "prix_EUR": 299.99,
                                "qualité": 3.2,
                                "avis_consommateurs": 4.1
                            })
                            .expect(400)
                            .end(function (err, res) {
                                if (err) done(err);
                                else done();
                            });

                    }
                }
            });
    });
    it("should respond 201 if resource has been replaced", function (done) {
        supertest(api)
            .post("/bikes")
            .set('Accept', 'application/json')
            .send({
                "poids_kg": 4.1,
                "mise_circulation": "2015-06-21",
                "prix_EUR": 299.99,
                "qualité": 3.2,
                "avis_consommateurs": 4.1,
                "réference": "FR42R34DY"
            })
            .end(function (err, res) {
                if (err) done(err);
                else {
                    let iden = JSON.parse(res.text)._links.self;
                    if (!JSON.parse(res.text)._links.self) {
                        done("(response.text)._links.self isn't defined")
                    }
                    else if (JSON.parse(res.text).id != (iden.split('/'))[2]) {
                        done("(response.text).id doesn't match")
                    }
                    else {
                        supertest(api)
                            .put(iden)
                            .set('Accept', 'application/json')
                            .send({
                                "poids_kg": 4.1,
                                "mise_circulation": "2015-06-21",
                                "prix_EUR": 289.99,
                                "qualité": 3.2,
                                "avis_consommateurs": 4.1,
                                "réference": "nouvelleref"
                            })
                            .expect(201)
                            .end(function (err3, res3) {
                                if (err3) done(err3);
                                else {
                                supertest(api)
                                    .get(iden)
                                    .set('Accept', 'application/json')
                                    .end(function (err2, res2) {
                                        if (err2) done(err2);
                                        else if (JSON.parse(res2.text).data.réference === "FR42R34DY") {
                                            done("error: resource hasn't been replaced");
                                        }
                                        else if (JSON.parse(res2.text).data.réference !== "nouvelleref") {
                                            done("error: resource hasn't been correctly replaced");
                                        }
                                        else done();
                                    });
                                }
                            });
                    }
                }
            });

    });
});