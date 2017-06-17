
const path = require('path');

const root = path.normalize(path.join(__dirname, (process.env.BUNDLED ? '/../..' : '/..')));
const tokenSecret = 'notsosecret';
const tokenExpiry = '30d';
const passwordHashSaltRounds = 10;

const environmentVariables = process.env;
const env = environmentVariables.NODE_ENV || 'development';
const port = environmentVariables.PORT || '5000';
const host = environmentVariables.HOST || 'carecru.dev';
const protocol = env === 'production' ? 'https' : 'http';
const bundlePort = environmentVariables.BUNDLE_PORT || '3050';
const db = {
  authKey: environmentVariables.RETHINKDB_AUTHKEY || '',
  host: environmentVariables.RETHINKDB_HOST || 'localhost',
  port: environmentVariables.RETHINKDB_PORT || '28015',
  db: environmentVariables.RETHINKDB_DB || 'carecru_development',
};

const caCert = environmentVariables.COMPOSE_CA_CERT;

const redis = {
  host: environmentVariables.REDIS_HOST || 'localhost',
  port: environmentVariables.REDIS_PORT || '6379',
  uri: environmentVariables.REDIS_URL || 'redis://localhost:6379',
};

const namespaces = {
  dash: '/dash',
  sync: '/sync',
};

const vendasta = {
  apiKey: environmentVariables.VENDASTA_API_KEY,
  apiUser: environmentVariables.VENDASTA_API_USER,
};

const twilio = {
  accountSid: environmentVariables.TWILIO_ACCOUNT_SID,
  authToken: environmentVariables.TWILIO_AUTH_TOKEN,
  phoneNumber: environmentVariables.TWILIO_NUMBER,
};

const mandrill = {
  apiKey: environmentVariables.MANDRILL_API_KEY,
};

const loader = {
  token: environmentVariables.LOADERIO,
};

const logrocket = {
  appId: environmentVariables.LOGROCKET_APP_ID,
};

const aws = {
  accessKeyId: environmentVariables.AWS_ACCESS_KEY_ID,
  secretAccessKey: environmentVariables.AWS_SECRET_ACCESS_KEY,
};

const s3 = {
  bucket: environmentVariables.S3_BUCKET || 'carecru-development',
};

s3.urlPrefix = environmentVariables.S3_URL_PREFIX || `https://${s3.bucket}.s3.amazonaws.com/`;

const staticPath = path.normalize(path.join(root, '../statics'));

module.exports = {
  staticPath,
  root,
  tokenSecret,
  tokenExpiry,
  passwordHashSaltRounds,

  // Enivornment Variable Related
  env,
  port,
  host,
  protocol,
  bundlePort,
  db,
  caCert,
  redis,
  vendasta,
  twilio,
  mandrill,
  namespaces,
  loader,
  logrocket,
  aws,
  s3,
};
