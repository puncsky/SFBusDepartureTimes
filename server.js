'use strict';

/**
 * create and run the server with config.
 *
 * Run:
 *     node server.js
 *
 * Example:
 *
 *     var server = require('../server');
 *     server.close();
 *
 * @return {http.Server} the created server.
 * @api public
 */
var createServer = function() {
  // server
  var config = require('config');
  var express = require('express');
  var serveStatic = require('serve-static');
  var app = express();
  app.use(serveStatic(__dirname + config.get('server.webappPath')));

  // mongodb
  var mongoose = require('mongoose');
  mongoose.connect(config.get('mongodb.url'));
  var initDb = require('./utils/initDbFromRemoteDataSource');
  try {
    initDb(config.get('remoteDataSource.url'));
  } catch (err) {
    console.log("init db occurred minor error: " + err);
  }

  // router and controllers
  var router = express.Router();
  var busStopController = require('./controllers/busStopController');
  var routeController = require('./controllers/routeController');
  // GET /api
  app.use('/api', router);
  router.get('/', function (req, res) {
    res.json({ message: 'Aloha! Welcome to our api!' });
  });
  // GET /api/busstops
  // GET /api/busstops?lat={lat}&lon={lon}&miles={miles}
  router.route('/busstops')
    .get(busStopController.getBusStops, busStopController.getNearestBusStops);
  // GET /api/busstops/:stopId
  router.route('/busstops/:stopId')
    .get(busStopController.getBusStopById);
  // GET /api/routes
  router.route('/routes')
    .get(routeController.getRoutes);

  var port = config.get('server.port');
  return app.listen(port, function () {
    console.log('Express server listening on port ' + port);
  });
};

module.exports = createServer();