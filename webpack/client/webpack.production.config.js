
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const { appEntries } = require('../utils');

const entries = appEntries(name => [
  'babel-polyfill',
  `./client/entries/${name}.js`,
]);

console.log('INTERCOM_APP_ID', process.env.INTERCOM_APP_ID);

const developmentConfig = merge(baseConfig, {
  entry: entries('app', 'reviews', 'my', 'cc', 'connect'),

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        LOGROCKET_APP_ID: JSON.stringify(process.env.LOGROCKET_APP_ID || '7mbzb4/carecru-development'),
        INTERCOM_APP_ID: JSON.stringify(process.env.INTERCOM_APP_ID || 'enpxykhl'),
        FEATURE_FLAG_KEY: JSON.stringify(process.env.FEATURE_FLAG_KEY),
      },
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['app', 'reviews', 'my', 'connect'],
    }),
  ],
});

module.exports = developmentConfig;
