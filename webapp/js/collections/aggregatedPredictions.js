var app = app || {};

(function () {
  'use strict';

  app.AggregatedPredictions = Backbone.Collection.extend({
    model: app.Prediction,

    url: app.config.baseUrl,

    fetch: function(stopId, options) {
      if (!stopId && !options) {
        return Backbone.Collection.prototype.fetch.call(this, this.options);
      }
      options = options || {};
      if (!options.url) {
        options.url = this.url + '/busstops/' + stopId;
      }
      if (!options.success) {
        var self = this;
        options.success = function() {
          self.trigger('updateStopDone');
        }
      }

      this.options = options;
      return Backbone.Collection.prototype.fetch.call(this, options);
    },

    parse: function(stop) {
      this.stop = stop;
      return stop.routeTags.map(function(routeTag) {
        var prediction = new app.Prediction();
        prediction.fetch(routeTag, stop.tag);
        return prediction;
      })
    }
  });
})();
