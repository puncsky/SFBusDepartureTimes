var app = app || {};

(function () {
  'use strict';

  app.RouteConfig = Backbone.Model.extend({
    urlRoot: "http://webservices.nextbus.com/service/publicJSONFeed?command=routeConfig&a=sf-muni&r=",

    defaults: {
      title: '',
      show: false
    },

    parse: function(data) {
      return data.route;
    },

    fetch: function (routeTag, options) {
      options = options || {};
      if (!options.url) {
        options.url = this.urlRoot + routeTag;
      }

      return Backbone.Model.prototype.fetch.call(this, options);
    },

    toggle: function () {
      this.set({
        show: !this.get('show')
      });
    }
  });
})();
