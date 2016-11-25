
const path = require('path');
const globals = require('../globals');
const webpack = require('webpack');
const webpackConfig = require('./webpack.base.config');

webpackConfig.entry = {
  app: [
    'webpack/hot/dev-server',
    `webpack-hot-middleware/client?path=http://localhost:${globals.bundlePort}/__webpack_hmr`,
    '../../entries/app.js',
  ],
  
  embed: [
    'webpack/hot/dev-server',
    `webpack-hot-middleware/client?path=http://localhost:${globals.bundlePort}/__webpack_hmr`,
    '../../entries/embed.js',
  ],
};

webpackConfig.output = {
  path: path.join(globals.root, '/public/assets/'),
  publicPath: '/assets/',
  filename: '[name].js',
};

webpackConfig.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.optimize.CommonsChunkPlugin('app-commons.js', ['app']),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development'),
    },
  }),
];

module.exports = webpackConfig;
  