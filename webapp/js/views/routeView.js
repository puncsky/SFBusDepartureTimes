var app = app || {};

(function ($) {
  'use strict';

  app.RouteView = Backbone.View.extend({
    tagName:  'li',
    className: 'list-group-item',

    template: _.template($('#route-template').html()),

    events: {
      'click .toggle': 'toggleShow'
    },

    initialize: function () {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('completed', this.model.get('show'));
      this.$el.css({ color: '#' + this.model.get('color')});
      return this;
    },

    toggleShow: function () {
      this.model.toggle();
      if (!this.model.get('routeLines') || !this.model.get('routeLines')) {
        var configJSON = this.model.toJSON();
        this.model.set({ routeLines: getRouteLines(configJSON) });
        this.model.set({ stopMarkers: getStopMarkers(configJSON.stop, '#' + configJSON.color) });
      }
      if (this.model.get('show')) {
        this.model.get('routeLines').forEach(function (r) {
          r.setMap(map);
        });
        this.model.get('stopMarkers').forEach(function (s) {
          s.setMap(map);
        });
      } else {
        this.model.get('routeLines').forEach(function (r) {
          r.setMap(null);
        });
        this.model.get('stopMarkers').forEach(function (s) {
          s.setMap(null);
        });
      }
    }
  });
})(jQuery);
