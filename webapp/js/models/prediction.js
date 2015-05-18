var app = app || {};

(function () {
  'use strict';

  app.Prediction = Backbone.Model.extend({
    urlRoot: "http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=sf-muni",

    defaults: {
      routeTitle: '',
      show: false,
      direction: {
        title: '',
        prediction: [ {
          minutes: "0",
          seconds: "0"
        } ]
      },
      times: ''
    },

    parse: function(data) {
      return data.predictions;
    },

    fetch: function (routeTag, stopTag, options) {
      if (!routeTag && !stopTag && !options) {
        return Backbone.Model.prototype.fetch.call(this, this.options);
      }

      options = options || {};
      if (!options.url) {
        options.url = this.urlRoot + '&r=' + routeTag + '&s=' + stopTag;
      }
      var self = this;
      options.success = function() {
        self.trigger('updatePredictionDone');
      };

      this.options = options;
      return Backbone.Model.prototype.fetch.call(this, options);
    }
  });
})();
