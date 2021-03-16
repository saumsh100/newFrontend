'use strict';

const path = require('path');
const { paths } = require('./utils');

const { appDist } = paths;

const staticFolder = path.normalize(path.join(appDist, 'static'));
const mainReactApp = path.join(appDist, 'index.html');
const onlineBookingApp = path.join(appDist, 'my/index.html');
const apiPort = process.env.API_PORT || 5000;
const apiHost = process.env.API_HOST || 'localhost';

module.exports = {
  buildFolder: appDist,
  staticFolder,
  apiPort,
  apiHost,
  mainReactApp,
  onlineBookingApp,
};
