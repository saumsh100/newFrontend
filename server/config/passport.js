var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('===============')
    console.log(username, password)
    if (username !== 'test') {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (password !== 'test') {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, {username, id: 1});
  }
));

passport.serializeUser(function(user, cb) {
  console.log('-------------')
  console.log(user)
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  cb(null, {id, username: 'test'});
});

module.exports = passport;