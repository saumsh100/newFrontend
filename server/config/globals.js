
const path = require('path');
const root = path.normalize(__dirname + '/..');

const environmentVariables = process.env;
const env = environmentVariables.NODE_ENV || 'development';
const port = environmentVariables.PORT || '5000';
const bundlePort = environmentVariables.BUNDLE_PORT || '3050';
const db = {
  authKey: environmentVariables.RETHINKDB_AUTHKEY || '',
  host: environmentVariables.RETHINKDB_HOST || 'localhost',
  port: environmentVariables.RETHINKDB_PORT || '28015',
  db: environmentVariables.RETHINKDB_DB || 'carecru_development',
};

const twilio = {
  number: environmentVariables.TWILIO_NUMBER,
  accountSid: environmentVariables.TWILIO_ACCOUNT_SID,
  authToken: environmentVariables.TWILIO_AUTH_TOKEN,
};

module.exports = {
  root,
  env,
  port,
  bundlePort,
  db,
  twilio,
};
