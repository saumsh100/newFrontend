
const path = require('path');
const fs = require('fs');

const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || '5000';

const WP_PROXY_HOST = process.env.WP_PROXY_HOST || 'localhost';
const WP_PROXY_PORT = process.env.WP_PROXY_PORT || '5100';

console.log(`1 server ${SERVER_HOST}:${SERVER_PORT}; proxy ${WP_PROXY_HOST}:${WP_PROXY_PORT}`);

const {
  webpackProxyPort = WP_PROXY_PORT,
  webpackProxyHost = WP_PROXY_HOST,
  serverHost = SERVER_HOST,
  serverPort = SERVER_PORT,
} = require('yargs').argv;

console.log(`2 server ${serverHost}:${serverPort}; proxy ${webpackProxyHost}:${webpackProxyPort}`);

const projectRoot = process.cwd();
// targetToProxy is the node server that webpack will proxy
const targetToProxy = `http://${serverHost}:${serverPort}`;
const contentBase = path.resolve(projectRoot, 'statics');
// const publicPath = '/';

module.exports = {
  contentBase,
  // publicPath,

  port: webpackProxyPort,
  host: webpackProxyHost,

  compress: true,
  historyApiFallback: true,

  // Allows the my.carecru.dev:5100 to not throw Invalid Host header
  disableHostCheck: true,

  hot: true,

  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },

  clientLogLevel: 'warning',
  noInfo: true,

  proxy: [{
    target: targetToProxy,
    prependPath: true,
    ws: true,
    // Proxy all requests except HMR ws connection
    context: pathname => !(pathname.indexOf('/sockjs-node/') === 0),
    bypass: (req) => {
      const filePath = path.join(contentBase, req.path);

      // Return file from contentBase directory if its exists (reverse proxy)
      if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) return req.path;

      // If not just ask server
      return undefined;
    },
  }],
};
