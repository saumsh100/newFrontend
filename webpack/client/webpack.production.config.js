
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const globals = require('../../server/config/globals');

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

const entryPath = name => `./client/entries/${name}.js`;
const developmentConfig = merge(baseConfig, {
  mode: 'production',

  entry: {
    app: entryPath('app'),
    reviews: entryPath('reviews'),
    my: entryPath('my'),
    hub: entryPath('hub'),
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        LOGROCKET_APP_ID: JSON.stringify(LOGROCKET_APP_ID),
        INTERCOM_APP_ID: JSON.stringify(INTERCOM_APP_ID),
        FEATURE_FLAG_KEY: JSON.stringify(FEATURE_FLAG_KEY),
        MODE_ANALYTICS_ACCESS_KEY: JSON.stringify(MODE_ANALYTICS_ACCESS_KEY),
        GOOGLE_API_KEY: JSON.stringify(GOOGLE_API_KEY),
        CI: JSON.stringify(!!CI),
        HOST: JSON.stringify(globals.host),
        MY_HOST: JSON.stringify(MY_HOST),
        API_SERVER_URL: JSON.stringify(API_SERVER_URL),
      },
    }),
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: false,
        parallel: true,
        exclude: /node_modules/,
        cache: './.uglify_cache/',
      }),
    ],
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
});

module.exports = () => developmentConfig;
