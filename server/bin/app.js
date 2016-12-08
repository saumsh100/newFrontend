
require('../config/initializeCodeTranspiler');

const globals = require('../config/globals');
const applyWebpack = require('../config/webpack/applyWebpack');
const handleErrors = require('../middleware/handleErrors');
const auth = require('../middleware/auth');
const chalk = require('chalk');
const app = require('../config/express');
const cookieParser = require('cookie-parser');
const session = require('../config/session')
const passport = require('../config/passport')
const sessionRouter = require('../routes/api/session')


// require('../config/kue');

// Uses the NODE_ENV to determine logging full stack or not
app.set('showStackError', true);

// Load in webpack configurations
applyWebpack(app);

// Set the Handlebars templating engine
app.set('views', `${globals.root}/views`);
app.engine('hbs', require('../config/handlebars').engine);
app.set('view engine', 'hbs');

// Apple the configured Express-Session middleware
// app.use(session);

// Bind Passport Authentication Middleware
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(auth);

// Extra logging for communication with server
app.use((req, res, next) => {
  console.log(chalk.blue(req.method, req.originalUrl));
  next();
});

app.use(cookieParser());
// Bind the routes
app.use(require('../routes'));

app.use(session);
app.use(passport.initialize());
app.use(passport.session());


app.use('/auth/session', sessionRouter);


// Catch errors, log and respond to client
app.use(handleErrors);

// assume 404 since no middleware responded
/*app.use((req, res) => {
  res.status(404).render('404', {
    url: req.originalUrl,
    error: 'Not found',
  });
});*/

module.exports = app;
