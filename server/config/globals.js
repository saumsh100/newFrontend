
const path = require('path');
const root = path.normalize(__dirname + '/..');

const environmentVariables = process.env;
const env = environmentVariables.NODE_ENV || 'development';
const port = environmentVariables.PORT || '5000';
const bundlePort = environmentVariables.BUNDLE_PORT || '3050';

module.exports = {
  root,
  env,
  port,
  bundlePort,
};
