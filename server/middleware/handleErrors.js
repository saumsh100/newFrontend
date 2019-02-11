
import { Error } from 'jsonapi-serializer';

const chalk = require('chalk');
const { env } = require('../config/globals');

/**
 * Logging express errors on server console and calling the
 * next middleware (which is the function below sendError)
 * All parameters are required for error handling middleware.
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function logError(err, req, res, next) {
  logger.error(chalk.red('[ERROR]', err.status ? `[${err.status}]` : '', ':', err.message));
  logger.error(err.stack);
  if (env === 'development' || env === 'test') {
    logger.error(err);
  }

  next(err);
}

/**
 * Builds the error response to the client.
 * All parameters are required for error handling middleware.
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function sendError(err, req, res, next) {
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
