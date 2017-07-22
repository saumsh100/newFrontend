
const chalk = require('chalk');
const { env } = require('../config/globals');

function logError(err, req, res, next) {
  console.log(chalk.red('[ERROR]', (err.status) ? `[${err.status}]` : '', ':', err.message));
  console.log(env);
  if (env === 'development' || env === 'test') {
    console.error(err);
  }

  next(err);
}

function sendError(err, req, res, next) {
  console.log(err.message);
  return res.status(err.status || 500).send(err.message || 'Not a StatusError');
}

module.exports = [logError, sendError];
