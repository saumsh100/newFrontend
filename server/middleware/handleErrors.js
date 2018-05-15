import { Error } from 'jsonapi-serializer';
const chalk = require('chalk');
const { env } = require('../config/globals');

function logError(err, req, res, next) {
  console.error(chalk.red('[ERROR]', (err.status) ? `[${err.status}]` : '', ':', err.message));
  console.error(err.stack);
  if (env === 'development' || env === 'test') {
    console.error(err);
  }

  next(err);
}

function sendError(err, req, res) {
  const errorStatus = err.status || 500;

  // Prepare a JsonAPI-compliant error response for clients that request it
  if (req.header('Accept') === 'application/vnd.api+json') {
    // Create a JsonAPI error object. If a collection of errors exists, multiple error
    // objects are created.
    let errors = [{ status: errorStatus, title: err.name, detail: err.message }];
    if (err.errors) {
      errors = err.errors.map((error) => {
        let errorPointer = '/';
        if (error.path) {
          errorPointer = `/data/attributes/${error.path}`;
        }

        return {
          status: errorStatus,
          source: {
            pointer: errorPointer,
          },
          title: error.type,
          detail: error.message,
        };
      });
    }

    const errorResponse = new Error(errors);
    return res.status(errorStatus).send(errorResponse);
  }

  return res.status(errorStatus).send(err.message || 'Not a StatusError');
}

module.exports = [logError, sendError];
