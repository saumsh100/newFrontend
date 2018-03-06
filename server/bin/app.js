
require('../config/initializeCodeTranspiler');

const chalk = require('chalk');
const globals = require('../config/globals');
const handleErrors = require('../middleware/handleErrors');
const app = require('../config/express');
const expressReactNews = require('express-react-views');
// require('../models');
require('../_models');

// require('../config/kue');

// Uses the NODE_ENV to determine logging full stack or not
app.set('showStackError', true);

// Load in webpack configurations
// applyWebpack(app);

// Set the JSX view engine
app.set('views', `${globals.root}/views`);
app.set('view engine', 'jsx');
app.engine('jsx', expressReactNews.createEngine({
  babel: {
    presets: ['react', ['env', { targets: { node: 'current' } }]],
    plugins: [],
  },
}));

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
