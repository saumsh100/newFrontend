
const fs = require('fs');
const createThinky = require('thinky');
const globals = require('./globals');

let dbConfig = globals.db;
console.log(dbConfig);
if (globals.env === 'production') {
  const caCert = fs.readFileSync(`${globals.root}/compose_ca_cert`, 'utf8');
  const buffer = new Buffer(globals.caCert);
  console.log('globals.caCert');
  console.log(globals.caCert);
  console.log('globals.caCert Buffer');
  console.log(buffer);
  console.log('caCert from file');
  console.log(caCert);
  dbConfig = Object.assign({}, dbConfig, {
    ssl: {
      ca: buffer,
    },
  });
}

const thinky = createThinky(dbConfig);

module.exports = thinky;
