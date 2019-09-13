const api = require('../server');
const supertest = require('supertest');

describe("Accept: application/json", function () {
    it('should respond error 415 if not "Accept: application/json" as GET method is used', function (done) {
        supertest(api)
            .get("/bikes")
            .expect(415)
            .end(function (err, res) {
                if (err) done(err);
                done();
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
                done();
            });
    });
    /*it('should respond error 415 if not "Accept: application/json" as PUT method is used', function (done) {
        supertest(api)
            .put("/bikes")
            .expect(415)
            .end(function (err, res) {
                if (err) done(err);
                done();
            });
    });*/
});

describe("GET /bikes", function () {
    it('should send an object with a result property discribing every bike', function (done) {
        supertest(api)
            .get("/bikes")
            .set('Accept', 'application/json')
            .expect(200);
            .end(function (err, res) {
                if (err) done(err);
                //   if (!res.result) done("no result")
                done();
            });
    });
});

describe('GET /bikes/<$id>', function () {
    it("should respond 404 when <$id> doesn't match", function (done) {
        supertest(api)
            .get('/bikes/kjehfbkezuzykjncije2344534RVCVReurhy')
            .set('Accept', 'application/json')
            .expect(404, done);
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
        supertest(api)
            .get("/bikes/") //a completer avec le bon id
    });
});
