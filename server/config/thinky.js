
const fs = require('fs');
const createThinky = require('thinky');
const globals = require('./globals');

let dbConfig = globals.db;

if (globals.env === 'production') {
  const caCert = fs.readFileSync(`${globals.root}/compose_ca_cert`);
  dbConfig = Object.assign({}, dbConfig, {
    ssl: {
      ca: caCert,
    },
  });
}

const thinky = createThinky(dbConfig);

module.exports = thinky;
