const { loadEnvs } = require('foreman/lib/envs');

// Lets load .env file with foreman
process.env = Object.assign(process.env, loadEnvs('.env'));

module.exports = require('./webpack.development.config');
