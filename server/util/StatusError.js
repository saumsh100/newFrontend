
// This will hopefully force others to write a descriptive message for their errors
const defaultMessage = 'WRITE A $%@#ING MESSAGE! You need to describe the error.';

/**
 * Custom Error Class to assist with HTTP responses
 *
 * @param statusCode
 * @param message
 * @constructor
 */
function StatusError(statusCode = 500, message = defaultMessage) {
  // Replaces having to use 'new ...' everywhere
  if (!(this instanceof StatusError)) {
    return new StatusError(statusCode, message);
  }

  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.status = statusCode;
}

StatusError.BAD_REQUEST = 400;
StatusError.FORBIDDEN = 403;
StatusError.NOT_FOUND = 404;
StatusError.CONFLICT = 409;
StatusError.INTERNAL_SERVER_ERROR = 500;

require('util').inherits(StatusError, Error);

module.exports = StatusError;
