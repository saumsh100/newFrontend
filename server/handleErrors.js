
const { Error } = require('jsonapi-serializer');
const pino = require('pino');

const { env } = process;
const logger = { logLevel: env.LOG_LEVEL || 'debug' };

const CCLogger = pino({
  level: logger.logLevel,
  ...(env.NODE_ENV === 'development' && {
    prettyPrint: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: true,
    },
  }),
  ...(env.NODE_ENV === 'test' && {
    prettyPrint: {
      ignore: 'pid,hostname',
    },
  }),
});

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
  CCLogger.error(err.status, err.message, `\n${err.stack}`);
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

    const errors = err.errors
      ? err.errors.map(error => ({
        status: errorStatus,
        source: {
          pointer: error.path ? `/data/attributes/${error.path}` : '/',
        },
        title: error.type,
        detail: error.message,
      }))
      : [
        {
          status: errorStatus,
          title: err.name,
          detail: err.message,
        },
      ];

    const errorResponse = new Error(errors);
    return res.status(errorStatus).send(errorResponse);
  }

  return res.status(errorStatus).send(err.message || 'Not a StatusError');
}

module.exports = [logError, sendError];
