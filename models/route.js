'use strict';

var mongoose = require('mongoose');

var routeSchema = new mongoose.Schema({
  tag: { type: String, unique: true },
  title: { type: String }
});

module.exports = mongoose.model('Route', routeSchema);