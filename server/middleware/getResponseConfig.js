
const NORMALIZER = 'normalizer';
const JSONAPI = 'jsonapi';
const JSONAPI_MIMETYPE = 'application/vnd.api+json';

/**
 * getResponseConfig will parse Accept header to determine the type
 * of formatted json response
 *
 * The configurable types:
 * - normalizer
 * - jsonapi
 *
 * @param req
 * @param res
 * @param next
 */
export default function getResponseConfig(req, res, next) {
  req.responseConfig = {
    // Only useful piece of data
    type: NORMALIZER,

    // We don't do anything with this at the moment
    version: 'v1',
    format: 'json',
  };

  // If no accept MIME type set, assume normalizer
  if (req.headers && req.headers.accept && req.headers.accept === JSONAPI_MIMETYPE) {
    req.responseConfig.type = JSONAPI;
  }

  next();
}

export {
  NORMALIZER,
  JSONAPI,
  JSONAPI_MIMETYPE,
};
