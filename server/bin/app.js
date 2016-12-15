
require('../config/initializeCodeTranspiler');

const globals = require('../config/globals');
const applyWebpack = require('../config/webpack/applyWebpack');
const handleErrors = require('../middleware/handleErrors');
const chalk = require('chalk');
const app = require('../config/express');

// require('../config/kue');

// Uses the NODE_ENV to determine logging full stack or not
app.set('showStackError', true);

// Load in webpack configurations
applyWebpack(app);


// Set the Handlebars templating engine
app.set('views', `${globals.root}/views`);
app.engine('hbs', require('../config/handlebars').engine);
app.set('view engine', 'hbs');

// Extra logging for communication with server
app.use((req, res, next) => {
  console.log(chalk.blue(req.method, req.originalUrl));
  next();
});


// Bind the routes

app.use(require('../routes'));

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
