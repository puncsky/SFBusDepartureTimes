var app = app || {};

(function ($) {
  'use strict';

  app.PredictionView = Backbone.View.extend({
    tagName:  'li',
    className: 'list-group-item',

    template: _.template($('#prediction-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
})(jQuery);
