const session = require('express-session');
const RDBStore = require('express-session-rethinkdb')(session);
const thinky = require('./thinky')

const rdbStore = new RDBStore({
  connection: thinky.r,
  table: 'session',
  sessionTimeout: 86400000,
  flushInterval: 60000,
  debug: false,
  connectOptions: {
    db: 'carecru_development'
  }
});

const sessionStore = session({
  key: 'sid',
  secret: 'my5uperSEC537(key)!',
  cookie: { maxAge: 860000 },
  store: rdbStore
})

module.exports = sessionStore