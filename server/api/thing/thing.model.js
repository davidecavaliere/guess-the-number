'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  name: String,
  data: {}
});

module.exports = mongoose.model('Thing', ThingSchema);
