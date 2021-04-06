'use strict';

const bodyParser = require('body-parser');
const compress = require('compression');
const express = require('express');
const subdomain = require('express-subdomain');
const handleErrors = require('./helpers/handleErrors');
const { buildFolder, mainReactApp, mySubdomain, onlineBookingApp } = require('./config');
const widgetRouter = require('./routes/widget');

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
const subdomainRouter = express.Router();
subdomainRouter.use(widgetRouter);
// This route is for the `online booking` app
subdomainRouter.get('(/*)?', (req, res, next) => {
  res.sendFile(onlineBookingApp);
});
rootRouter.use(subdomain(mySubdomain, subdomainRouter));

// Widget on the root
rootRouter.use(widgetRouter);
rootRouter.get('/my(/*)?', (req, res, next) => {
  res.sendFile(onlineBookingApp);
});
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
