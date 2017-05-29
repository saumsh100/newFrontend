const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const devServer = require('./dev-server.config');
const { appEntries, readEnv } = require('../utils');

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
  LOGROCKET_APP_ID,
  FACEBOOK_APP_ID,
} = env;

const developmentConfig = merge(baseConfig, {
  entry: entries('app', 'patient'),

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        LOGROCKET_APP_ID: `"${LOGROCKET_APP_ID || '7mbzb4/carecru-development'}"`,
        FACEBOOK_APP_ID: `"${FACEBOOK_APP_ID}"`,
        API_SERVER_PORT: `"${serverPort}"`,
      },
    }),

    new webpack.LoaderOptionsPlugin({ debug: true }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['app', 'patient'],
    }),
  ],

  devServer,
});

module.exports = developmentConfig;
