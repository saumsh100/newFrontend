'use strict';

const path = require('path');
const { paths } = require('./helpers/utils');

const { appDist } = paths;

const staticFolder = path.normalize(path.join(appDist, 'static'));
const mainReactApp = path.join(appDist, 'index.html');
const onlineBookingApp = path.join(appDist, 'my/index.html');
const reviewsApp = path.join(appDist, 'reviews/index.html');

const {
  API_SERVER,
  API_SERVER_PROTOCOL = 'http',
  API_SERVER_HOST = 'localhost',
  API_SERVER_PORT = '5000',
  MY_SUBDOMAIN = 'my'
} = process.env;

module.exports = {
  buildFolder: appDist,
  staticFolder,
  apiServer: API_SERVER || `${API_SERVER_PROTOCOL}://${API_SERVER_HOST}:${API_SERVER_PORT}`,
  apiHost: API_SERVER_HOST,
  apiPort: API_SERVER_PORT,
  apiProtocol: API_SERVER_PROTOCOL,
  mainReactApp,
  onlineBookingApp,
  reviewsApp,
  mySubdomain: MY_SUBDOMAIN
};
