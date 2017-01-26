'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:
            process.env.IP ||
            undefined,

  // Server port
  port:
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:
            'mongodb://mongodb/bazooka'
  },

  // DataDir public accessible directory on the server eighter with ssh, ftp or whatever
  datadir :  './public/client/assets/data_dir'
};
