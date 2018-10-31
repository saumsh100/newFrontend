
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const { appEntries } = require('../utils');

const entries = appEntries(name => ['babel-polyfill', `./client/entries/${name}.js`]);

const developmentConfig = merge(baseConfig, {
  entry: entries('app', 'reviews', 'my', 'cc', 'connect', 'hub'),

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        LOGROCKET_APP_ID: JSON.stringify(process.env.LOGROCKET_APP_ID || '7mbzb4/carecru-development'),
        INTERCOM_APP_ID: JSON.stringify(process.env.INTERCOM_APP_ID || 'enpxykhl'),
        FEATURE_FLAG_KEY: JSON.stringify(process.env.FEATURE_FLAG_KEY),
        GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
        HOST: JSON.stringify(process.env.HOST),
      },
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['app', 'reviews', 'my', 'connect', 'hub'],
    }),
  ],
});

module.exports = developmentConfig;
