
const createThinky = require('thinky');
const globals = require('./globals');

let dbConfig = globals.db;
if (globals.env === 'production') {
  const buffer = new Buffer(globals.caCert);
  dbConfig = Object.assign({}, dbConfig, {
    ssl: {
      ca: buffer,
    },
  });
}

const thinky = createThinky(dbConfig);

module.exports = thinky;
