const { loadEnvs } = require('foreman/lib/envs');

// Lets load .env file with foreman
process.env = Object.assign(process.env, loadEnvs('.env'));

// Its important to be after load env
const config = require('./webpack.development.config');

config.plugins.push(new Visualizer());
module.exports = config;
