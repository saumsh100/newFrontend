
const path = require('path');
const globals = require('../globals');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');

const hotMiddlewareApp = `webpack-hot-middleware/client?path=http://localhost:${globals.bundlePort}/__webpack_hmr`;
const extendWithDevApps = apps =>
  ['webpack/hot/dev-server', hotMiddlewareApp].concat(apps);

const developmentConfig = merge(baseConfig, {
  entry: {
    app: extendWithDevApps('../../entries/app.js'),
    patient: extendWithDevApps('../../entries/patient.js'),
  },

  output: {
    path: path.join(globals.root, '/public/assets/'),
    publicPath: '/assets/',
    filename: '[name].js',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['app', 'patient'],
    }),
  ],
});

module.exports = developmentConfig;
