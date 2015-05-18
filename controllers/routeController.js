'use strict';

var Route = require('../models/route');

exports.getRoutes = function(req, res) {
  Route.find(function (err, routes) {
    if (err) {
      res.statusCode = 400;
      return res.send(err);
    }

    res.json(routes);
  });
};