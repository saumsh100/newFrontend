
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const devServer = require('./dev-server.config');
const { appEntries, readEnv } = require('../utils');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// TODO: path to env file should not be hardcoded
const env = readEnv(path.resolve(process.cwd(), '.env'));

// TODO: duplicate code with dev-server.config.js
const {
  serverPort = 5000,
} = require('yargs').argv;

const entries = appEntries(name => [
  'babel-polyfill',
  'react-hot-loader/patch',
  `./client/entries/${name}.js`,
]);

const {
  INTERCOM_APP_ID,
  LOGROCKET_APP_ID,
  FACEBOOK_APP_ID,
} = env;

const developmentConfig = merge(baseConfig, {
  entry: entries('app', 'patient', 'my', 'reviews', 'connect'),
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        LOGROCKET_APP_ID: `"${LOGROCKET_APP_ID || '7mbzb4/carecru-development'}"`,
        INTERCOM_APP_ID: `"${INTERCOM_APP_ID || 'enpxykhl'}"`,
        FACEBOOK_APP_ID: `"${FACEBOOK_APP_ID}"`,
        API_SERVER_PORT: `"${serverPort}"`,
      },
    }),

    new webpack.LoaderOptionsPlugin({ debug: true }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['app', 'patient', 'my', 'reviews'],
    }),

    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:3100/)
        // through BrowserSync
        proxy: 'http://localhost:5100/',
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: false,
      }
    ),
  ],

  devServer,
});

module.exports = developmentConfig;
