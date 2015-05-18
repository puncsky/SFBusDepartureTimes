'use strict';

var BusStop = require('../models/busStop');

// GET /api/busstops
exports.getBusStops = function(req, res, next) {
  if (req.query.lon && req.query.lat && req.query.miles) {
    next();
    return;
  }

  BusStop.find(function (err, busStops) {
    if (err) {
      res.statusCode = 400;
      return res.send(err);
    }

    res.json(busStops);
  });
};

// GET /api/busstops?lat={lat}&lon={lon}&miles={miles}
exports.getNearestBusStops = function(req, res) {
  var lon = req.query.lon;
  var lat = req.query.lat;
  var miles = req.query.miles;
  var coords = [lon, lat];

  BusStop.find({
    loc: {
      $near: coords,
      $maxDistance: miles / 69
    }
  }).exec(function (err, busStops) {
    if (err) {
      res.statusCode = 400;
      return res.send(err);
    }

    res.json(busStops);
  });
};

// GET /api/busstops/:stopId
exports.getBusStopById = function(req, res) {
  BusStop.findOne({ stopId: req.params.stopId}, function(err, stop) {
    if (err) {
      res.statusCode = 400;
      return res.send(err);
    }

    res.json(stop);
  })
};