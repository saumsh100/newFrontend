const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const escape = require('escape-string-regexp');
const paths = require('../helpers/paths');

const PORT = parseInt(process.env.PORT, 10) || 5000;
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || '5000';

const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/sockjs-node'
const sockPort = process.env.WDS_SOCKET_PORT;

const USE_LOCAL_BACKEND = process.env.USE_LOCAL_BACKEND === 'true';

function ignoredFiles(appSrc) {
  const pathToIgnore = escape(path.normalize(`${appSrc}/`).replace(/[\\]+/g, '/'));
  return new RegExp(
    `^(?!${pathToIgnore}).+/node_modules/`,
    'g',
  );
}

function getProxyConfig() {
  const targetToProxy = `http://${SERVER_HOST}:${SERVER_PORT}`;
  return USE_LOCAL_BACKEND
    ? {
      writeToDisk: true,
      proxy: [
        {
          target: targetToProxy,
          prependPath: true,
          ws: true,
          // Proxy all requests except HMR ws connection
          context: pathname => pathname.indexOf('/sockjs-node/') !== 0,
          bypass: (req) => {
            const filePath = path.join(paths.appPublic, req.path);

            // Return file from contentBase directory if its exists (reverse proxy)
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) return req.path;

            // If not just ask server
            return undefined;
          },
        },
      ],
    }
    : {};
}

module.exports = {
  ...getProxyConfig(),
  compress: true,
  clientLogLevel: 'warning',
  contentBase: paths.appPublic,
  contentBasePublicPath: paths.publicUrlOrPath,
  watchContentBase: true,
  hot: true,
  transportMode: 'ws',
  // Enable custom sockjs pathname for websocket connection to hot reloading server.
  // Enable custom sockjs hostname, pathname and port for websocket connection
  // to hot reloading server.
  sockHost,
  sockPath,
  sockPort,
  publicPath: paths.publicUrlOrPath.slice(0, -1),
  overlay: false,
  watchOptions: {
    ignored: ignoredFiles(paths.appSrc),
    aggregateTimeout: 300,
    poll: 1000,
  },
  https: false,
  port: PORT,
  historyApiFallback: {
    // Paths with dots should still use the history fallback.
    // See https://github.com/facebook/create-react-app/issues/387.
    disableDotRule: true,
    index: paths.publicUrlOrPath,
  },
  // Allows the my.carecru.dev to not throw Invalid Host header
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
