'use strict';

const bodyParser = require('body-parser');
const compress = require('compression');
const express = require('express');
const subdomain = require('express-subdomain');
const handleErrors = require('./handleErrors');
const { buildFolder, mainReactApp } = require('./config');
const getMyRouter = require('./routes/my');

/**
 * App Variables
 */

const server = express();
server.disable('x-powered-by');
const port = 80;

/**
 *  App Configuration
 */
server.use(
  compress({
    level: 9,
    filter(req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
  }),
);

// Bind middleware to show favicon and set up static routes
server.use('/', express.static(buildFolder));

// Parse URL query strings into the body,
// extended=true means that we use qs as the parser for Object syntax
server.use(
  bodyParser.urlencoded({
    limit: '10mb',
    extended: true,
  }),
);

/**
 * Routes Definitions
 */
const rootRouter = express.Router();

// Bind subdomain capturing
rootRouter.use(subdomain('my', require('./routes/widget')));

const myRouter = getMyRouter(false);
rootRouter.use('/my', myRouter);

// Bind online booking routes
// rootRouter.use('/my', require('./routes/onlinebooking'));


/**
 * Server Activation
 */

// All other traffic, just render app
rootRouter.get('(/*)?', async (req, res, next) => {
  res.sendFile(mainReactApp);
});

server.use(rootRouter);

// Catch errors, log and respond to client
server.use(handleErrors);

server.listen(port, () => {
  console.log(`Listening to requests on http://127.0.0.1:${port}`);
});