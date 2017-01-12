
const chalk = require('chalk');
const globals = require('../config/globals');

function logError(err, req, res, next) {
  console.log(chalk.red('[ERROR]', (err.status) ? `[${err.status}]` : '', ':', err.message));
  if (globals.env === 'development') console.error(err);
  next(err);
}

function sendError(err, req, res, next) {
  return res.status(err.status || 500).send(err.message || 'Not a StatusError');
}

module.exports = [logError, sendError];
