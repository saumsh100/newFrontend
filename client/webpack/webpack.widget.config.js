
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const { appEntries } = require('./utils');

const entries = appEntries(name => [
  'babel-polyfill',
  'react-hot-loader/patch',
  `./entries/${name}.js`,
]);

const {
  LOGROCKET_APP_ID,
  INTERCOM_APP_ID,
  FEATURE_FLAG_KEY,
  MY_HOST,
  API_SERVER_URL,
} = process.env;

const developmentConfig = merge(baseConfig, {
  entry: entries('cc'),
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        LOGROCKET_APP_ID: `"${LOGROCKET_APP_ID ||
          '7mbzb4/carecru-development'}"`,
        INTERCOM_APP_ID: `"${INTERCOM_APP_ID || 'enpxykhl'}"`,
        FEATURE_FLAG_KEY: `"${FEATURE_FLAG_KEY || '5a332a3c95e24c205546f0df'}"`,
        MY_HOST: JSON.stringify(MY_HOST),
        API_SERVER_URL: JSON.stringify(API_SERVER_URL),
      },
    }),
  ],
});

module.exports = developmentConfig;
