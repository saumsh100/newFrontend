'use strict';

const path = require('path');
const { paths } = require('./helpers/utils');

const { appDist } = paths;

const staticFolder = path.normalize(path.join(appDist, 'static'));
const mainReactApp = path.join(appDist, 'index.html');
const onlineBookingApp = path.join(appDist, 'my/index.html');
const reviewsApp = path.join(appDist, 'reviews/index.html');

module.exports = {
  buildFolder: appDist,
  staticFolder,
  apiServer: process.env.API_SERVER,
  apiHost: process.env.API_HOST,
  apiPort: process.env.API_PORT,
  apiProtocol: process.env.API_PROTOCOL,
  mainReactApp,
  onlineBookingApp,
  reviewsApp,
};
