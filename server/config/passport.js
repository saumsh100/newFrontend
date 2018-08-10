const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log('==============')
    console.log('username', username)
    if (username !== 'test') {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (password !== 'test') {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, { username, id: 1 });
  },
));

passport.serializeUser((user, cb) => {
  // parse user to find id
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  // pass the complete user object using id
  cb(null, { id, username: 'test' });
});

passport.authenticationMiddleware = function () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return next({ status: 403 });
  };
};

module.exports = passport;
