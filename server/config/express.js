
'use strict';

import { Deserializer } from 'jsonapi-serializer';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import compress from 'compression';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { staticPath, assetsPath } from './globals';

const app = express();

// TODO: configure better for just embeds, currently it is global
app.use(cors());

// Important this is placed before express.static
// Returns the compression middleware using the given options.
// The middleware will attempt to compress response bodies
// for all request that traverse through the middleware,
// based on the given options.
// Level 9 is the best compression.
app.use(
  compress({
    level: 9,
    filter(req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
  }),
);

// Bind middle ware to show favicon and set up static routes
app.use('/statics', express.static(staticPath));
app.use('/statics/assets', express.static(assetsPath));

// Allows the use of PUT and DELETE from clients that do not support those HTTP Methods
app.use(methodOverride());
app.use(cookieParser());

// Parse URL query strings into the body,
// extended=true means that we use qs as the parser for Object syntax
app.use(
  bodyParser.urlencoded({
    limit: '10mb',
    extended: true,
  }),
);

// Support for parsing application/vnd.api+json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Deserialize jsonapi request bodies
app.use(async (req, res, next) => {
  if (req.header('Content-Type') === 'application/vnd.api+json') {
    req.body = await new Deserializer({
      keyForAttribute: 'camelCase',
    }).deserialize(req.body);
  }
  next();
});

// Increased size so that Converting to PDF works
// Parses any Unicode encoding of json into the body
app.use(bodyParser.json({ limit: '10mb' }));

// Parses Buffer data into body
app.use(bodyParser.raw({ limit: '10mb' }));

// Files
app.use(fileUpload());

module.exports = app;
