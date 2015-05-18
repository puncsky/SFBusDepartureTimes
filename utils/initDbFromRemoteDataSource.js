'use strict';

var Route = require('../models/route');
var BusStop = require('../models/busStop');
var http = require('httpsync');
var async = require('async');

/**
 * Init mongodb from data source of NextBus public API.
 * @param url
 */
var initDbFromRemoteDataSource = function(url) {
  var routes = updateRoutesFrom(url + '?command=routeList&a=sf-muni');
  updateStopsFrom(url + '?command=routeConfig&a=sf-muni&r=', routes);
};

var updateRoutesFrom = function(sourceUrl) {
  console.log('Update routes from NextBus API...');
  var data = http.get(sourceUrl).end().data;
  var routes = JSON.parse(data).route;
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    Route.update({ tag: route.tag }, route, { upsert: true }, function (err) {
      if (err) throw err;
    });
  }
  console.log('Updated ' + routes.length + ' routes.');
  return routes;
};

var updateStopsFrom  = function(sourceUrlBase, routes) {
  console.log('Get route configs...');
  var routeConfigs = [];
  async.each(routes, function(route, callback) {
    var data = http.get(sourceUrlBase + route.tag).end().data;
    routeConfigs.push(JSON.parse(data).route);
    callback();
  }, function(err) {
    if (err) throw err;

    console.log('Get ' + routeConfigs.length + ' route configs.');
    var stops = getUniqueStops(routeConfigs);
    console.log('Has ' + stops.length + ' unique stops.');
    updateStops(stops);
    console.log('Stops updated!');
  });
};

var getUniqueStops = function(routeConfigs) {
  var stops = [];
  var routesByStopIds = {};
  routeConfigs.forEach(function(config) {
    config.stop.forEach(function(s) {
      addOrUpdateStop(s, config.tag, stops, routesByStopIds);
    });
  });
  return stops;
};

var addOrUpdateStop = function(stop, routeTag, stops, routesByStopIds) {
  if (routesByStopIds[stop.stopId]) {
    routesByStopIds[stop.stopId].push(routeTag);
  } else {
    var newStop = {
      stopId: stop.stopId,
      tag: stop.tag,
      title: stop.title,
      loc: [Number(stop.lon), Number(stop.lat)],
      routeTags: [routeTag]
    };
    routesByStopIds[stop.stopId] = newStop.routeTags;
    stops.push(newStop);
  }
};

var updateStops = function(stops) {
  async.each(stops, function(stop, callback) {
    BusStop.update({ stopId: stop.stopId }, stop, { upsert: true }, function (err) {
      if (err) throw err;
    });

    callback();
  }, function(err) {
    if (err) throw err;
  });
};

module.exports = initDbFromRemoteDataSource;