'use strict';

var _ = require('lodash');
var Number = require('./number.model');

// Get list of numbers
exports.index = function(req, res) {
  Number.find(function (err, numbers) {
    if(err) { return handleError(res, err); }
    return res.json(200, numbers);
  });
};

// Get a single number
exports.show = function(req, res) {
  Number.findById(req.params.id, function (err, number) {
    if(err) { return handleError(res, err); }
    if(!number) { return res.send(404); }
    return res.json(number);
  });
};

// Creates a new number in the DB.
exports.create = function(req, res) {
  Number.create(req.body, function(err, number) {
    if(err) { return handleError(res, err); }
    return res.json(201, number);
  });
};

// Updates an existing number in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Number.findById(req.params.id, function (err, number) {
    if (err) { return handleError(res, err); }
    if(!number) { return res.send(404); }
    var updated = _.merge(number, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, number);
    });
  });
};

// Deletes a number from the DB.
exports.destroy = function(req, res) {
  Number.findById(req.params.id, function (err, number) {
    if(err) { return handleError(res, err); }
    if(!number) { return res.send(404); }
    number.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}