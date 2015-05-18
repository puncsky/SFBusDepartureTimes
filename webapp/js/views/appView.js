var app = app || {};

(function ($) {
  'use strict';

  app.AppView = Backbone.View.extend({
    initialize: function() {
      this.$list = $('#route-list');
      this.listenTo(app.routeConfigs, 'add', this.addOne);

      // fetch will trigger 'add' event for each config
      app.routeConfigs.fetch();

      app.aggregatedPredictions = new app.AggregatedPredictions();
      new app.AggregatedPredictionsView({ model: app.aggregatedPredictions });

      new app.NearbyStopsView({ model: app.nearbyStops });

      $(document).ready(function() {
        $('.geolocate').click(geolocate);
        $('.locateToSF').click(locateToSF);
        $('.showNearbyStops').click(showNearbyStops);
      });

      // Wait for loading route list first and then set up the routes filter.
      // Since the list is loaded in an async way, we do not know exactly when it will finish,
      // just use a rough estimation of 3 second.
      setTimeout(function() {
        var options = {
          valueNames: [ 'route-title' ]
        };
        new List('routes-filter', options);
      }, 3000);

      setTimeout(function() {
        showNearbyStops();
      }, 1000);
    },

    addOne: function(config) {
      var view = new app.RouteView({ model: config });
      this.$list.append(view.render().el);
    }
  });
})(jQuery);
