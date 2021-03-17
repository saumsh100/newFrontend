const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const escape = require('escape-string-regexp');
const paths = require('../helpers/paths');

const serverHost = process.env.SERVER_HOST || 'localhost';
const serverPort = process.env.SERVER_PORT || '5000';

const webpackProxyHost = process.env.WP_PROXY_HOST || 'localhost';
const webpackProxyPort = process.env.WP_PROXY_PORT || '5100';

const shouldNotUseLocalBackend = process.env.USE_LOCAL_BACKEND === 'false';

function ignoredFiles(appSrc) {
  const pathToIgnore = escape(path.normalize(`${appSrc}/`).replace(/[\\]+/g, '/'));
  return new RegExp(
    `^(?!${pathToIgnore}).+/node_modules/`,
    'g',
  );
}

function getProxyConfig() {
  if (shouldNotUseLocalBackend) {
    return {};
  }
  console.log(`2 server ${serverHost}:${serverPort}; proxy ${webpackProxyHost}:${webpackProxyPort}`);
  const targetToProxy = `http://${serverHost}:${serverPort}`;

  return {
    // Allow us to develop the with the frontend being served by the backend through npm link
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
  };
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
  port: webpackProxyPort,
  host: webpackProxyHost,
  historyApiFallback: {
    // Paths with dots should still use the history fallback.
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
  ...getProxyConfig(),
};
