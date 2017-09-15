
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
        LOGROCKET_APP_ID: JSON.stringify(process.env.LOGROCKET_APP_ID || '7mbzb4/carecru-development'),
        INTERCOM_APP_ID: JSON.stringify(process.env.INTERCOM_APP_ID || 'enpxykhl'),
      },
    }),

    new webpack.LoaderOptionsPlugin({ debug: true }),
  ],
});

module.exports = developmentConfig;
