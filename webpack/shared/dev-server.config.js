const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const escape = require('escape-string-regexp');

const paths = require('../helpers/paths');


const webpackPort = process.env.PORT || '5100';

function ignoredFiles(appSrc) {
  const pathToIgnore = escape(path.normalize(`${appSrc}/`).replace(/[\\]+/g, '/'));
  return new RegExp(`^(?!${pathToIgnore}).+/node_modules/`, 'g');
}

module.exports = {
  writeToDisk: true,
  compress: true,
  clientLogLevel: 'warning',
  contentBase: paths.appPublic,
  contentBasePublicPath: paths.publicUrlOrPath,
  watchContentBase: true,
  hot: true,
  publicPath: paths.publicUrlOrPath.slice(0, -1),
  overlay: false,
  watchOptions: {
    ignored: ignoredFiles(paths.appSrc),
    aggregateTimeout: 300,
    poll: 1000,
  },
  host: 'localhost',
  port: webpackPort,
  historyApiFallback: {
    // Paths with dots should still use the history fallback.
    disableDotRule: true,
    index: paths.publicUrlOrPath,
  },
  // Allows the my.care.cru to not throw Invalid Host header
  disableHostCheck: true,
  noInfo: true,
  stats: {
    // Config for minimal console.log mess.
    assets: false,
    colors: true,
    version: true,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
  },
};
