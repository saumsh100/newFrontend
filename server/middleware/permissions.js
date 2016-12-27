module.exports = function checkPermission(permission) {
  // permission = 'listings:read'
  permission = permission.split(':')
  const entity = permission[0]
  const action = permission[1]
  return function middleware (req, res, next) {
    if (req.permissions[entity] && req.permissions[entity][action]) {
      return next()
    }
    return next({status: 404})
  }
}
