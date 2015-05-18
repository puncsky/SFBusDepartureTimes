'use strict';

var mongoose = require('mongoose');

var busStopSchema = new mongoose.Schema({
  stopId: { type: Number, index: { unique: true } },
  tag: { type: String, unique: true },
  title: { type: String },
  loc: { type: [Number], index: '2d' },
  routeTags: { type: [String] }
});

module.exports = mongoose.model('BusStop', busStopSchema);