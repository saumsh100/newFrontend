
import chalk from 'chalk';
import expressReactNews from 'express-react-views';
import EventsService from '../config/events';
import app from '../config/express';
import globals from '../config/globals';
import handleErrors from '../middleware/handleErrors';
import '../config/initializeCodeTranspiler';
import '../_models';

// Connect the EventsService and pass to express app so the
// route handlers can use it
const pub = EventsService.socket('PUB', { routing: 'topic' });
pub.connect('events');

// Set the events service for the routes to be able to use
app.set('pub', pub);

// https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', true);

// Uses the NODE_ENV to determine logging full stack or not
app.set('showStackError', true);

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
  CCLogger.info(chalk.blue(req.method, req.originalUrl));
  next();
});

// Bind the routes
app.use(require('../routes'));

// Catch errors, log and respond to client
app.use(handleErrors);

module.exports = app;
