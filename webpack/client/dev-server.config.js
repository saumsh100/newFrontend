const path = require('path');
const fs = require('fs');

const { PORT = 5100 } = process.env;

const {
  host = 'localhost',
  serverHost = 'localhost',
  serverPort = 5000,
} = require('yargs').argv;

const projectRoot = process.cwd();
const target = `http://${serverHost}:${serverPort}`;
const contentBase = path.resolve(projectRoot, 'statics');
// const publicPath = '/';

module.exports = {
  contentBase,
  // publicPath,

  port: PORT,
  host,

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
    target,
    prependPath: true,
    ws: true,
    // Proxy all requests except HMR ws connection
    context: pathname => !(pathname.indexOf('/sockjs-node/') === 0),
    bypass: (req) => {
      const filePath = path.join(contentBase, req.path);

      // Return file from contentBase directory if its exists (reverse proxy)
      if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        return req.path;
      }

      // If not just ask server
      return undefined;
    },
  }],
};
