var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'bazoo-ka',
  // hostname: 'banana.local',
  level: 'debug'
});

module.exports = log;
