const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const devServer = require('./dev-server.config');
const { appEntries } = require('../utils');

const entries = appEntries(name => [
  'babel-polyfill',
  'react-hot-loader/patch',
  `./client/entries/${name}.js`,
]);

const developmentConfig = merge(baseConfig, {
  entry: entries('app', 'patient'),

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        LOGROCKET_APP_ID: JSON.stringify(process.env.LOGROCKET_APP_ID || '7mbzb4/carecru-development'),
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
