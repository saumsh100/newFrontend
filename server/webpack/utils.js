
/**
 * Convert list of names to wepbpack mapped entries
 * @param {Function} map
 */
exports.appEntries = map => (...list) =>
  list.reduce(
    (entries, app) => Object.assign(entries, { [app]: map(app) }),
    {},
  );
