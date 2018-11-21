
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.base.config');

const entryPath = name => `./client/entries/${name}.js`;

const developmentConfig = merge(baseConfig, {
  mode: 'production',

  entry: {
    app: entryPath('app'),
    reviews: entryPath('reviews'),
    my: entryPath('my'),
    connect: entryPath('connect'),
    hub: entryPath('hub'),
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        LOGROCKET_APP_ID: JSON.stringify(process.env.LOGROCKET_APP_ID || '7mbzb4/carecru-development'),
        INTERCOM_APP_ID: JSON.stringify(process.env.INTERCOM_APP_ID || 'enpxykhl'),
        FEATURE_FLAG_KEY: JSON.stringify(process.env.FEATURE_FLAG_KEY),
        GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
        CI: JSON.stringify(process.env.CI || false),
      },
    }),
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: false,
        parallel: true,
        exclude: /node_modules/,
        cache: './.uglify_cache/'
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
          priority: 20
        }
      }
    }
  }
});

module.exports = () => developmentConfig;
