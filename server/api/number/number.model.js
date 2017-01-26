'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NumberSchema = new Schema({
  value: Number,
  date: { type : Date, default : Date.now },
  winning : Boolean
});

module.exports = mongoose.model('Number', NumberSchema);
