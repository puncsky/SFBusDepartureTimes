var app = app || {};

(function () {
  'use strict';

  var RouteConfigs = Backbone.Collection.extend({
    model: app.RouteConfig,
    url: "http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=sf-muni",
    parse: function(data) {
      var routes = data.route;
      return routes.map(function(route) {
        var routeConfig = new app.RouteConfig();
        routeConfig.fetch(route.tag);
        return routeConfig;
      });
    }
  });

  app.routeConfigs = new RouteConfigs();
})();
