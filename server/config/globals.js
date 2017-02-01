
const path = require('path');

const root = path.normalize(__dirname + '/..');
const tokenSecret = 'notsosecret';
const tokenExpiry = '1d';

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

const vendasta = {
  apiKey: environmentVariables.VENDASTA_API_KEY,
  apiUser: environmentVariables.VENDASTA_API_USER,
};

const twilio = {
  number: environmentVariables.TWILIO_NUMBER,
  accountSid: environmentVariables.TWILIO_ACCOUNT_SID,
  authToken: environmentVariables.TWILIO_AUTH_TOKEN,
};

const mandrill = {
  apiKey: environmentVariables.MANDRILL_API_KEY,
};

module.exports = {
  root,
  tokenSecret,
  tokenExpiry,

  // Enivornment Variable Related
  env,
  port,
  bundlePort,
  db,
  vendasta,
  twilio,
  mandrill,
};
