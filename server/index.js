'use strict';

const bodyParser = require('body-parser');
const compress = require('compression');
const express = require('express');
const subdomain = require('express-subdomain');
const handleErrors = require('./helpers/handleErrors');
const { buildFolder, mainReactApp, mySubdomain } = require('./config');
const widgetRouter = require('./routes/widget');
const myRouter = require('./routes/my');

/**
 * App Variables
 */

const server = express();
server.disable('x-powered-by');
const port = parseInt(process.env.PORT || '80', 10);

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
subdomainRouter.use(myRouter);
rootRouter.use(subdomain(mySubdomain, subdomainRouter));

// Widget on the root
rootRouter.use(widgetRouter);
rootRouter.use(myRouter);
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
