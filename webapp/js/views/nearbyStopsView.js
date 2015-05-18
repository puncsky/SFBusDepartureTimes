var app = app || {};

(function ($) {
  'use strict';

  app.NearbyStopsView = Backbone.View.extend({
    initialize: function () {
      this.listenTo(this.model, 'updateNearbyStopsDone', this.render);
    },

    render: function () {
      var markers = this.model.stopMarkers;
      if (markers) {
        _.each(markers, function (s) {
          s.setMap(null);
        });
      }

      markers = getStopMarkers(this.model.toJSON());
      _.each(markers, function (s) {
        s.setMap(map);
      });
      this.model.stopMarkers = markers;
    }
  });
})(jQuery);
