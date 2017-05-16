const path = require('path');

/**
 * Convert list of names to wepbpack mapped entries
 * @param {Function} map
 */
exports.appEntries = map =>
  (...list) => list.reduce((entries, app) =>
    Object.assign(entries, { [app]: map(app) }), {});

/**
 * Absolute path to project root
 */
exports.projectRoot = path.normalize(path.join(__dirname, '..'));
