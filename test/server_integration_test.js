'use strict';

var superagent = require('superagent');
var expect = require("chai").expect;
var config = require("config");
var port = config.get("server.port");

describe('server_integration_test', function () {
  this.timeout(8000);

  it('GET / should return 200', function (done) {
    superagent.get('http://localhost:' + port).end(function(err, res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('GET /api should return 200', function (done) {
    superagent.get('http://localhost:' + port + "/api").end(function(err, res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('GET /api/routes should return routes with number between 72 and 92', function (done) {
    superagent.get('http://localhost:' + port + "/api/routes").end(function(err, res) {
      expect(res.statusCode).to.equal(200);
      expect(res.body.length).to.greaterThan(72).to.lessThan(92);
      done();
    });
  });

  it('GET /api/busstops should return bus stops with number between 3500 and 4000', function (done) {
    superagent.get('http://localhost:' + port + "/api/busstops").end(function(err, res) {
      expect(res.statusCode).to.equal(200);
      expect(res.body.length).to.greaterThan(3500).to.lessThan(4000);
      done();
    });
  });

  it('GET /api/busstops?lat=37.79094&lon=-122.39919&miles=0.001 should return bus stops within 0.001 miles',
  function (done) {
    superagent.get('http://localhost:' + port + "/api/busstops?lat=37.79094&lon=-122.39919&miles=0.001").end(
      function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.length).to.equal(1);
        done();
      });
  });

  it('GET /api/busstops?lat=37.79094&lon=-122.39919&miles=0.5 should return bus stops within 0.5 miles',
  function (done) {
    superagent.get('http://localhost:' + port + "/api/busstops?lat=37.79094&lon=-122.39919&miles=0.5").end(
      function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.length).to.equal(137);
        done();
      });
  });

  it('GET /api/busstops/15680 should return the bus stop with stopId of 15680', function(done) {
    superagent.get('http://localhost:' + port + "/api/busstops/15680").end(
      function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.ownProperty('_id');
        var stop = {
          "_id": res.body._id,
          "stopId": 15680,
          "loc": [-122.41624, 37.7775999],
          "title": "Market St & Larkin St",
          "tag": "5680",
          "routeTags": ["F","6","7","7R","9","9R","K_OWL","L_OWL","M_OWL","T_OWL"]
        };
        expect(res.body).to.deep.equal(stop);
        done();
      });
  })
});