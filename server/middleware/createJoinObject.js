
module.exports = function createJoinObject(req, res, next) {
  req.joinObject = {};
  if (!req.query || !req.query.join) {
    return next();
  }

  const joinStrings = req.query.join.split(',');
  joinStrings.forEach((string) => {
    req.joinObject[string] = true;
  });

  next();
};
