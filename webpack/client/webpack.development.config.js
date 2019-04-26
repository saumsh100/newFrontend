
const webpack = require('webpack');
const merge = require('webpack-merge');
/* eslint-disable import/no-extraneous-dependencies */
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const devServer = require('./dev-server.config');
const { appEntries } = require('../utils');
const globals = require('../../server/config/globals');

const entries = appEntries(name => [
  'babel-polyfill',
  'react-hot-loader/patch',
  `./client/entries/${name}.js`,
]);

const {
  CI,
  INTERCOM_APP_ID,
  LOGROCKET_APP_ID,
  FEATURE_FLAG_KEY,
  MODE_ANALYTICS_ACCESS_KEY,
  GOOGLE_API_KEY,
  MY_HOST,
  API_SERVER_URL,
} = process.env;

const developmentConfig = merge(baseConfig, {
  mode: 'development',
  entry: entries('app', 'reviews', 'hub'),
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        LOGROCKET_APP_ID: JSON.stringify(
          LOGROCKET_APP_ID || '7mbzb4/carecru-development',
        ),
        INTERCOM_APP_ID: JSON.stringify(INTERCOM_APP_ID || 'enpxykhl'),
        FEATURE_FLAG_KEY: JSON.stringify(FEATURE_FLAG_KEY),
        MODE_ANALYTICS_ACCESS_KEY: JSON.stringify(MODE_ANALYTICS_ACCESS_KEY),
        GOOGLE_API_KEY: JSON.stringify(
          GOOGLE_API_KEY || 'AIzaSyA6U9et5P5Zjn4DIeZpTlBY7wNr21dvc9Q',
        ),
        CI: JSON.stringify(!!CI),
        HOST: JSON.stringify(globals.host),
        MY_HOST: JSON.stringify(MY_HOST),
        API_SERVER_URL: JSON.stringify(API_SERVER_URL),
      },
    }),

    new webpack.LoaderOptionsPlugin({ debug: true }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HardSourceWebpackPlugin(),

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
      },
    ),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'common',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
          priority: 20,
        },
      },
    },
  },

  devServer,
});

module.exports = () => developmentConfig;
