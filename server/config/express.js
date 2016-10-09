
/**
 * express.js - Build app and bind all express specific middleware for parsing requests
 */

'use strict';

const globals = require('./globals');
// const favicon = require('serve-favicon');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const helmet = require('helmet');
const express = require('express');

// Initialize Express App!
const app = express();

// Applies multiple security middle-wares
app.use(helmet());

// Important this is placed before express.static
// Returns the compression middleware using the given options.
// The middleware will attempt to compress response bodies
// for all request that traverse through the middleware,
// based on the given options.
// Level 9 is the best compression.
app.use(compress({
  level: 9,
  filter(req, res) {
    return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
  },
}));

// Bind middle ware to show favicon and set up static routes
// app.use(favicon(`${globals.root}/public/images/favicon.ico`));
app.use(express.static(`${globals.root}/public`));

// Allows the use of PUT and DELETE from clients that do not support those HTTP Methods
app.use(methodOverride());

// Parse URL query strings into the body,
// extended=true means that we use qs as the parser for Object syntax
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Increased size so that Converting to PDF works
// Parses any Unicode encoding of json into the body
app.use(bodyParser.json({ limit: '10mb' }));

// Parses Buffer data into body
app.use(bodyParser.raw({ limit: '10mb' }));

app.use(cookieParser());

// Below breaks!
// app.use(multer());

// Heroku will proxy HTTPS to this HTTP application
/*if (globals.env === 'production') {
  // Assume and ensure HTTPS connections
  app.set('trust proxy', 1);
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.get('host')}${req.url}`);
    }
    
    return next();
  });
}*/

module.exports = app;
