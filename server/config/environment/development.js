'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo : {
    uri : 'mongodb://mongodb/bazooka-dev'
  },

  seedDB : true,

  datadir : './client/assets/data_dir'
};
