
const fs = require('fs');
const createThinky = require('thinky');
const globals = require('./globals');

let dbConfig = globals.db;
if (globals.env === 'production') {
  const caCert = fs.readFileSync(`${globals.root}/compose_ca_cert`);
  console.log('globals.caCert Buffer');
  console.log(new Buffer(globals.caCert, 'utf-8'));
  console.log('caCert from file');
  console.log(caCert);
  dbConfig = Object.assign({}, dbConfig, {
    ssl: {
      ca: new Buffer(globals.caCert, 'utf-8'),
    },
  });
}

const thinky = createThinky(dbConfig);

module.exports = thinky;
