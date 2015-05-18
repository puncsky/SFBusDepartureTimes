var app = app || {};

(function ($) {
  'use strict';

  app.AggregatedPredictionsView = Backbone.View.extend({
    initialize: function() {
      this.$title = $('#stop-title');
      this.$list = $('#aggregated-predictions-template');

      this.listenTo(this.model, 'updateStopDone', this.updatePredictions);
      this.listenTo(this.model, 'updateStopDone', this.updateTitle);
      this.timer = null;
    },

    updatePredictions: function() {
      this.$list.html('');
      this.model.models.forEach(function(p) {
        var view = new app.PredictionView({ model: p });
        this.$list.append(view.el);
      }, this);
      this.startTimer();
    },

    updateTitle: function() {
      this.$title.html(this.model.stop.title);
    },

    startTimer: function() {
      var self = this;
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(function() { self.model.fetch(); }, 5000);
    }
  });
})(jQuery);