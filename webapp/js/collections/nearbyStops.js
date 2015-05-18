var app = app || {};

(function () {
  'use strict';

  var Stops = Backbone.Collection.extend({
    model: app.Stop,

    url: app.config.baseUrl + "/busstops",

    fetch: function(lat, lon, options) {
      options = options || {};
      if (!options.url) {
        options.url = this.url + '?lat=' + lat + '&lon=' + lon + '&miles=0.5';
      }
      var self = this;
      options.success = function() {
        self.trigger('updateNearbyStopsDone');
      };

      return Backbone.Collection.prototype.fetch.call(this, options);
    }
  });

  app.nearbyStops = new Stops();
})();
