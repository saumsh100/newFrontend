
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const { appEntries } = require('../utils');

const entries = appEntries(name => [
  'babel-polyfill',
  `./client/entries/${name}.js`,
]);

const developmentConfig = merge(baseConfig, {
  entry: entries('cc'),

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        LOGROCKET_APP_ID: `"${process.env.LOGROCKET_APP_ID || '7mbzb4/carecru-development'}"`,
        INTERCOM_APP_ID: `"${process.env.INTERCOM_APP_ID || 'enpxykhl'}"`,
        FEATURE_FLAG_KEY: `"${process.env.FEATURE_FLAG_KEY || '5a332a3c95e24c205546f0df'}"`,
      },
    }),

    new webpack.LoaderOptionsPlugin({ debug: true }),
  ],
});

module.exports = developmentConfig;
