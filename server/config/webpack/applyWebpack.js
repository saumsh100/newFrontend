
const globals = require('../globals');

module.exports = (app) => {
  // We only want to run the workflow when not in production
  if (globals.env !== 'production') {
    const httpProxy = require('http-proxy');
    const BUNDLE_PORT = globals.bundlePort;
    const proxy = httpProxy.createProxyServer();

    // We require the bundler inside the if block because
    // it is only needed in a development environment. Later
    // you will see why this is a good idea
    const bundle = require('./bundle.js');
    bundle(BUNDLE_PORT);

    // Any requests to localhost:3000/build is proxied
    // to webpack-dev-server
    app.all('/assets/*', (req, res) => {
      proxy.web(req, res, {
        target: `http://localhost:${BUNDLE_PORT}`,
      });
    });

    // It is important to catch any errors from the proxy or the
    // server will crash. An example of this is connecting to the
    // server when webpack is bundling
    proxy.on('error', () => {
      console.log('Could not connect to proxy, please try again...');
    });
  }
};
